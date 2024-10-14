import React, { useEffect } from "react";
import "./Contact_Page.css";
import { useNavigate } from "react-router-dom";
const Contact_Page: React.FC = () => {
  useEffect(() => {
    const target = document.getElementsByClassName("footer")[0] as HTMLElement;
    if (target) target.style.position = "relative";
    return () => {
      target.style.position = "absolute";
    };
  });

  const navigate = useNavigate();

  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <div className="col-12 py-3">
          <div className="bg-primary text-white text-center py-4">
            <h2>Contact</h2>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <iframe
            className="show"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2564.7092987484496!2d14.391953115705135!3d50.10322667942732!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470b9482f3b84e8b%3A0x47d6f4f2a148e0a1!2sJugosl%C3%A1vsk%C3%BDch%20partyz%C3%A1n%C5%AF%201580%2F3%2C%20166%2000%20Praha%206-Dejvice%2C%20Czechia!5e0!3m2!1sen!2sus!4v1614875513276!5m2!1sen!2sus"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            title="Google Maps Location"
          ></iframe>
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-md-4">
          <h5>Location:</h5>
          <p>
            ČVUT CIIRC
            <br />
            Jugoslávských partyzánů 1580/3
            <br />
            166 36 Praha 6, Dejvice, Czechia
          </p>
          <h5>Email:</h5>
          <p>info@example.com</p>
        </div>
        <div className="col-md-4">
          <h5>Useful Links</h5>
          <ul className="list-unstyled">
            <li>
              <a href="#" onClick={() => navigate("/")}>
                Home
              </a>
            </li>
          </ul>
        </div>
        <div className="col-md-4">
          <h5>Leave your email</h5>
          <p>and we inform you as soon as we are up and running.</p>
          <form className="d-flex">
            <input
              type="email"
              className="form-control me-2"
              placeholder="Enter your email"
              required
            />
            <button type="submit" className="btn btn-primary">
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact_Page;
