import React, { useEffect, useState, useRef } from "react";
import "./Dashboard.css";
import {
  fetchProjectsDataReturn,
  projectFetchReturn,
} from "../../utility/types.ts";
import { fetchProjectsData } from "../../utility/Api_Utils.ts";
import Loader from "../../components/Loader/Loader.tsx";
import { useAuth } from "../../context/authContext.tsx";
import { useNavigate } from "react-router-dom";
import FileTree from "../../components/File-Tree/FileTree.jsx";
import FileBrowser from "../../components/File-Browser/FileBrowser.jsx";
import { ResizableBox, ResizeCallbackData } from "react-resizable";
import "react-resizable/css/styles.css";
import { useFiles } from "../../context/fileContext.tsx";
import PdfViewer from "../../components/PDF-viewer/PdfViewer.tsx";
import CodeEditor from "../../components/Code-Editor/CodeEditor.tsx";

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<projectFetchReturn[]>([]);

  const {
    setProjectsContext,
    pdfVisible,
    setPdfUrl,
    setPdfVisible,
    pdfUrl,
    incrementVisibleCount,
    totalFilesCount,
    currentFolder,
    visibleCount,
    codeLanguage,
    codeVisible,
    setCodeVisible,
    codeValue,
    setCodeValue,
  } = useFiles();

  const kronosProjectsWrapperRef = useRef<HTMLTableRowElement>(null);
  const accordionRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { authenticated, keycloak } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authenticated) {
      navigate("/");
    }
  });

  const fetchData = async (token: string | undefined) => {
    setLoading(true);
    await fetchProjectsData((allProjects: fetchProjectsDataReturn | null) => {
      if (!allProjects) {
        setLoading(false);
        return;
      }
      setProjects(allProjects.project);
    }, token);
    setLoading(false);
  };
  // Initial projects fetch
  useEffect(() => {
    fetchData(keycloak.token);
  }, []);

  // Synchronize the height of .kronos-projects-wrapper with .accordion using ResizeObserver
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      if (!kronosProjectsWrapperRef.current || !accordionRef.current) return;
      const accordionHeight = accordionRef.current.offsetHeight;
      kronosProjectsWrapperRef.current.style.height = `${accordionHeight}px`;
    });

    if (accordionRef.current) {
      observer.observe(accordionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!projects) return;

    if (projects.length % 2 === 0) {
      const root = document.documentElement;
      root.style.setProperty("--even-analytical-project-bg", "#FFFFFF");
      root.style.setProperty("--odd-analytical-project-bg", "#F2F2F2");
    }
    console.log("PROJECTS UPDATED", projects);
    setProjectsContext(projects);
  }, [projects]);

  useEffect(() => {
    if (!pdfVisible) {
      const table = document.getElementsByClassName("file-browser-wrapper");
      const loader = document.getElementsByClassName("loader-container");
      if (loading && table && loader) {
        table[0].classList.add("hidden");
        loader[0].classList.remove("hidden");
      } else if (!loading && table && loader) {
        table[0].classList.remove("hidden");
        loader[0].classList.add("hidden");
        const array_li = document.querySelectorAll(
          '[role="listitem"]'
        ) as NodeListOf<HTMLLIElement>;
        for (let i = 0; i < array_li.length; i++) {
          array_li[i].style.whiteSpace = "nowrap";
        }
      }
    }
  });

  //const [width, setWidth] = useState(window.innerWidth * 0.8);
  //const [position, setPosition] = useState(0);

  const [fileBrowserWidth, setFileBrowserWidth] = useState<number>(
    window.innerWidth * 0.6 // Start with 60% of the window width
  );
  const minFileTreeWidth = window.innerWidth * 0.2; // Minimum width of the file-tree-container
  const parentWidth = window.innerWidth;
  console.log("parent width: ", parentWidth);

  const handleResize = (
    event: React.SyntheticEvent,
    data: ResizeCallbackData
  ) => {
    console.log(event);
    if (data.size.width <= window.innerWidth * 0.6) {
      console.log(
        "data size widht and window inner width 80",
        data.size.width,
        window.innerWidth * 0.8
      );
      setFileBrowserWidth(data.size.width);
    }
  };

  /*const handleResize = (
    event: React.SyntheticEvent,
    data: ResizeCallbackData
  ) => {
    const deltaWidth = width - data.size.width;
    setWidth(data.size.width);
    setPosition(position + deltaWidth);
  };*/

  const loadButtonRef = useRef<HTMLButtonElement>(null);
  const handleLoadClick = () => {
    loadButtonRef?.current?.classList.add("hidden");
    incrementVisibleCount();
  };
  useEffect(() => {
    setTimeout(() => {
      if (
        //currentFolder === "0" ||
        totalFilesCount == 0 ||
        visibleCount >= totalFilesCount
      ) {
        // Access the classList of the actual DOM element
        loadButtonRef?.current?.classList.add("hidden");
      } else {
        console.log(loadButtonRef.current);
        loadButtonRef?.current?.classList.remove("hidden");
      }
    }, 0);
  }, [currentFolder, visibleCount, totalFilesCount]);

  useEffect(() => {
    const targetPdf = document.getElementById("pdf-container");
    const targetRest = document.getElementById("dashboard-part");
    const targetOverlay = document.getElementsByClassName("overlay")[0];
    if (pdfVisible) {
      targetRest?.classList.add("hidden");
      targetPdf?.classList.remove("hidden");
      targetOverlay?.classList.remove("hidden");
    } else {
      targetRest?.classList.remove("hidden");
      targetPdf?.classList.add("hidden");
      targetOverlay?.classList.add("hidden");
    }
  });

  // Code editor viewer handler
  useEffect(() => {
    const targetCode = document.getElementById("code-container");
    const targetRest = document.getElementById("dashboard-part");
    const targetOverlay = document.getElementsByClassName("overlay-code")[0];
    if (codeVisible) {
      targetRest?.classList.add("hidden");
      targetCode?.classList.remove("hidden");
      targetOverlay?.classList.remove("hidden");
    } else {
      targetRest?.classList.remove("hidden");
      targetCode?.classList.add("hidden");
      targetOverlay?.classList.add("hidden");
    }
  });

  const handleMouseEnter = () => {
    const body = document.body;
    body.classList.add("unscrollable");
  };

  const handleMouseLeave = () => {
    const body = document.body;
    body.classList.remove("unscrollable");
  };

  return (
    <section className="dashboard-section">
      <main className="container-fluid main-container">
        <div id="pdf-container" className="hidden">
          <PdfViewer
            pdfUrl={pdfUrl}
            setVisible={setPdfVisible}
            setPdfUrl={setPdfUrl}
          />
        </div>
        <div id="code-container" className="hidden">
          <CodeEditor
            initialValue={codeValue}
            setCodeValue={setCodeValue}
            language={codeLanguage}
            setVisible={setCodeVisible}
            readOnly={true}
          />
        </div>
        <div id="dashboard-part">
          <div className="bg-primary p-4 rounded mb-4 text-center">
            <h1 className="text-light">Available Projects</h1>
            <p className="text-light">Choose a project to edit or delete</p>
          </div>
          <br />
          <div className="loader-container">
            <Loader />
          </div>
          <div
            className="file-browser-wrapper"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="file-tree-container">
              <div className="scrollable-content">
                <FileTree />
              </div>
            </div>

            <div className="file-browser-container">
              <ResizableBox
                width={fileBrowserWidth}
                axis="x"
                minConstraints={[500, 0]}
                maxConstraints={[parentWidth - minFileTreeWidth, Infinity]}
                resizeHandles={["w"]}
                onResize={handleResize}
                style={{ minWidth: "500px" }}
              >
                <FileBrowser />
                <button
                  className="load-button"
                  onClick={handleLoadClick}
                  ref={loadButtonRef}
                  id="load-more-button"
                >
                  Load more...
                </button>
              </ResizableBox>
            </div>
          </div>
          <table className="table main-table w-100 locked-hidden">
            <thead>
              <tr>
                <th className="project-name text-start">Project Name</th>
                <th className="project-last-update text-start">Last Update</th>
                <th className="project-id text-start">Project ID</th>
                <th className="project-actions text-start">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                ref={kronosProjectsWrapperRef}
                className="kronos-projects-wrapper"
              >
                <div
                  ref={accordionRef}
                  className="accordion"
                  id="projectsAccordion"
                ></div>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </section>
  );
};

export default Dashboard;
