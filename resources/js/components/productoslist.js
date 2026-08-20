import React from "react"

function ProductosList({
  auth,
  productos,
  addCarrito,

  clickSetOrderColumn,

  orderColumn,
  orderBy,
  counterListProductos,
  tbodyproductosref,
  selectProductoFast,
  moneda,
  buscandoProductos,
}) {

  // Mientras llega la respuesta se dejan renglones fantasma en vez de vaciar
  // la tabla: así la lista no salta ni parece que se borró.
  const filasSkeleton = Array.from({length:8}).map((e,i)=>
    <tr key={"sk"+i} className="fila-skeleton">
      <td className="cell15"><span className="skeleton" style={{width:"80%"}}></span></td>
      <td className="cell3"><span className="skeleton" style={{width:"60%"}}></span></td>
      <td className="cell1"><span className="skeleton" style={{width:"100%"}}></span></td>
      <td className="cell05"><span className="skeleton" style={{width:"70%"}}></span></td>
      <td className="cell3"><span className="skeleton" style={{width:"90%"}}></span></td>
    </tr>
  )

  return (
    <>
      <table className={"tabla-facturacion table table-striped text-center"+(buscandoProductos?" cargando-lista":"")}>
        <thead>
          <tr>
            <th className="text-sinapsis cell15 pointer" 
            data-valor="codigo_proveedor" 
            onClick={clickSetOrderColumn}>Cod. 
              {orderColumn=="codigo_proveedor"?(<i className={orderBy=="desc"?"fa fa-arrow-up":"fa fa-arrow-down"}></i>):null}
            </th>
            <th className="text-sinapsis cell4 pointer" 
            data-valor="descripcion" 
            onClick={clickSetOrderColumn}>Desc. 
              {orderColumn=="descripcion"?(<i className={orderBy=="desc"?"fa fa-arrow-up":"fa fa-arrow-down"}></i>):null}
            </th>
            <th className="text-sinapsis cell1 pointer" 
            data-valor="cantidad" 
            onClick={clickSetOrderColumn}>Disp. 
              {orderColumn=="cantidad"?(<i className={orderBy=="desc"?"fa fa-arrow-up":"fa fa-arrow-down"}></i>):null}
            </th>
            <th className="text-sinapsis cell05 pointer" 
            data-valor="unidad" 
            onClick={clickSetOrderColumn}>Unidad 
              {orderColumn=="unidad"?(<i className={orderBy=="desc"?"fa fa-arrow-up":"fa fa-arrow-down"}></i>):null}
            </th>
            <th className="text-sinapsis cell3 pointer" 
            data-valor="precio" 
            onClick={clickSetOrderColumn}>Precio 
              {orderColumn=="precio"?(<i className={orderBy=="desc"?"fa fa-arrow-up":"fa fa-arrow-down"}></i>):null}
            </th>
          </tr>
        </thead>
        <tbody ref={tbodyproductosref}>
          {buscandoProductos&&(!productos||!productos.length)?filasSkeleton:null}
          {productos?productos.length?productos.map((e,i)=>
            
              <tr data-index={i} tabIndex="-1" className={(counterListProductos == i ?"bg-sinapsis-light":null)+(' tr-producto hover')} key={e.id}>
                <td data-index={i} onClick={event=>{
                  if(!e.lotes.length)return addCarrito(event)
                  }} className="pointer align-middle cell15 cod-producto">{e.codigo_barras}</td>
                <td data-index={i} onClick={event=>{
                  if(!e.lotes.length)return addCarrito(event)
                  }} className='pointer align-middle text-left pl-5 cell3'>
                  {e.descripcion}
                  <div>
                    <table className="table-sm mr-1 text-success">
                      <tbody>
                        {counterListProductos == i ? e.lotes.map((ee, ii) => 
                        <tr
                          data-index={i}
                          data-loteid={ee.id}
                          onClick={addCarrito}
                          className="pointer hover fst-italic fst-bold fs-6"
                          key={ee.id}>
                          
                          <td>Lote.{ee.lote}</td>
                          <td><span className="btn btn-sm btn-outline-success w-100">Ct. {ee.cantidad}</span></td>
                          <td>Exp.{ee.vence}</td>
                        </tr>) : null}
                          </tbody>
                      </table> 
                  </div>
                </td>
                <td className="align-middle cell1">
                {auth(1)?
                  <button /* onClick={selectProductoFast} */ data-id={e.id} data-val={e.codigo_barras} className='formShowProductos btn btn-sinapsis btn-sm btn-disp'>
                  {e.lotes.length?e.lotes_ct:e.cantidad.replace(".00","")}
                    </button>         
                  : <button className='formShowProductos btn btn-sinapsis btn-sm btn-disp'>
                    {e.lotes.length ? e.lotes_ct : e.cantidad.replace(".00", "")}
                  </button>}
                </td>
                <td className="align-middle cell05 unidad-producto">{e.unidad}</td>
                <td className="align-middle cell3 precio-producto">
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col-5 m-0 p-0">
                        <div className='btn-group w-100 h-100'>
                            <button type="button" className='m-0 btn-sm btn btn-success text-light fs-4 fw-bold'>
                            {moneda(e.precio)}
                            </button>
                        </div>
                      </div>
                      <div className="col m-0 p-0">
                        <div className='btn-group-vertical w-100 h-100'>
                            <button type="button" className='m-0 btn-sm btn btn-secondary text-light fw-bold fs-6'>Bs. {moneda(e.bs)} </button>
                            <button type="button" className='m-0 btn-sm btn btn-secondary text-light fw-bold'>Cop. {moneda(e.cop)}</button>
                        </div>
                      </div>
                      
                    </div>
                    {e.precio1?<div className="row">
                      <div className="col m-0 p-0">
                        <span className="btn btn-success w-100 fst-bold text-light">
                          MAYOR. 1 x <b>{e.bulto}</b> = {moneda(e.precio1*e.bulto)} <br/>
                          P/U. {moneda(e.precio1)}
                        </span>
                      </div>
                    </div>:null}
                  </div>
                </td>
              </tr>
              
            ):null:null}
        </tbody>
      </table>

      <div className="table-phone">
        { 
          productos.length
          ? productos.map( (e,i) =>
            <div 
            key={e.id}
            data-index={i} onClick={addCarrito}
            className={(false?"bg-sinapsis-light":"bg-light")+" text-secondary card mb-3 pointer shadow"}>
              <div className="card-header flex-row justify-content-between">
                <div className="d-flex justify-content-between">
                  <div className="w-50">
                    <small className="fst-italic">{e.codigo_barras}</small><br/>
                    <small className="fst-italic">{e.codigo_proveedor}</small><br/>

                    
                  </div>
                  <div className="w-50 text-right">

                    <span className="h6 text-muted font-italic">Bs. {moneda(e.bs)}</span>
                    <br/>
                    <span className="h6 text-muted font-italic">COP. {moneda(e.cop)}</span>
                    <br/>
                    <span className="h3 text-success">{moneda(e.precio)}</span>
                  </div>
                </div>
              </div>
              <div className="card-body d-flex justify-content-between">
                <div className="">
                  <span 
                  className="card-title "
                  ><b>{e.descripcion}</b></span>
                </div> 
                <p className="card-text p-1">
                  Ct. <b className="h3">{e.cantidad}</b>
                </p>
              </div>
            </div>
           )
          : <div className='h3 text-center text-dark mt-2'><i>¡Sin resultados!</i></div>
        }
      </div>
    </>
  )
}
export default ProductosList