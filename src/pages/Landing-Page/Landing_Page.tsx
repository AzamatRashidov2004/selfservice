import React, { useEffect } from "react";
import "./Landing_Page.css";
import GoogleLoginButton from "../../components/Google-Auth/login";
import GoogleLogoutButton from "../../components/Google-Auth/logout";
import { gapi } from "gapi-script";

const clientId =
  "960257251812-noch3cpe8u57uomu598mtrr6phek348n.apps.googleusercontent.com";

const Landing_Page: React.FC = () => {
  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: "",
      });
    }

    gapi.load("client:auth2", start);
  });

  useEffect(() => {
    // Add a specific class to the body when this component is rendered
    document.body.classList.add("landing-page-body");

    // Cleanup by removing the class when the component unmounts
    return () => {
      document.body.classList.remove("landing-page-body");
    };
  }, []);
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <LoginSection />
    </div>
  );
};

const HeroSection: React.FC = () => {
  return (
    <section className="hero bg-light text-bright d-flex custom-padding">
      <div className="container text-center">
        {/* Simplified heading and added better clarity */}
        <h1
          className="display-3 font-weight-bold highlight-text"
          style={{ color: "#DFF0D8" }}
        >
          Build Your AI Bot in Minutes
        </h1>
        <p className="lead sub-heading" style={{ color: "#DFF0D8" }}>
          Customize, upload documents, and empower it to answer questions based
          on your content.
        </p>

        {/* Enlarged and emphasized call-to-action button */}
        <a href="#login" className="btn btn-primary btn-lg btn-call-to-action">
          Get Started
        </a>
      </div>
    </section>
  );
};

const FeaturesSection: React.FC = () => {
  return (
    <section className="features py-5 custom-padding" id="features">
      <div className="container pb-5 pt-5">
        <div className="row justify-content-between">
          {/* Use Bootstrap's .row class to handle the layout */}
          <div className="col-md-4 mb-4">
            <div className="feature text-center mb-4">
              <i className="fas fa-upload fa-3x mb-3"></i>
              <h2>Upload Documents</h2>
              <p>
                Upload relevant documents and files. Your bot will intelligently
                analyze and answer questions based on the provided content.
              </p>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="feature text-center mb-4">
              <i className="fas fa-robot fa-3x mb-3"></i>
              <h2>Build & Customize</h2>
              <p>
                Easily create your bot with an intuitive interface. Customize
                its personality, tone, and design according to your needs.
              </p>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="feature text-center mb-4">
              <i className="fas fa-question-circle fa-3x mb-3"></i>
              <h2>Answer Questions</h2>
              <p>
                Let your bot handle questions from users, providing accurate,
                document-based responses in real-time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const LoginSection: React.FC = () => {
  return (
    <section className="login-section py-5 bg-light" id="login">
      <div className="container pb-5">
        <div className="row justify-content-center">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body">
                <h2 className="card-title text-center mb-4">Login</h2>
                <form>
                  <div className="form-group mb-3">
                    <label htmlFor="username">Username</label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      placeholder="Enter your username"
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="Enter your password"
                    />
                  </div>
                  <div className="d-grid gap-2">
                    <button type="submit" className="btn btn-primary btn-block">
                      Login
                    </button>
                    <div className="text-center mt-4">
                      <div className="d-flex align-items-center my-4">
                        {/* Left horizontal line */}
                        <hr className="flex-grow-1" />
                        {/* Text in the middle */}
                        <span className="px-3">or</span>
                        {/* Right horizontal line */}
                        <hr className="flex-grow-1" />
                      </div>
                      <GoogleLoginButton />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Landing_Page;
