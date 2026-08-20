function ModaladdPersona({
  countListPersoInter,
  tbodypersoInterref,
  setToggleAddPersona,
  getPersona,
  personas,
  setPersonas,
  inputmodaladdpersonacarritoref,
  inputnombreclientefastref,

  setPersonaFast,
  clienteRequerido,
  clienteInpidentificacion,
  setclienteInpidentificacion,
  clienteInpnombre,
  setclienteInpnombre,
  clienteInptelefono,
  setclienteInptelefono,

}) {
  try{
    const sinResultados = !personas.length

    return (
      <>
        <section className="modal-custom">
          <div className="modal-content-sm">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h5 className="mb-0">Cliente</h5>
                {clienteRequerido?
                  <small className="text-danger">Obligatorio para guardar la factura</small>
                  :
                  <small className="text-muted">Buscar o registrar</small>
                }
              </div>
              <div className="text-danger" onClick={()=>setToggleAddPersona(false)}>
                <span className="closeModal">&#10006;</span>
              </div>
            </div>

            <input type="text"
              className="form-control form-control-lg mt-2"
              ref={inputmodaladdpersonacarritoref}
              autoComplete="off"
              placeholder="Cédula / RIF o nombre..."
              onChange={(val)=>getPersona(val.target.value)}/>

            <small className="text-muted d-block mt-1">
              <b>&darr;</b> <b>&uarr;</b> elegir &middot; <b>Enter</b> seleccionar &middot; <b>Esc</b> cerrar
            </small>

            <div className="mt-2" style={{maxHeight:"40vh",overflowY:"auto"}}>
              <table className="table table-bordered tabla_datos mb-0 w-100">
                <thead>
                  <tr>
                    <th>C.I./RIF</th>
                    <th>NOMBRE Y APELLIDO</th>
                    <th>TELÉFONO</th>
                  </tr>
                </thead>
                <tbody ref={tbodypersoInterref}>
                  {personas.map((e,i)=>
                    <tr tabIndex="-1"
                      className={(countListPersoInter==i?"bg-select ":"")+("tr-producto pointer")}
                      key={e.id} onClick={setPersonas} data-index={e.id}>
                      <td>{e.identificacion}</td>
                      <td data-index={i}>{e.nombre}</td>
                      <td>{e.telefono}</td>
                    </tr>
                  )}
                </tbody>
              </table>
              {sinResultados?
                <div className="text-center text-muted p-2">Sin coincidencias, registre el cliente abajo</div>
                :null}
            </div>

            {sinResultados?
              <div className="mt-2 pt-2 border-top">
                <div className="row">
                  <div className="col-md-4">
                    <label className="form-label mb-0">C.I. / RIF</label>
                    <input type="text"
                      value={clienteInpidentificacion}
                      onChange={e=>setclienteInpidentificacion(e.target.value)}
                      autoComplete="off"
                      className="form-control"/>
                  </div>
                  <div className="col-md-5">
                    <label className="form-label mb-0">Nombre y Apellido</label>
                    <input type="text"
                      ref={inputnombreclientefastref}
                      value={clienteInpnombre}
                      onChange={e=>setclienteInpnombre(e.target.value)}
                      autoComplete="off"
                      className="form-control"/>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label mb-0">Teléfono <span className="text-muted">(opcional)</span></label>
                    <input type="text"
                      value={clienteInptelefono}
                      onChange={e=>setclienteInptelefono(e.target.value)}
                      autoComplete="off"
                      className="form-control"/>
                  </div>
                </div>
                <button className="btn btn-success w-100 mt-2" type="button" onClick={setPersonaFast}>
                  Guardar y seleccionar (Enter)
                </button>
              </div>
              :null}

          </div>
        </section>
        <div className="overlay"></div>
      </>
    )

  }catch(err){
    alert("Error: "+err)
    return "Error: "+err
  }
}
export default ModaladdPersona
