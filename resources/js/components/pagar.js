import {useEffect,useState} from 'react';

import Modaladdproductocarrito from './Modaladdproductocarrito';
import ModaladdPersona from './ModaladdPersona';
import Modalconfigcredito from './Modalconfigcredito';



export default function Pagar({
changeEntregado,
setPagoPedido,
viewconfigcredito,
setviewconfigcredito,
fechainiciocredito,
setfechainiciocredito,
fechavencecredito,
setfechavencecredito,
formatopagocredito,
setformatopagocredito,
datadeudacredito,
setdatadeudacredito,
setconfigcredito,

setPrecioAlternoCarrito,
setCtxBultoCarrito,

addRefPago,
delRefPago,
refPago,
setrefPago,

pedidosFast,
pedidoData,
getPedido,
debito,
setDebito,
efectivo,
setEfectivo,
transferencia,
setTransferencia,
credito,
setCredito,

vuelto,
setVuelto,

number,
delItemPedido,
setDescuento,
setDescuentoUnitario,
setDescuentoTotal,
setCantidadCarrito,

toggleAddPersona,
setToggleAddPersona,
abrirModalCliente,
cerrarModalCliente,
clienteRequerido,
inputnombreclientefastref,

imprimirFiscal,
setimprimirFiscal,

getPersona,
personas,
setPersonas,

ModaladdproductocarritoToggle,
setModaladdproductocarritoToggle,
toggleModalProductos,

setProductoCarritoInterno,

toggleImprimirTicket,
onchangeinputmain,
del_pedido,

productos,
getProductos,
facturar_pedido,
inputmodaladdpersonacarritoref,
inputaddcarritointernoref,

tbodyproducInterref,
tbodypersoInterref,

countListInter,
countListPersoInter,

clickSetOrderColumn,
orderColumn,
orderBy,
entregarVuelto,

setPersonaFast,
clienteInpidentificacion,
setclienteInpidentificacion,
clienteInpnombre,
setclienteInpnombre,
clienteInptelefono,
setclienteInptelefono,
clienteInpdireccion,
setclienteInpdireccion,
inputaddCarritoFast,
setinputaddCarritoFast,
refinputaddcarritofast,

viewReportPedido,
autoCorrector,
setautoCorrector,

getDebito,
getCredito,
getTransferencia,
getEfectivo,
onClickEditPedido,

setBiopago,
biopago,
getBio,

facturar_e_imprimir,

moneda,

dolar,
peso,

showinputaddCarritoFast,
setshowinputaddCarritoFast,
qProductosMain,
auth,

settogglereferenciapago,
togglereferenciapago,

tipo_referenciapago,
settipo_referenciapago,
descripcion_referenciapago,
setdescripcion_referenciapago,
monto_referenciapago,
setmonto_referenciapago,
banco_referenciapago,
setbanco_referenciapago,

refaddfast,

}) {



const showTittlePrice = (pu,total) => {
  try{
    return "P/U. Bs."+moneda(number(pu)*dolar)+"\n"+"Total Bs."+moneda(number(total)*dolar)

  }catch(err){
    return ""
  }
}

const [isrefbanbs, setisrefbanbs] = useState(true)
const [recibido_dolar, setrecibido_dolar] = useState("")
const [recibido_bs, setrecibido_bs] = useState("")
const [recibido_cop, setrecibido_cop] = useState("")
const [cambio_dolar, setcambio_dolar] = useState("")
const [cambio_bs, setcambio_bs] = useState("")
const [cambio_cop, setcambio_cop] = useState("")

const [cambio_tot_result, setcambio_tot_result] = useState("")
const [recibido_tot, setrecibido_tot] = useState("")
const changeRecibido = (val,type) => {
  switch(type){
    case "recibido_dolar":
      setrecibido_dolar(number(val))

    break;
    case "recibido_bs":
      setrecibido_bs(number(val))
    break;
    case "recibido_cop":
      setrecibido_cop(number(val))
    break;
  }

}
const setPagoInBs = callback => {
  let bs = parseFloat(window.prompt("Monto Bs"))
  if (bs) {
    callback((bs/dolar).toFixed(2))
  }
}
// Cualquier valor vacio, no numerico o una tasa sin cargar daba NaN.
const num = (v) => {
  let n = parseFloat(v)
  return isNaN(n) ? 0 : n
}
// Convierte a dolares sin dividir entre cero ni entre NaN.
const aDolar = (monto, tasa) => {
  let t = num(tasa)
  return t ? num(monto) / t : 0
}
const sumRecibido = () => {
  let vuel_dolar = num(recibido_dolar)
  let vuel_bs = aDolar(recibido_bs, dolar)
  let vuel_cop = aDolar(recibido_cop, peso)

  let t = vuel_dolar + vuel_bs + vuel_cop
  let total = num(pedidoData ? pedidoData.clean_total : 0)

  setrecibido_tot(t.toFixed(2))

  // Sin nada recibido no hay vuelto que calcular: antes salia -total.
  let cambio = t > 0 ? t - total : 0

  setcambio_dolar(cambio ? cambio.toFixed(2) : "")
  setcambio_bs("")
  setcambio_cop("")
  setcambio_tot_result(cambio ? cambio.toFixed(2) : "")
}
const setVueltobs = () => {
  setcambio_bs((num(cambio_tot_result)*num(dolar)).toFixed(2))
  setcambio_dolar("")
  setcambio_cop("")
}
const setVueltodolar = () => {
  setcambio_bs("")
  setcambio_dolar(cambio_tot_result)
  setcambio_cop("")
}
const setVueltocop = () => {
  setcambio_bs("")
  setcambio_dolar("")
  setcambio_cop((num(cambio_tot_result)*num(peso)).toFixed(2))
}
const syncCambio = (val,type) => {
  val = number(val)
  let valC = 0
  if (type=="Dolar") {
    setcambio_dolar(val)
    valC = val
  }
  else if (type=="Bolivares") {
    setcambio_bs(val) 
    valC = aDolar(val, dolar)

  }
  else if (type=="Pesos") {
    setcambio_cop(val)
    valC = aDolar(val, peso)
  }
  


  let divisor=0;

  let inputs = [
    {key:"Dolar", val:cambio_dolar, set:(val)=>setcambio_dolar(val)},
    {key:"Bolivares", val:cambio_bs, set:(val)=>setcambio_bs(val)},
    {key:"Pesos", val:cambio_cop, set:(val)=>setcambio_cop(val)},
  ]

  inputs.map(e => {
    if (e.key!=type) {
      if (e.val) {divisor++}
    }
  })
  let cambio_tot_resultvalC = 0
  if (cambio_bs&&cambio_dolar&&type=="Pesos") {
    let bs = aDolar(cambio_bs, dolar)
    setcambio_dolar((num(cambio_tot_result)-bs-num(valC)).toFixed(2))
  }else{
    inputs.map(e => {
      if (e.key!=type) {
        if (e.val) {
          cambio_tot_resultvalC = divisor ? (num(cambio_tot_result)-num(valC))/divisor : 0
          if (e.key=="Dolar") {
            e.set((cambio_tot_resultvalC).toFixed(2))
          }else if (e.key=="Bolivares") {
            e.set((cambio_tot_resultvalC*num(dolar)).toFixed(2))
          }else if (e.key=="Pesos") {
            e.set((cambio_tot_resultvalC*num(peso)).toFixed(2))
          }
        }
      }
    })

  }

  
}
const sumCambio = () => {
  let vuel_dolar = num(cambio_dolar)
  let vuel_bs = aDolar(cambio_bs, dolar)
  let vuel_cop = aDolar(cambio_cop, peso)
  return (vuel_dolar + vuel_bs + vuel_cop).toFixed(2)
}
const debitoBs = (met) =>{
  try{
    if (met=="debito") {
      if (debito=="") {
        return ""
      }
     return "Bs."+moneda(dolar*debito)

    }

    if (met=="transferencia") {
      if (transferencia=="") {
        return ""
      }
     return "Bs."+moneda(dolar*transferencia)
      
    }
    if (met=="biopago") {
      if (biopago=="") {
        return ""
      }
     return "Bs."+moneda(dolar*biopago)
      
    }
    if (met=="efectivo") {
      if (efectivo=="") {
        return ""
      }
     return "Bs."+moneda(dolar*efectivo)
      
    }

  }catch(err){
    return ""
    console.log()
  }
}
const syncPago = (val,type)=>{
  val = number(val)
  if (type=="Debito") {

    setDebito(val)
  }
  else if (type=="Efectivo") {
    setEfectivo(val) 
  }
  else if (type=="Transferencia") {
    setTransferencia(val)
  }
  else if (type=="Credito") {
    setCredito(val)
  }
  else if (type=="Biopago") {
    setBiopago(val)
  }


  let divisor=0;

  let inputs = [
    {key:"Debito", val:debito, set:(val)=>setDebito(val)},
    {key:"Efectivo", val:efectivo, set:(val)=>setEfectivo(val)},
    {key:"Transferencia", val:transferencia, set:(val)=>setTransferencia(val)},
    {key:"Credito", val:credito, set:(val)=>setCredito(val)},
    {key:"Biopago", val:biopago, set:(val)=>setBiopago(val)},
  ]

  inputs.map(e => {
    if (e.key!=type) {
      if (e.val) {divisor++}
    }
  })

  if (autoCorrector) {
    inputs.map(e => {
      if (e.key!=type) {
        if (e.val) {
          e.set(((pedidoData.clean_total-val)/divisor).toFixed(2))
        }
      }
    })
  }
}
  useEffect(()=>{
    sumRecibido()
  },[recibido_bs,recibido_cop,recibido_dolar])
  useEffect(()=>{
    if (refinputaddcarritofast.current) {
      refinputaddcarritofast.current.value = ""

    }
    
    // refinputaddcarritofast.current.focus()
  },[])
  try{
    const {
      id,
      created_at,
      cliente,
      items,
      total_des,
      subtotal,
      total,

      clean_total,
      cop_clean,
      bs_clean,
      
      total_porciento,
      cop,
      bs,
      editable,
      vuelto_entregado,
      estado,

      exento,
      gravable,
      ivas,
      monto_iva,
    } = pedidoData

    
    // Los botones de acción no deben quedarse con el foco: si lo conservan,
    // el ENTER que factura vuelve a dispararlos.
    const evitarFoco = (e) => e.preventDefault()

    const metodosPago = [
      {key:"Debito",        label:"Déb.",    valor:debito,        bsKey:"debito",        bs:true,  onTitulo:getDebito,        ref:()=>addRefPago("toggle")},
      {key:"Efectivo",      label:"Efec.",   valor:efectivo,      bsKey:"efectivo",      bs:true,  onTitulo:getEfectivo,      ref:null},
      {key:"Transferencia", label:"Tran.",   valor:transferencia, bsKey:"transferencia", bs:true,  onTitulo:getTransferencia, ref:()=>addRefPago("toggle",transferencia,"1")},
      {key:"Biopago",       label:"Biopago", valor:biopago,       bsKey:"biopago",       bs:true,  onTitulo:getBio,           ref:()=>addRefPago("toggle",biopago,"5")},
      {key:"Credito",       label:"Créd.",   valor:credito,       bsKey:null,            bs:false, onTitulo:getCredito,       ref:null},
    ]

    return (
      <>
        {viewconfigcredito?
          <Modalconfigcredito
            pedidoData={pedidoData}
            setPagoPedido={setPagoPedido}
            viewconfigcredito={viewconfigcredito}
            setviewconfigcredito={setviewconfigcredito}
            fechainiciocredito={fechainiciocredito}
            setfechainiciocredito={setfechainiciocredito}
            fechavencecredito={fechavencecredito}
            setfechavencecredito={setfechavencecredito}
            formatopagocredito={formatopagocredito}
            setformatopagocredito={setformatopagocredito}
            datadeudacredito={datadeudacredito}
            setdatadeudacredito={setdatadeudacredito}
            setconfigcredito={setconfigcredito}
          />
        :null}
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-auto p-0">
                
                {pedidosFast?pedidosFast.map(e=>
                  e?
                    <div className="card-pedidos" key={e.id} data-id={e.id} onClick={onClickEditPedido}>
                      <span className={(e.id==id?"btn":"btn-outline")+(!e.estado?"-sinapsis":"-success")+(" btn num-pedido")}>
                        {e.id}
                      </span>
                    </div>
                  :null
                ):null} 
            </div>
            <div className="col">
              
              {ModaladdproductocarritoToggle&&<Modaladdproductocarrito
                ModaladdproductocarritoToggle={ModaladdproductocarritoToggle}
                qProductosMain={qProductosMain}
                showinputaddCarritoFast={showinputaddCarritoFast}
                setshowinputaddCarritoFast={setshowinputaddCarritoFast}

                toggleModalProductos={toggleModalProductos}
                productos={productos}
                setProductoCarritoInterno={setProductoCarritoInterno}
                getProductos={getProductos}
                inputaddcarritointernoref={inputaddcarritointernoref}

                tbodyproducInterref={tbodyproducInterref}

                countListInter={countListInter}
                onchangeinputmain={onchangeinputmain}

                clickSetOrderColumn={clickSetOrderColumn}
                orderColumn={orderColumn}
                orderBy={orderBy}
                moneda={moneda}



              />}

              {toggleAddPersona&&<ModaladdPersona
                setToggleAddPersona={cerrarModalCliente}
                clienteRequerido={clienteRequerido}
                getPersona={getPersona}
                personas={personas}
                setPersonas={setPersonas}
                inputmodaladdpersonacarritoref={inputmodaladdpersonacarritoref}
                inputnombreclientefastref={inputnombreclientefastref}
                tbodypersoInterref={tbodypersoInterref}
                countListPersoInter={countListPersoInter}

                setPersonaFast={setPersonaFast}
                clienteInpidentificacion={clienteInpidentificacion}
                setclienteInpidentificacion={setclienteInpidentificacion}
                clienteInpnombre={clienteInpnombre}
                setclienteInpnombre={setclienteInpnombre}
                clienteInptelefono={clienteInptelefono}
                setclienteInptelefono={setclienteInptelefono}
              />}
              <div className={(estado?"bg-success-light":"bg-sinapsis")+(" d-flex justify-content-between p-1 rounded")}>
                <span className='fs-5'>Pedido #{id}</span>
                <span className='pull-right'>{created_at}</span>
              </div>
              <table className="table table-striped text-center">
                <thead>
                  {editable?
                    <tr>
                        <td colSpan={auth(1)?"9":"8"} className='p-0 pt-1'>
                          <div className="input-group">
                            <input type="text" ref={refaddfast} className="form-control" placeholder="Auto agregar...(F1) y (F1)"/>
                              <div className="input-group-append">
                                <button className="btn text-white btn-sinapsis" onClick={toggleModalProductos}><i className="fa fa-plus"></i></button>
                              </div>
                          </div>
                        </td>
                    </tr>
                  :null}
                  <tr>
                    <th className="text-sinapsis cell2">Código</th>
                    <th className="text-sinapsis cell3">Producto</th>
                    <th className="text-sinapsis cell1">Ct.</th>
                    {auth(1)?<th className="text-sinapsis cell1">PBase</th>:null}

                    <th className="text-sinapsis cell1">PVenta</th>
                    
                    <th className="text-sinapsis">SubTotal</th>
                    <th className="text-sinapsis">Desc.%</th>
                    

                    <th className="text-sinapsis cell2">Total</th>
                    
                  </tr>
                </thead>
                <tbody>
                  {items?items.map((e,i)=>
                    e.abono&&!e.producto?
                    <tr key={e.id}>
                      <td>MOV</td>
                      <td>{e.abono}</td>
                      <td>{e.cantidad} </td>
                      <td>{e.monto}</td>
                      <td onClick={setDescuentoUnitario} data-index={e.id} className="align-middle pointer clickme">{e.descuento}</td>
                      <td>{e.subtotal}</td>
                      <td>{e.total_des}</td>

                      <th className="font-weight-bold">{e.total}</th>
                      <td> </td>
                    </tr>
                    :<tr key={e.id} title={showTittlePrice(e.producto.precio,e.total)}>
                      <td className="align-middle">{e.producto.codigo_barras}</td>
                      <td className="align-middle">
                        <span className="pointer" onClick={changeEntregado} data-id={e.id}>{e.producto.descripcion}</span> {e.entregado?<span className="btn btn-outline-secondary btn-sm-sm">Entregado</span>:null}
                        <div className='fst-italic fs-6 text-success'>
                            {e.lotedata?<>
                              Lote. {e.lotedata ? e.lotedata.lote : null} - Exp. {e.lotedata ? e.lotedata.vence : null}
                            </>:null} 
                        </div>
                      </td>
                      <td className="pointer clickme align-middle" onClick={setCantidadCarrito} data-index={e.id}>
                        {e.cantidad.replace(".00","")} 
                      </td>
                      {auth(1)?<th className="pointer align-middle">{moneda(e.producto.precio_base)}</th>:null}
                      {e.producto.precio1?
                      <td className="align-middle text-success pointer" data-iditem={e.id} onClick={setPrecioAlternoCarrito} >{e.producto.precio}</td>
                        :
                      <td className="align-middle pointer">{moneda(e.producto.precio)}</td>
                      }
                      <td onClick={setDescuentoUnitario} data-index={e.id} className="align-middle pointer">{e.subtotal}</td>
                      <td onClick={setDescuentoUnitario} data-index={e.id} className="align-middle pointer clickme">{e.descuento}</td>
                      


                      <th className="font-weight-bold align-middle">{e.total}</th>
                      {editable?
                      <td className="align-middle"> <i onClick={delItemPedido} data-index={e.id} className="fa fa-times text-danger"></i> </td>
                      :null}
                    </tr>
                  ):null}
                  <tr>
                    <td><button className="btn btn-outline-success fs-5">{items?items.length:null}</button></td>
                    <th colSpan={auth(1)?"8":"7"} className="p-2 align-middle pointer" onClick={()=>abrirModalCliente()}>
                      {clienteRequerido?
                        <span className="text-danger">Sin cliente, haga clic o pulse F2 para registrarlo</span>
                        :
                        <>{cliente?cliente.nombre:null} <b>{cliente?cliente.identificacion:null}</b></>
                      }
                    </th>
                  </tr>
                </tbody>
              </table>
            </div>
          
            
            <div className="col-5">
              <div className="metodos-pago-wrap">
                <div className="metodos-pago">
                  {metodosPago.map(m=>
                    <div key={m.key} className={"pago-card"+(m.valor!==""&&m.valor!=null?" activo":"")+(m.ref?" addref":"")}>
                      <div className="pago-titulo pointer" onClick={m.onTitulo}>{m.label}</div>
                      {editable?
                        <div className="input-group input-group-sm pago-input">
                          <input type="text" className="form-control" value={m.valor}
                            onChange={(e)=>syncPago(e.target.value,m.key)} placeholder="0,00"/>
                          {m.bs?
                            <span className="input-group-text pointer" title="Cargar monto en bolívares"
                              onClick={()=>setPagoInBs(val=>syncPago(val,m.key))}>Bs</span>
                          :null}
                        </div>
                      :
                        <div className="pago-valor">{m.valor!==""&&m.valor!=null?m.valor:"0,00"}</div>
                      }
                      <small className="pago-equiv">{m.bsKey?debitoBs(m.bsKey):null}</small>
                      {m.ref?<span className="ref pointer" onClick={m.ref}>Ref. <i className="fa fa-plus"></i></span>:null}
                    </div>
                  )}

                  <div className={"pago-card pago-vuelto"+(vuelto!==""?" activo":"")}>
                    <div className="pago-titulo">Vuel.</div>
                    {editable?
                      <div className="input-group input-group-sm pago-input">
                        <input type="text" className="form-control" value={vuelto}
                          onChange={(e)=>setVuelto(number(e.target.value))} placeholder="0,00"/>
                      </div>
                    :
                      <div onClick={entregarVuelto} className="pointer">
                        <div className="pago-valor">{vuelto!==""?vuelto:"0,00"}</div>
                        <small className="text-success fst-italic">Entregar</small>
                        {vuelto_entregado?vuelto_entregado.map(e=>
                          <div className="pago-equiv" title={e.created_at} key={e.id}>Entregado = <b>{e.monto}</b></div>
                        ):null}
                      </div>
                    }
                  </div>

                  <button
                    type="button"
                    onMouseDown={evitarFoco}
                    className={"btn-auto"+(autoCorrector?" activo":"")}
                    onClick={()=>setautoCorrector(!autoCorrector)}
                    title={"Autocorrector "+(autoCorrector?"activado":"desactivado")+": reparte el monto restante entre los métodos que ya tienen valor."}>
                    auto<b>{autoCorrector?"On":"Off"}</b>
                  </button>
                </div>
              </div>

              {editable?
                <div className="container p-0 m-0">
                  {togglereferenciapago?
                    <div className="modal-custom">
                      <div className="text-danger" onClick={()=>addRefPago("toggle")} data-type="toggle"><span className="closeModal">&#10006;</span></div>

                      <div className="modal-content-sm shadow">
                        <div className="col p-4">
                          <h4>Agregar Referencia Bancaria (Enter dentro de un campo para guardar)</h4>
                            <div className="form-group">
                              <label className="form-label">Referencia</label>
                              <input type="text" placeholder='Referencia completa de la transacción...' value={descripcion_referenciapago} onChange={e=>setdescripcion_referenciapago(e.target.value)} className="form-control" />
                            </div>

                            <div className="form-group">
                              <label className="form-label">Banco</label>
                              <select className="form-control" value={banco_referenciapago} onChange={e=>setbanco_referenciapago(e.target.value)}>
                                <option value="">--Seleccione Banco--</option>
                                <option value="0102">0102 Banco de Venezuela, S.A. Banco Universal</option>	
                                <option value="0108">0108 Banco Provincial, S.A. Banco Universal</option>	
                                <option value="0105">0105 Banco Mercantil C.A., Banco Universal</option>	
                                <option value="0134">0134 Banesco Banco Universal, C.A.</option>	
                                <option value="0175">0175 Banco Bicentenario del Pueblo, Banco Universal C.A.</option>	
                                <option value="0191">0191 Banco Nacional de Crédito C.A., Banco Universal</option>	
                                <option value="0104">0104 Banco Venezolano de Crédito, S.A. Banco Universal</option>	
                                <option value="0114">0114 Banco del Caribe C.A., Banco Universal</option>	
                                <option value="0115">0115 Banco Exterior C.A., Banco Universal</option>	
                                <option value="0128">0128 Banco Caroní C.A., Banco Universal</option>	
                                <option value="0137">0137 Banco Sofitasa Banco Universal, C.A.</option>	
                                <option value="0138">0138 Banco Plaza, Banco universal</option>	
                                <option value="0146">0146 Banco de la Gente Emprendedora C.A.</option>	
                                <option value="0151">0151 Banco Fondo Común, C.A Banco Universal</option>	
                                <option value="0156">0156 100% Banco, Banco Comercial, C.A</option>	
                                <option value="0157">0157 DelSur, Banco Universal C.A.</option>	
                                <option value="0163">0163 Banco del Tesoro C.A., Banco Universal</option>	
                                <option value="0166">0166 Banco Agrícola de Venezuela C.A., Banco Universal</option>	
                                <option value="0168">0168 Bancrecer S.A., Banco Microfinanciero</option>	
                                <option value="0169">0169 Mi Banco, Banco Microfinanciero, C.A.</option>	
                                <option value="0171">0171 Banco Activo C.A., Banco Universal</option>	
                                <option value="0172">0172 Bancamiga Banco Universal, C.A.</option>	
                                <option value="0173">0173 Banco Internacional de Desarrollo C.A., Banco Universal</option>	
                                <option value="0174">0174 Banplus Banco Universal, C.A.</option>	
                                <option value="0177">0177 Banco de la Fuerza Armada Nacional Bolivariana, B.U.</option>	
                                <option value="ZELLE">ZELLE</option>	
                                <option value="BINANCE">Binance</option>	
                                <option value="AirTM">AirTM</option>	
                              </select>
                            </div>

                            <div className="form-group">
                              <label className="form-label mt-2">Monto en {isrefbanbs
                                  ? 
                                  <button className="btn btn-outline-sinapsis btn-sm" onClick={()=>{setisrefbanbs(false);setmonto_referenciapago(transferencia)}}>Bs</button>
                                  : 
                                  <button className="btn btn-outline-success btn-sm" onClick={()=>{setisrefbanbs(true);setmonto_referenciapago(transferencia*dolar)}}>$</button>
                                }  
                              </label>
                              <input type="text" disabled={true} value={monto_referenciapago} onChange={e=>setmonto_referenciapago(e.target.value)} className="form-control" />
                            </div>

                            <div className="form-group">
                              <label className="form-label">Tranferencia/Biopago/Débito</label>
                              <select className="form-control" value={tipo_referenciapago} onChange={e=>settipo_referenciapago(e.target.value)}>
                                <option value="">--Seleccione Banco--</option>
                                <option value="1">Transferencia</option>
                                <option value="2">Debito</option> 
                                <option value="5">BioPago</option>
                              </select>
                            </div>
                        </div>
                      </div>
                    </div>

                    :null
                  }
                  <div className="row mb-4">
                    <div className="col">
                      {refPago ? refPago.length ?<h4 className='text-center'>Referencias Bancarias</h4>:null:null}

                      <ul className="list-group">
                      
                        {refPago ? refPago.length ? refPago.map(e=>
                          <li key={e.id} className='list-group-item d-flex justify-content-between align-items-start'>
                            <span className='cell45'>Ref.{e.descripcion} ({e.banco})</span>
                            {e.tipo==1&&e.monto!=0?<span className="cell45 btn-sm btn-info btn">Trans. {moneda(e.monto)} </span>:null}
	                          {e.tipo==2&&e.monto!=0?<span className="cell45 btn-sm btn-secondary btn">Deb. Bs.{moneda(e.monto)} </span>:null}
	                          {e.tipo==5&&e.monto!=0?<span className="cell45 btn-sm btn-secondary btn">Biopago. Bs.{moneda(e.monto)} </span>:null}
                            <span className="cell1 text-danger text-right" data-id={e.id} onClick={delRefPago}>
                              <i className="fa fa-times"></i>
                            </span>
                          </li>
                        )
                        :null:null}
                      </ul>

                    </div>
                  </div>
                </div>:null
              }

              <div className="totales-pedido mt-1 mb-1">
                <div className="totales-desglose">
                  <span>
                    <small>Sub-Total</small>
                    <b>{subtotal}</b>
                  </span>
                  <span data-index={id} onClick={setDescuentoTotal} className="pointer clickme">
                    <small>Desc. {total_porciento}%</small>
                    <b>{total_des}</b>
                  </span>
                  <span>
                    <small>Exento</small>
                    <b>{exento}</b>
                  </span>
                  <span>
                    <small>Gravable</small>
                    <b>{gravable}</b>
                  </span>
                  <span>
                    <small>IVA ({ivas})</small>
                    <b>{monto_iva}</b>
                  </span>
                </div>
                <div className="totales-monto">
                  <div className="tot-principal">
                    <small>Total $</small>
                    <span data-type="dolar" className="pointer valor-dolar">{total}</span>
                  </div>
                  <div className="tot-principal">
                    <small>Bs</small>
                    <span data-type="bs" className="pointer valor-bs">{bs}</span>
                  </div>
                  <div className="tot-secundario">
                    <small>Cop</small>
                    <span data-type="cop" className="pointer">{cop}</span>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-center">
                <table className="table-sm">
                  <tbody>
                    <tr>
                      <td>
                        <div className="container-fluid">
                          <div className="row">
                            <div className="col p-0">
                              <div className={(recibido_dolar!=""?"bg-success-light card-sinapsis addref":"t-5")+(" card")}>
                                <div className="card-body p-2">
                                  <div className="card-title pointer" >$</div>
                                  <div className="card-text pago-numero"><input type="text" className="fs-3" value={recibido_dolar} onChange={(e)=>changeRecibido(e.target.value,"recibido_dolar")} placeholder="$"/></div>
                                </div>
                              </div>
                            </div>

                            <div className="col p-0">
                              <div className={(recibido_bs!=""?"bg-success-light card-sinapsis addref":"t-5")+(" card")}>
                                <div className="card-body p-2">
                                  <div className="card-title pointer" >BS</div>
                                  <div className="card-text pago-numero"><input type="text" className="fs-3" value={recibido_bs} onChange={(e)=>changeRecibido(e.target.value,"recibido_bs")} placeholder="BS"/></div>
                                </div>
                              </div>
                            </div>

                            <div className="col p-0">
                              <div className={(recibido_cop!=""?"bg-success-light card-sinapsis addref":"t-5")+(" card")}>
                                <div className="card-body p-2">
                                  <div className="card-title pointer" >COP</div>
                                  <div className="card-text pago-numero"><input type="text" className="fs-3" value={recibido_cop} onChange={(e)=>changeRecibido(e.target.value,"recibido_cop")} placeholder="COP"/></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                      </td>
                      <td className="align-middle text-right">
                        Pagado
                        <br/>
                        <span className="text-success fs-2 fw-bold">
                          {recibido_tot}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="container-fluid">
                          <div className="row">
                            <div className="col p-0">
                              <div className={(cambio_dolar!=""?"bg-success-light card-sinapsis addref":"t-5")+(" card")}>
                                <div className="card-body p-2">
                                  <div className="card-title pointer " onClick={setVueltodolar} >$</div>
                                  <div className="card-text pago-numero"><input type="text" className="fs-3" value={cambio_dolar} onChange={(e)=>syncCambio(e.target.value,"Dolar")} placeholder="$"/></div>
                                </div>
                              </div>
                            </div>

                            <div className="col p-0">
                              <div className={(cambio_bs!=""?"bg-success-light card-sinapsis addref":"t-5")+(" card")}>
                                <div className="card-body p-2">
                                  <div className="card-title pointer " onClick={setVueltobs} >BS</div>
                                  <div className="card-text pago-numero"><input type="text" className="fs-3" value={cambio_bs} onChange={(e)=>syncCambio(e.target.value,"Bolivares")} placeholder="BS"/></div>
                                </div>
                              </div>
                            </div>

                            <div className="col p-0">
                              <div className={(cambio_cop!=""?"bg-success-light card-sinapsis addref":"t-5")+(" card")}>
                                <div className="card-body p-2">
                                  <div className="card-title pointer " onClick={setVueltocop} >COP</div>
                                  <div className="card-text pago-numero"><input type="text" className="fs-3" value={cambio_cop} onChange={(e)=>syncCambio(e.target.value,"Pesos")} placeholder="COP"/></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="align-middle text-right">
                        Cambio
                        <br/>
                        <span className="text-success fs-2 fw-bold">
                          {sumCambio()}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {editable&&imprimirFiscal?
                <div className="alert alert-warning text-center p-1 m-0 mb-1 fw-bold">
                  RECIBO ACTIVO: al guardar sale la factura fiscal (no sale la nota de entrega)
                </div>
              :null}
              <div className="acciones-pedido">
                {/* El botón verde de ENTER se oculta: en la práctica siempre se
                    usa CTRL+ENTER. El atajo ENTER sigue funcionando igual. */}
                {editable?
                  <button type="button" onMouseDown={evitarFoco} className="btn btn-accion btn-primary" onClick={facturar_e_imprimir}>
                    Guardar e imprimir <span className="tecla">(CTRL+ENTER)</span>
                  </button>
                :null}
                {editable?
                  <button
                    type="button"
                    onMouseDown={evitarFoco}
                    className={"btn btn-accion "+(imprimirFiscal?"btn-warning":"btn-outline-secondary")}
                    onClick={()=>setimprimirFiscal(!imprimirFiscal)}
                    title="CTRL+F. Activo: al guardar la factura sale la factura fiscal en lugar de la nota de entrega.">
                    Recibo <span className="tecla">(CTRL+F · {imprimirFiscal?"activo":"apagado"})</span>
                  </button>
                :null}
                {editable?
                  <button type="button" onMouseDown={evitarFoco} className="btn btn-accion btn-sinapsis" onClick={()=>abrirModalCliente()}>
                    Cliente <span className="tecla">(F2)</span>
                  </button>
                :null}
                <button type="button" onMouseDown={evitarFoco} className="btn btn-accion btn-sinapsis" onClick={()=>toggleImprimirTicket()}>
                  Nota de entrega <span className="tecla">(F3)</span>
                </button>
                <button type="button" onMouseDown={evitarFoco} className="btn btn-accion btn-sinapsis" onClick={viewReportPedido}>
                  Ver <span className="tecla">(F4)</span>
                </button>
                {editable?
                  <button type="button" onMouseDown={evitarFoco} className="btn btn-accion btn-accion-min btn-danger" onClick={del_pedido} title="Eliminar pedido (F5)">
                    <i className="fa fa-times"></i> <span className="tecla">F5</span>
                  </button>
                :null}
              </div>
            </div>
            
          </div>
        </div>
      </>

      
    )
  }catch(err){
    console.log(err)
    return ""

  }
}