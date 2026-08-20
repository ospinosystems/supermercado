export default function ModalAddCarrito({
  dolar,
  moneda,
  number,
  inputCantidadCarritoref,
  producto,
  pedidoList,
  setSelectItem,
  addCarritoRequest,
  cantidad,
  numero_factura,
  setCantidad,
  setNumero_factura,
  setFalla,
  setPresupuesto
}) {
  const setbultocarrito = bulto => {
    let insert = window.prompt("Cantidad por bulto")
    if (insert) {
      let num = number(insert*bulto)
      if (typeof(num)=="number") {
        setCantidad(num)
      }
    }
  }
  return (
    <>
      <section className="modal-custom"> 
        <div className="text-danger" onClick={setSelectItem}><span className="closeModal">&#10006;</span></div>
        <div className="modal-content-sm modal-cantidad">
          <div className="d-flex justify-content-between align-items-start border-bottom pb-2">
            <div>
              <div className="text-success fs-2 fw-bold lh-1">{moneda(producto.precio)}</div>
              {producto.bulto?
                <span className="btn btn-sm btn-outline-success mt-1" onClick={()=>setbultocarrito(producto.bulto)}>
                  Bulto x{producto.bulto}
                </span>
              :null}
            </div>
            <div className="text-end">
              <h4 className="mb-0">{producto.descripcion}</h4>
              <small className="text-muted">{producto.codigo_proveedor}</small>
            </div>
          </div>

          <form onSubmit={e=>e.preventDefault()} className="pt-3">
            <div className="row g-2 align-items-stretch">
              <div className="col-md-6">
                <label className="form-label mb-1 text-muted">Cantidad</label>
                <input type="text"
                  ref={inputCantidadCarritoref}
                  className="form-control form-control-lg fs-1 text-center"
                  placeholder="0"
                  autoComplete="off"
                  onChange={(e)=>setCantidad(number(e.target.value))}
                  value={cantidad?cantidad:""}/>
              </div>
              <div className="col-md-6">
                <label className="form-label mb-1 text-muted">Total</label>
                <div className="border rounded p-2 h-100 d-flex flex-column justify-content-center">
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">$.</span>
                    <b className="fs-3 text-success lh-1">{cantidad*producto.precio?moneda(cantidad*producto.precio):"0,00"}</b>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Bs.</span>
                    <span className="fs-5">{cantidad*producto.precio*dolar?moneda(cantidad*producto.precio*dolar):"0,00"}</span>
                  </div>
                  <div className="d-flex justify-content-between border-top mt-1 pt-1">
                    <span className="text-muted">Disp.</span>
                    <span className="fs-6">{producto.cantidad}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="input-group mt-3">
              <span className="input-group-text">
                Pedido #<small className="text-muted ms-1">(space)</small>
              </span>
              <select className="form-select" onChange={(e)=>setNumero_factura(e.target.value)} value={numero_factura}>
                {pedidoList.map((e,i)=>
                  <option value={e.id} key={e.id}>{e.id}</option>
                )}
                <option value='nuevo'>Nuevo Pedido</option>
              </select>
            </div>

            <div className="d-flex mt-3">
              <button className="btn btn-sinapsis agregar_carrito flex-grow-1 me-1" type="button" onClick={addCarritoRequest} data-type="agregar">
                Agregar <small>(enter)</small>
              </button>
              <button className="btn btn-outline-success flex-grow-1 me-1" type="button" onClick={addCarritoRequest} data-type="agregar_procesar">
                Procesar <small>(TAB)</small>
              </button>
              <button className="btn btn-outline-secondary" type="button" onClick={setPresupuesto} data-id={producto.id}>
                Presupuesto
              </button>
            </div>
          </form>
        </div>
      </section>
      <div className="overlay"></div>
    </>

    
  )
}
