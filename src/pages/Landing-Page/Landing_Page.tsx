import React, { useEffect, useState } from "react";
import "./Landing_Page.css";
import { useAuth } from "../../context/authContext";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate } from "react-router-dom";

const Landing_Page: React.FC = () => {
  const { authenticated, isFirstLogin, setIsFirst } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    // Add a specific class to the body when this component is rendered
    document.body.classList.add("landing-page-body");
    if (authenticated && isFirstLogin) {
      navigate("/dashboard");
      setIsFirst(false);
    }
    // Cleanup by removing the class when the component unmounts
    return () => {
      document.body.classList.remove("landing-page-body");
    };
  }, [authenticated, navigate, isFirstLogin, setIsFirst]);
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <LoginSection />
    </div>
  );
};

const HeroSection: React.FC = () => {
  const { login, authenticated } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async () => {
    if (!authenticated) {
      try {
        await login();
      } catch (err) {
        console.error("Login error:", err);
      }
    } else {
      navigate("/new-project");
    }
  };

  return (
    <section className="hero bg-light text-bright d-flex custom-padding">
      <div className="container text-center">
        {/* Simplified heading and added better clarity */}
        <h1
          className="display-3 font-weight-bold highlight-text"
          style={{ color: "#DFF0D8" }}
        >
          {!authenticated ? "Build Your AI Bot in Minutes" : "Welcome Back!"}
        </h1>
        <p className="lead sub-heading" style={{ color: "#DFF0D8" }}>
          {!authenticated
            ? "Customize, upload documents, and empower it to answer questions based on your content."
            : "Manage your AI settings and enjoy personalized services."}
          <br />
          {authenticated ? "Press the button below to create your own bot" : ""}
        </p>

        {/* Enlarged and emphasized call-to-action button */}
        <a
          className="btn btn-primary btn-lg btn-call-to-action"
          onClick={handleSubmit}
        >
          Create your bot
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
  const { login, authenticated, logout, isFirstLogin, setIsFirst } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError(null); // Reset error state
    try {
      // Attempt to login using Keycloak
      await login();
      if (authenticated && isFirstLogin) {
        setIsFirst(false);
        navigate("/dashboard");
      }
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
          <div className="col-md-12">
            <div className="card">
              <div className="card-body">
                {authenticated ? (
                  <>
                    <h2 className="card-title text-center mb-4">Logout</h2>
                    <div className="d-flex justify-content-center align-items-center mb-4">
                      <svg
                        className="lock-icon"
                        width="70px"
                        height="70px"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11 22H8C5.17157 22 3.75736 22 2.87868 21.1213C2 20.2426 2 18.8284 2 16C2 13.1716 2 11.7574 2.87868 10.8787C3.75736 10 5.17157 10 8 10H16C18.8284 10 20.2426 10 21.1213 10.8787C22 11.7574 22 13.1716 22 16C22 18.8284 22 20.2426 21.1213 21.1213C20.2426 22 18.8284 22 16 22H15"
                          stroke="#1C274C"
                          stroke-width="1.5"
                          stroke-linecap="round"
                        />
                        <path
                          d="M6 10V8C6 7.65929 6.0284 7.32521 6.08296 7M17.811 6.5C17.1449 3.91216 14.7958 2 12 2C10.223 2 8.62643 2.7725 7.52779 4"
                          stroke="#1C274C"
                          stroke-width="1.5"
                          stroke-linecap="round"
                        />
                      </svg>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="card-title text-center">Login</h2>
                    <p className="card-title text-center mb-4 bold">
                      To access dashboard and other features
                    </p>
                    <div className="d-flex justify-content-center align-items-center mb-4">
                      <svg
                        className="lock-icon"
                        width="70px"
                        height="70px"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6 10V8C6 7.65929 6.0284 7.32521 6.08296 7M18 10V8C18 4.68629 15.3137 2 12 2C10.208 2 8.59942 2.78563 7.5 4.03126"
                          stroke="#1C274C"
                          stroke-width="1.5"
                          stroke-linecap="round"
                        />
                        <path
                          d="M11 22H8C5.17157 22 3.75736 22 2.87868 21.1213C2 20.2426 2 18.8284 2 16C2 13.1716 2 11.7574 2.87868 10.8787C3.75736 10 5.17157 10 8 10H16C18.8284 10 20.2426 10 21.1213 10.8787C22 11.7574 22 13.1716 22 16C22 18.8284 22 20.2426 21.1213 21.1213C20.2426 22 18.8284 22 16 22H15"
                          stroke="#1C274C"
                          stroke-width="1.5"
                          stroke-linecap="round"
                        />
                      </svg>
                    </div>
                  </>
                )}

                {authenticated ? (
                  <div className="d-grid gap-2">
                    <button
                      id="logout-button"
                      onClick={async () => {
                        navigate("/landing-page");
                        await logout();
                        if (!authenticated && !isFirstLogin) {
                          setIsFirst(true);
                        }
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
                        Login
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
