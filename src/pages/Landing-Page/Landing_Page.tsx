import React, { useEffect, useState } from "react";
import "./Landing_Page.css";
import { useAuth } from "../../context/authContext";

const Landing_Page: React.FC = () => {
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
  const { login, authenticated, checkAuthenticated, logout, keycloak } =
    useAuth();
  const [error, setError] = useState<string | null>(null);
  console.log(keycloak.token);
  // Only log auth status after Keycloak is initialized
  useEffect(() => {
    console.log("auth", checkAuthenticated());
  }, [checkAuthenticated]);

  const handleSubmit = async () => {
    setError(null); // Reset error state
    try {
      // Attempt to login using Keycloak
      await login();
    } catch (err) {
      // Handle any errors that occur during login
      setError("Login failed.");
      console.error("Login error:", err);
    }
  };

  return (
    <section className="login-section py-5 bg-light" id="login">
      <div className="container pb-5">
        <div className="row justify-content-center">
          <div className="col-md-12" style={{ marginTop: "25%" }}>
            <div className="card">
              <div className="card-body">
                {authenticated ? (
                  <h2 className="card-title text-center mb-4">Welcome</h2>
                ) : (
                  <h2 className="card-title text-center mb-4">Login</h2>
                )}
                <br />
                {/* Added Keycloak Logo */}
                <img
                  src="https://www.xpand-it.com/wp-content/uploads/2020/06/Keycloak-logo.png"
                  alt="Keycloak Logo"
                  className="d-block mx-auto"
                  style={{ width: "180px", marginBottom: "20px" }}
                />
                {authenticated ? (
                  <div className="d-grid gap-2">
                    <button
                      onClick={async () => {
                        await logout();
                      }}
                      className="btn btn-primary btn-block"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <div className="d-grid gap-2">
                      <button
                        onClick={handleSubmit}
                        className="btn btn-primary btn-block"
                      >
                        Login with Keycloak
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Landing_Page;
