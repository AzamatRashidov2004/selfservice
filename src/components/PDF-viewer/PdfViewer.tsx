import React, { useEffect, useRef, useState } from "react";
//import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "./PdfViewer.css";
import Loader from "../Loader/Loader";

interface PdfViewerProps {
  pdfUrl?: string; // URL or base64 string of the PDF
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setPdfUrl: React.Dispatch<React.SetStateAction<string>>;
}

const PdfViewer: React.FC<PdfViewerProps> = ({
  pdfUrl,
  setVisible,
  setPdfUrl,
}) => {
  const mainRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    const overlayDiv = document.createElement("div");
    overlayDiv.className = "overlay";
    document.body.appendChild(overlayDiv);
    const higlightDiv = document.getElementsByClassName("custom-main")[0];
    higlightDiv.classList.add("highlighted-div");
    higlightDiv.classList.remove("hidden");
    return () => {
      document.body.removeChild(overlayDiv);
      higlightDiv.classList.remove("highlighted-div");
      higlightDiv.classList.add("hidden");
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setVisible(false);
        setPdfUrl("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  useEffect(() => {
    if (pdfUrl === "") {
      setLoading(true);
    } else {
      setLoading(false);
    }
  });
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mainRef.current && !mainRef.current.contains(event.target as Node)) {
        setVisible(false);
        setPdfUrl("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <main className="container-fluid main-container custom-main" ref={mainRef}>
      {loading ? (
        <div className="loader-container-pdf h-100">
          <Loader loaderText="Loading Pdf"/>
        </div>
      ) : (
        <div className="pdf-container">
          <iframe
            src={pdfUrl}
            title="PDF Viewer"
            className="pdf-viewer"
            allowFullScreen
            loading="lazy"
          >
            <p>Your browser does not support iframes.</p>
          </iframe>
        </div>
      )}
    </main>
  );
};

export default PdfViewer;
