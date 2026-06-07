// Edit on top of starter code borrowed from Bootstrap 5 Navbar example
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg flex-column align-items-stretch p-0">
      <div className="container-fluid bg-white py-3">
        <Link
          className="navbar-brand fs-3 fw-bold m-0"
          style={{ fontFamily: '"Iosevka Charon", monospace' }}
          to="/services"
        >
          Restore4You
        </Link>
        <Link
          className="btn text-white ms-auto"
          style={{
            backgroundColor: "var(--bs-purple)",
            borderColor: "var(--bs-purple)",
          }}
          to="/services/reservate"
        >
          Book Service
        </Link>
      </div>

      <div className="container-fluid bg-dark">
        <button
          className="navbar-toggler navbar-dark my-2 ms-auto"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNavAltMarkup">
          <div className="navbar-nav py-2">
            <Link className="nav-link active text-white fw-bold" aria-current="page" to="/services/about">
              About Us
            </Link>
            <Link className="nav-link active text-white fw-bold" aria-current="page" to="/services/reservate">
              Reservate
            </Link>
            <Link className="nav-link active text-white fw-bold" aria-current="page" to="/services">
              Home
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
