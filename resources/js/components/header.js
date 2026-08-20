import logo from "../../images/logo.png"
import carrito from "../../images/carrito1.png"
function Header({
  updatetasasfromCentral,
  user,
  logout,
  getip,
  settoggleClientesBtn,
  toggleClientesBtn,
  getVentasClick,
  dolar,
  peso,
  view,
  setView,
  setMoneda,
  getPedidos,
  setViewCaja,
  viewCaja,
  setShowModalMovimientos,
  showModalMovimientos,
  auth,

  isCierre,
  getPermisoCierre,
}) {
  const item = (activo) => "header-item" + (activo ? " activo" : "")

  return (
    <header className="header-bar bg-sinapsis mb-2 container">
      <div className="d-flex align-items-center flex-nowrap">

        <img src={logo} alt="sinapsis" className="header-logo" />
        <span className="header-sucursal" title={user.sucursal}>{user.sucursal}</span>
        <span className="header-sep"></span>

        {auth(3)?<span className={item(view=="ventas")} onClick={()=>{ setView("ventas"); getVentasClick() }}>Ventas</span>:null}
        {auth(3)?<span className={item(view=="seleccionar")} onClick={()=>setView("seleccionar")}>Facturar</span>:null}

        {auth(2)?<div className="dropdown">
          <span className={item(toggleClientesBtn)+" dropdown-toggle"} onClick={()=>settoggleClientesBtn(!toggleClientesBtn)}>
            Clientes
          </span>
          <ul className={("dropdown-menu ")+(toggleClientesBtn?"show":null)} onMouseLeave={()=>settoggleClientesBtn(false)}>
            <li>
              <span className="dropdown-item pointer" onClick={()=>{ setView("vueltos"); settoggleClientesBtn(false) }}>Vueltos</span>
            </li>
            <li>
              <span className="dropdown-item pointer" onClick={()=>{ setView("credito"); settoggleClientesBtn(false) }}>Cuentas por cobrar</span>
            </li>
            <li>
              <span className="dropdown-item pointer" onClick={()=>{ setView("clientes_crud"); settoggleClientesBtn(false) }}>Administrar Clientes</span>
            </li>
          </ul>
        </div>:null}

        <span className={item(view=="cierres")} onClick={()=>setView("cierres")}>Cierre</span>

        {auth(2)&&view=="seleccionar"?
          <span className={item(showModalMovimientos)} onClick={()=>setView("devoluciones")} title="Devoluciones / Garantías">Devol. / Gar.</span>
        :null}
        {auth(1)?<span className={item(view=="tareas")} onClick={()=>setView("tareas")}>Tareas</span>:null}
        {auth(1)?<span className={item(view=="inventario")} onClick={()=>setView("inventario")}>Administración</span>:null}

        <span className="header-sep"></span>

        <small className="header-tasa" onClick={setMoneda} data-type="1" title="Cambiar tasa USD">USD {dolar}</small>
        <small className="header-tasa" onClick={setMoneda} data-type="2" title="Cambiar tasa COP">COP {peso}</small>

        <div className="header-derecha">
          <img src={carrito} alt="Pedidos" title="Pedidos"
            className="header-carrito pointer"
            onClick={()=>{ setView("pedidos"); getPedidos() }}/>
          <span className="header-sep"></span>
          {auth(1)?<span className="header-icon" title="Configuración" onClick={()=>setView("configuracion")}><i className="fa fa-cogs"></i></span>:null}
          <span className="header-user pointer" onClick={getip} title={user.nombre+" - "+user.usuario+" ("+user.role+")"}>
            <b>{user.usuario}</b> <i className="fst-italic">({user.role})</i>
          </span>
          <span className="header-icon text-danger" title="Salir" onClick={logout}><i className="fa fa-times"></i></span>
        </div>

      </div>
    </header>
  )
}
export default Header
