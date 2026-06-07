import Navbar from "./Navbar";

function ReferancePage() {
  function handlePrint() {
    window.print();
  }

  return (
    <div>
      <div className="d-print-none">
        <Navbar />
      </div>
      <section className="container py-5">
        <div className="border rounded bg-light p-4 p-md-5 text-center">
          <h1 className="h3 mb-4">Reference Number: 22E4T</h1>

          <p className="lead mb-4">
            We have received your information.
            <br />
            We will contact you by phone for more details about your visit.
            <br />
            Thanks for choosing King Edward Electronic Repair Service.
          </p>

          <button className="btn btn-dark d-print-none" type="button" onClick={handlePrint}>
            Print this page
          </button>
        </div>
      </section>
    </div>
  );
}

export default ReferancePage;
