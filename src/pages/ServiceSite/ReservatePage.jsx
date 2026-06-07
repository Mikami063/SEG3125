import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import repairImage from "../../assets/clint-bustrillos-K7OUs6y_cm8-unsplash.jpg";

function ReservatePage() {
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    navigate("/services/reference");
  }

  return (
    <div>
      <Navbar />
      <section className="container py-5">
        <div className="row align-items-center g-4">
          <div className="col-lg-8">
            <div className="border rounded bg-light p-4 p-md-5 text-start">
              <h1 className="h3 mb-4">Reservation</h1>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label" htmlFor="repair-kind">
                    Which Kind of Repair
                  </label>
                  <select className="form-select" id="repair-kind" defaultValue="">
                    <option value="" disabled>
                      Select repair kind
                    </option>
                    <option value="phone">Phone Repair</option>
                    <option value="laptop">Laptop Repair</option>
                    <option value="tablet">Tablet Repair</option>
                    <option value="other">Other Device Repair</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="repair-part">
                    Which Parts need Repair
                  </label>
                  <select className="form-select" id="repair-part" defaultValue="">
                    <option value="" disabled>
                      Select part
                    </option>
                    <option value="screen">Screen</option>
                    <option value="battery">Battery</option>
                    <option value="charging-port">Charging Port</option>
                    <option value="keyboard">Keyboard</option>
                    <option value="software">Software</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="reserve-date">
                    Reserve Date
                  </label>
                  <input className="form-control" id="reserve-date" type="date" />
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="customer-name">
                    Name
                  </label>
                  <input className="form-control" id="customer-name" type="text" />
                </div>

                <div className="mb-4">
                  <label className="form-label" htmlFor="phone-number">
                    Phone Number
                  </label>
                  <input className="form-control" id="phone-number" type="tel" />
                </div>

                <button className="btn btn-dark" type="submit">
                  Submit Reservation
                </button>
              </form>
            </div>
          </div>

          <div className="col-lg-4">
            <img
              className="img-fluid w-100 rounded"
              src={repairImage}
              alt="Electronic repair service"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default ReservatePage;
