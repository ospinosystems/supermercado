<?php

namespace App\Http\Controllers;

use App\Models\sucursal;


use Illuminate\Http\Request;
use Mike42\Escpos;
use Mike42\Escpos\Printer;
use Mike42\Escpos\EscposImage;
use Mike42\Escpos\PrintConnectors\WindowsPrintConnector;
use Mike42\Escpos\PrintConnectors\FilePrintConnector;
use Mike42\Escpos\PrintBuffers\ImagePrintBuffer;
use Mike42\Escpos\CapabilityProfiles\DefaultCapabilityProfile;
use Mike42\Escpos\CapabilityProfiles\SimpleCapabilityProfile;
use Response;

class tickera extends Controller
{
    const RUTA_INTTFHKA = "C:/IntTFHKA";

    /**
     * Lee Retorno.txt sin reventar si el archivo no existe (la impresora
     * apagada o el .exe que nunca llegó a escribirlo).
     * Devuelve el contenido completo para el log y la última línea, que es
     * lo que el SDK considera la respuesta del comando.
     */
    private function leerRetornoFiscal()
    {
        $ruta = self::RUTA_INTTFHKA."/Retorno.txt";
        $vacio = ["completo" => "", "ultima" => ""];

        if (!is_file($ruta) || !is_readable($ruta)) {
            return $vacio;
        }
        $contenido = @file_get_contents($ruta);
        if ($contenido === false) {
            return $vacio;
        }

        $lineas = preg_split('/
|
|
/', rtrim($contenido, "
"));

        return [
            "completo" => $contenido,
            "ultima"   => $lineas ? trim(end($lineas)) : "",
        ];
    }

    /**
     * Interpreta la respuesta de SendFileCmd, que devuelve cuántas líneas del
     * lote procesó la impresora.
     */
    private function evaluarRetornoFiscal($respuesta, $lineasEnviadas = null)
    {
        $respuesta = trim($respuesta);

        if ($respuesta === "") {
            return "SIN RESPUESTA - revisar conexión/encendido de la impresora fiscal";
        }
        if ($respuesta === "NAK") {
            return "RECHAZADO POR LA IMPRESORA (NAK)";
        }
        if ($lineasEnviadas !== null && is_numeric($respuesta)) {
            $procesadas = (int) $respuesta;
            if ($procesadas >= $lineasEnviadas) {
                return "OK - procesó ".$procesadas." de ".$lineasEnviadas." líneas";
            }
            return "INCOMPLETO - procesó ".$procesadas." de ".$lineasEnviadas." líneas";
        }

        return "REVISAR - respuesta no reconocida";
    }

    /**
     * Deja constancia en storage/logs/fiscal/ de cada impresión: el comando
     * exacto que se le mandó a la máquina y lo que contestó.
     * Nunca lanza: un fallo de log no puede impedir que se facture.
     */
    private function logFiscal(array $datos)
    {
        try {
            $dir = storage_path("logs/fiscal");
            if (!is_dir($dir)) {
                @mkdir($dir, 0777, true);
            }
            if (!is_dir($dir)) {
                return;
            }

            $sep = str_repeat("=", 76);
            $sub = str_repeat("-", 76);

            $txt  = $sep."
";
            $txt .= "[".date("Y-m-d H:i:s")."] ".(isset($datos["operacion"]) ? $datos["operacion"] : "FISCAL")."
";

            $contexto = isset($datos["contexto"]) ? $datos["contexto"] : [];
            $contexto["usuario"] = session("usuario") ? session("usuario") : "-";
            foreach ($contexto as $clave => $valor) {
                $txt .= "  ".str_pad($clave.":", 16).$valor."
";
            }

            $txt .= $sub."
 COMANDO ENVIADO
".$sub."
";
            $txt .= isset($datos["comando"]) ? rtrim($datos["comando"], "
")."
" : "(vacío)
";

            if (!empty($datos["sentencia"])) {
                $txt .= $sub."
 EJECUTADO
".$sub."
".$datos["sentencia"]."
";
                if (isset($datos["salida"]) && trim((string) $datos["salida"]) !== "") {
                    $txt .= "salida: ".trim((string) $datos["salida"])."
";
                }
            }

            $txt .= $sub."
 RESPUESTA (Retorno.txt)
".$sub."
";
            $respuesta = isset($datos["respuesta"]) ? rtrim((string) $datos["respuesta"], "
") : "";
            $txt .= ($respuesta !== "" ? $respuesta : "(archivo vacío o inexistente)")."
";

            $txt .= $sub."
 RESULTADO: ".(isset($datos["resultado"]) ? $datos["resultado"] : "-")."
";
            $txt .= $sep."

";

            @file_put_contents($dir."/fiscal-".date("Y-m-d").".log", $txt, FILE_APPEND | LOCK_EX);
        } catch (\Throwable $e) {
            // Silencio a propósito: el log no puede tumbar la facturación.
        }
    }


    function reportefiscal(Request $req) {
        $type = $req->type;

        if ($type=="x") {
            $cmd = "I0X";
        }else if($type=="z"){
            $cmd = "I0Z";
        }else{
            return Response::json(["msj"=>"Error: tipo de reporte inválido","estado"=>false]);
        }

        $sentencia = self::RUTA_INTTFHKA."/IntTFHKA.exe SendCmd(".$cmd;

        $salida = shell_exec($sentencia);

        $retorno = $this->leerRetornoFiscal();

        $this->logFiscal([
            "operacion" => "REPORTE ".strtoupper($type),
            "contexto"  => ["comando" => $cmd],
            "comando"   => $cmd,
            "sentencia" => $sentencia,
            "salida"    => $salida,
            "respuesta" => $retorno["completo"],
            "resultado" => $this->evaluarRetornoFiscal($retorno["ultima"]),
        ]);

        return $retorno["ultima"];
    }
    /**
     * Deja un valor listo para un comando de la máquina fiscal: una sola línea,
     * sólo ASCII imprimible y recortado al largo que acepta el campo.
     */
    private function limpiarCampoFiscal($valor, $max)
    {
        if (!isset($valor)) {
            return "";
        }
        $valor = str_replace(["\r", "\n", "\t"], " ", $valor);
        $valor = strtr($valor, [
            "á"=>"a", "é"=>"e", "í"=>"i", "ó"=>"o", "ú"=>"u", "ü"=>"u", "ñ"=>"n",
            "Á"=>"A", "É"=>"E", "Í"=>"I", "Ó"=>"O", "Ú"=>"U", "Ü"=>"U", "Ñ"=>"N",
        ]);
        $valor = preg_replace('/[^\x20-\x7E]/', '', $valor);
        $valor = trim(preg_replace('/\s+/', ' ', $valor));

        return substr($valor, 0, $max);
    }
    public function imprimir(Request $req)
    {

        function addSpaces($string = '', $valid_string_length = 0) {
            if (strlen($string) < $valid_string_length) {
                $spaces = $valid_string_length - strlen($string);
                for ($index1 = 1; $index1 <= $spaces; $index1++) {
                    $string = $string . ' ';
                }
            }

            return $string;
        }
        
        $get_moneda = (new PedidosController)->get_moneda();
        $moneda_req = $req->moneda;
        //$
        //bs
        //cop
        if ($moneda_req=="$") {
          $dolar = 1;
        }else if($moneda_req=="bs"){
          $dolar = $get_moneda["bs"];
        }else if($moneda_req=="cop"){
          $dolar = $get_moneda["cop"];
        }else{
          $dolar = $get_moneda["bs"];
        }

        $pedido = (new PedidosController)->getPedido($req,floatval($dolar));
        $sucursal = sucursal::all()->first();
        $fecha_emision = date("Y-m-d H:i:s");

        try {
            if (str_contains($req->fiscal,"si")) {
               /*  $factura = array(
                0 => "!000000100000001000Harina\n",
                1 => "!000000150000001500Jamon\n",
                2 => '"000000205000003000Patilla\n',
                3 => "#000005000000001000Caja de Whisky\n",
                4 => "101"); */

                $factura = [];

                $nombres = $this->limpiarCampoFiscal($req->nombres, 40);
                $identificacion = $this->limpiarCampoFiscal($req->identificacion, 20);

                // Cada comando debe ir en su propia línea. Sin el salto, "iS*" e
                // "iR*" quedaban pegados entre sí y al primer renglón de producto,
                // la impresora recibía un comando inválido y descartaba la razón
                // social y la identificación del cliente.
                if ($nombres != "") {
                    array_push($factura,("iS*".$nombres."\n"));
                }
                if ($identificacion != "") {
                    array_push($factura,("iR*".$identificacion."\n"));
                }

                foreach ($pedido->items as $val) {
    
                    $items[] = [
                        'descripcion' => $val->producto->descripcion,
                        'codigo_barras' => $val->producto->codigo_barras,
                        'pu' => $val->producto->precio,
                        'cantidad' => $val->cantidad,
                        'totalprecio' => $val->total,
                       
                    ];

                    // La base imponible sale de la tasa del propio producto,
                    // no de un 16% fijo: el precio guardado ya trae el impuesto.
                    $ivaProducto = floatval($val->producto->iva);
                    $precioFull = $ivaProducto!=0?($val->producto->precio)/(1+($ivaProducto/100)):$val->producto->precio;
                    if (str_contains($req->fiscal,"devolucion")) {
                        $exentogravable = $val->producto->iva!=0?"d1":"d0";
                        
                    }else{
                        $exentogravable = $val->producto->iva!=0?"!":" ";
                    }
                    // 000000100 000001000
                    
                    $precio = str_pad(number_format($precioFull, 1, '', ''), 9, '0', STR_PAD_LEFT);
                    $ct = str_pad(number_format($val->cantidad, 3, '', ''), 9, '0', STR_PAD_LEFT);
                    $desc = $val->producto->descripcion;
                    
                    
                    array_push($factura,$exentogravable.$precio."$ct".$desc."\n");
                    if ($val->descuento) {
                        array_push($factura, number_format($val->descuento, 2, '', '')."\n");
                    }
                }
                array_push($factura,"101");

                $contenidoLote = implode("", $factura);

                $file = self::RUTA_INTTFHKA."/Factura.txt";
                $fp = fopen($file, "w+");
                $write = fputs($fp, "");

                foreach($factura as $campo => $cmd)
                {
                    $write = fputs($fp, $cmd);
                }

                fclose($fp);
                $sentencia = self::RUTA_INTTFHKA."/IntTFHKA.exe SendFileCmd(".$file;

                $salida = shell_exec($sentencia);

                $retorno = $this->leerRetornoFiscal();

                $this->logFiscal([
                    "operacion" => str_contains($req->fiscal,"devolucion") ? "NOTA DE CREDITO" : "FACTURA FISCAL",
                    "contexto"  => [
                        "pedido"         => $pedido->id,
                        "identificacion" => $identificacion !== "" ? $identificacion : "(no enviada)",
                        "razon social"   => $nombres !== "" ? $nombres : "(no enviada)",
                        "items"          => count($pedido->items),
                        "lineas lote"    => count($factura),
                        "archivo"        => $file,
                    ],
                    "comando"   => $contenidoLote,
                    "sentencia" => $sentencia,
                    "salida"    => $salida,
                    "respuesta" => $retorno["completo"],
                    "resultado" => $this->evaluarRetornoFiscal($retorno["ultima"], count($factura)),
                ]);

                return $retorno["ultima"];

            }else{
                $connector = new WindowsPrintConnector($sucursal->tickera);
                //smb://computer/printer
                $printer = new Printer($connector);
                $printer->setEmphasis(true);
    
                $nombres = "";
                $identificacion = "";
                if (isset($req->nombres)) {
                    $nombres = $req->nombres;
                }
                if (isset($req->identificacion)) {
                    $identificacion = $req->identificacion;
                }
    
                if ($nombres=="precio" && $identificacion=="precio") {
                    if($pedido->items){
    
                        foreach ($pedido->items as $val) {
    
                            $items[] = [
                                'descripcion' => $val->producto->descripcion,
                                'codigo_barras' => $val->producto->codigo_barras,
                                'pu' => $val->producto->precio,
                                'cantidad' => $val->cantidad,
                                'totalprecio' => $val->total,
                               
                            ];
                        }
                    }
                    $printer->setJustification(Printer::JUSTIFY_CENTER);
                   
                    foreach ($items as $item) {
    
                        //Current item ROW 1
    
                        $printer->setEmphasis(true);
                        $printer->text($sucursal->nombre_registro);
    
                        $printer->setEmphasis(false);
                        $printer->text("\n");
                        $printer->text($item['codigo_barras']);
                       $printer->text("\n");
                       $printer->text($item['descripcion']);
                       $printer->text("\n");
    
                        $printer->setEmphasis(true);
    
                       $printer->text($item['pu']);
                       $printer->setEmphasis(false);
                       
                       $printer->text("\n");
    
                        $printer->feed();
                    }
                }else{
    
                    $printer->setJustification(Printer::JUSTIFY_CENTER);
    
                    //$tux = EscposImage::load(resource_path() . "/images/small.jpg", false);
                    //$printer -> bitImage($tux);
                    $printer -> setTextSize(1,1);
    
                    $printer -> text("\n");
                    $printer -> text($sucursal->nombre_registro." ".$sucursal->rif);
                    $printer -> text("\n");
                    $printer -> text($sucursal->telefono1." | ".$sucursal->telefono2);
                    $printer -> text("\n");
                    $printer->setEmphasis(false);
    
    
                    $printer->setJustification(Printer::JUSTIFY_CENTER);
    
                    $printer -> setTextSize(1,1);
    
                    
                    
    
                    $printer->text("NOTA DE ENTREGA #".$pedido->id);
                    $printer -> text("\n");
    
                    $printer->setEmphasis(false);
    
                    $printer -> text("\n");
                    if ($nombres!="") {
                        $printer->setJustification(Printer::JUSTIFY_LEFT);
                        $printer -> text("Nombre y Apellido: ".$nombres);
                        $printer -> text("\n");
                        $printer -> text("ID: ".$identificacion);
                        $printer -> text("\n");
                        $printer->setJustification(Printer::JUSTIFY_LEFT);
    
                        // $printer -> text("Teléfono: ".$tel);
                        // $printer -> text("\n");
                        // $printer->setJustification(Printer::JUSTIFY_LEFT);
    
                        // $printer -> text("Dirección: ".$dir);
                        // $printer -> text("\n");
                        // $printer->setJustification(Printer::JUSTIFY_LEFT);
    
    
                    }
    
    
    
                    
                    $printer->feed();
                    $printer->setPrintLeftMargin(0);
                    $printer->setJustification(Printer::JUSTIFY_LEFT);
                    
                    $printer->setEmphasis(false);
                    $items = [];
                    $monto_total = 0;
    
                    if($pedido->items){
    
                        foreach ($pedido->items as $val) {
    
                            $items[] = [
                                'descripcion' => $val->producto->descripcion,
                                'pu' => $val->producto->precio,
                                'cantidad' => $val->cantidad,
                                'totalprecio' => $val->total,
                                // Mismo criterio que el lote fiscal: la tasa del producto
                                // decide si el renglon es gravable (G) o exento (E).
                                'marca' => floatval($val->producto->iva)!=0 ? "G" : "E",
                               
                            ];
                        }
                    }
                   
                    foreach ($items as $item) {
    
                        //Current item ROW 1
                        $printer->setEmphasis(true);
                       $printer->text($item['marca']." ".$item['descripcion']);
                    $printer->setEmphasis(false);
                       $printer->text("\n");
    
                       $printer->text(addSpaces("Ct. ".$item['cantidad'],12)." | ");
                       //$printer->text("\n");
                       
                       $printer->text(addSpaces("P/U. ".$item['pu'],13)." | ");
                       //$printer->text("\n");
    
                       $printer->text(addSpaces("Tot. ".$item['totalprecio'],15));
                       $printer->text("\n");
    
    
                    }
                        $printer->feed();
                    $printer->setEmphasis(true);
    
    
    
                    $printer->setEmphasis(false);
                    $printer->text("E = Exento | G = Gravable");
                    $printer->text("\n\n");
                    $printer->setEmphasis(true);

                    // Mismo desglose que la factura fiscal: sale de getPedido, que ya
                    // entrega exento/gravable/monto_iva en la moneda solicitada.
                    // Antes se imprimia $pedido->iva, una propiedad que no existe, y
                    // el monto salia siempre vacio.
                    $printer->text("Sub-Total: ".$pedido->subtotal);
                    $printer->text("\n");
                    $printer->text("Desc: ".$pedido->total_des);
                    $printer->text("\n");
                    $printer->text("Monto Exento: ".$pedido->exento);
                    $printer->text("\n");
                    $printer->text("Base Imponible: ".$pedido->gravable);
                    $printer->text("\n");
                    $printer->text("IVA (".$pedido->ivas."): ".$pedido->monto_iva);
                    $printer->text("\n");
                    $msj1 = "";
                    $msj2 = "";
                    if ($dolar==1) {
                        $msj1 = "REF. ";
                        $msj2 = "";
                    }else{
                        $msj1 = "Bs. ";
                        if ($pedido->total&&$dolar) {
                            # code...
                               // $msj2 = "   REF. ".number_format($pedido->total/$dolar);
                        }
                    }
                    $printer->text("Total: ".$msj1.$pedido->total.$msj2);
                    $printer->text("\n");
    
                    $printer->setEmphasis(true);
    
                    $printer->text("\n");
                    $printer->setJustification(Printer::JUSTIFY_CENTER);
                    $printer->text($pedido->created_at);
                    $printer->text("\n");
    
                    $printer->text("¡Muchas gracias por su compra! :D");
                    $printer->text("\n");
    
                    $printer->text("\n");
                    $printer->text("\n");
                    
                  
    
    
                }
    
    
                
    
                $printer->cut();
                $printer->pulse();
                $printer->close();
    
                return Response::json(["msj"=>"Imprimiendo...","estado",true]);
            }

        } catch (Exception $e) {
          return Response::json(["msj"=>"Error: ".$e->getMessage(),"estado",false]);
            
        }
    }
}
