import { Link } from "react-router-dom";
import Navbar from "./Navbar";

function AboutUs() {
  return (
    <div>
      <Navbar />
      <section className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="border rounded bg-light p-4 p-md-5 text-start">
              <h1 className="h3 mb-4">About Restore4You</h1>

              <p className="lead">
                Restore4You is an electronic repair service focused on clear
                communication, practical repair options, and dependable service
                for the devices people use every day.
              </p>

              <p>
                We help customers with phones, computers, and other personal
                electronics by making the repair process easier to understand:
                choose the service, reserve a visit, and receive a reference
                number for follow-up.
              </p>

              <p className="mb-4">
                This UI was designed and built as a course project for a service
                website experience.
              </p>

              <Link className="btn btn-dark" to="/">
                UI Author Home Page
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutUs;
