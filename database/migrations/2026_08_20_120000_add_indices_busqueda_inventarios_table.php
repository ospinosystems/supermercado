<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class AddIndicesBusquedaInventariosTable extends Migration
{
    /**
     * Índices de apoyo a la búsqueda de productos.
     *
     * Ojo con lo que sí y lo que no aceleran:
     *  - codigo_barras YA tiene índice único desde la migración original.
     *  - codigo_proveedor y descripcion sirven para la búsqueda exacta
     *    (lector de código) y para la avanzada, que usa LIKE "texto%".
     *  - cantidad es la columna de orden por defecto; su índice evita el
     *    filesort del listado.
     *  - La búsqueda principal usa LIKE "%texto%": el comodín inicial impide
     *    usar cualquier índice B-tree, así que esa consulta seguirá haciendo
     *    recorrido completo. Para acelerarla haría falta FULLTEXT + MATCH.
     */
    private $indices = [
        "inventarios_codigo_proveedor_index" => "codigo_proveedor",
        "inventarios_descripcion_index"      => "descripcion",
        "inventarios_cantidad_index"         => "cantidad",
    ];

    private function existe($nombre)
    {
        $filas = DB::select(
            "SELECT 1 FROM information_schema.statistics
              WHERE table_schema = DATABASE()
                AND table_name = 'inventarios'
                AND index_name = ?
              LIMIT 1",
            [$nombre]
        );

        return count($filas) > 0;
    }

    public function up()
    {
        foreach ($this->indices as $nombre => $columna) {
            if ($this->existe($nombre)) {
                continue;
            }
            Schema::table('inventarios', function (Blueprint $table) use ($nombre, $columna) {
                $table->index($columna, $nombre);
            });
        }
    }

    public function down()
    {
        foreach ($this->indices as $nombre => $columna) {
            if (!$this->existe($nombre)) {
                continue;
            }
            Schema::table('inventarios', function (Blueprint $table) use ($nombre) {
                $table->dropIndex($nombre);
            });
        }
    }
}
