import Navbar from "./Navbar";
import computerImage from "../../assets/howard-bouchevereau-RSCirJ70NDM-unsplash.png";
import phoneImage from "../../assets/rahul-chakraborty-xsGxhtAsfSA-unsplash.png";
import otherImage from "../../assets/jakub-zerdzicki-4kdGXUOKwcI-unsplash.png";
import bannerImage from "../../assets/home_banner.png";

const serviceHighlights = [
  {
    image: computerImage,
    title: "Computer",
  },
  {
    image: phoneImage,
    title: "Phone",
  },
  {
    image: otherImage,
    title: "Other",
  },
];

function ServiceSitePage() {
  return (
    <div>
      <Navbar />
      <section className="container py-5">
        <div className="row align-items-center g-4">
          <section className="col-md-6 text-start">
            <h1>When your tech breaks, we bring it back</h1>
            <p className="lead">
              Restore4You, Quality repairs for the devices you rely on every day.
            </p>

            <div className="row g-3 mt-4">
              {serviceHighlights.map((item) => (
                <div className="col-4" key={item.title}>
                  <div
                    className="border rounded bg-white d-flex flex-column align-items-center justify-content-center text-center p-3"
                    style={{ aspectRatio: "1 / 1" }}
                  >
                    <img
                      className="img-fluid mb-2"
                      src={item.image}
                      alt={item.title}
                      style={{
                        maxHeight: "65%",
                        objectFit: "contain",
                      }}
                    />
                    <p className="small fw-semibold mb-0">
                      {item.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="col-md-6">
            <div className="p-4 bg-light border rounded">
              <img
                className="img-fluid w-100 rounded mb-3"
                src={bannerImage}
                alt="Electronic repair workspace"
              />
              <h2 className="h4">Book a Repair</h2>
              <p className="mb-0">
                Choose your device, describe the issue, and schedule a service
                time that works for you.
                </p>
              <p className="mb-0">
                Or call us at <strong>(613) XXX-XXXX</strong> to speak with a repair specialist.
              </p>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}

export default ServiceSitePage;
