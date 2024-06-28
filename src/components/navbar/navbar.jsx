function Navbar() {
  return (
    <nav className="navbar navbar-expand-sm navbar-light bg-light fixed-top">
      <div className="container">
        <a className="navbar-brand" href="/">ČVUT CIIRC</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavbar">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="collapsibleNavbar">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link" href="/">Dashboard</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/new">New</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;