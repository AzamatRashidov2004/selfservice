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
import ProjectAnalytics from "../../components/Project-Analytics/Project-Analytics.tsx";

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<projectFetchReturn[]>([]);

  const {
    setProjectsContext,
    pdfVisible,
    setPdfUrl,
    setPdfVisible,
    pdfUrl,
    incrementVisibleCount,
    codeLanguage,
    codeVisible,
    setCodeVisible,
    codeValue,
    setCodeValue,
  } = useFiles();

  const kronosProjectsWrapperRef = useRef<HTMLTableRowElement>(null);
  const accordionRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDetailsOpen, setDetailsOpen] = useState<boolean>(false);
  const [selectedProjectData, setSelectedProjectData] = useState<null | {
    projectId: string;
    title: string;
  }>(null);

  const { authenticated, keycloak } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authenticated) {
      navigate("/");
    }
  });

  const handleNewProjectClick = () => {
    navigate("/new-project");
  };

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

  const [fileBrowserWidth, setFileBrowserWidth] = useState<number>(
    window.innerWidth * 0.7 // Start with 70% of the window width
  );
  const minFileTreeWidth = window.innerWidth * 0.1; // Minimum width of the file-tree-container
  const parentWidth = window.innerWidth;

  const handleResize = (
    event: React.SyntheticEvent,
    data: ResizeCallbackData
  ) => {
    console.log(event);
    if (data.size.width <= window.innerWidth * 0.6) {
      setFileBrowserWidth(data.size.width);
    }
  };

  const loadButtonRef = useRef<HTMLButtonElement>(null);
  const handleLoadClick = () => {
    loadButtonRef?.current?.classList.add("hidden");
    incrementVisibleCount();
  };

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

  useEffect(() => {
    const waitForElements = setInterval(() => {
      const chonkyNavbar = document.getElementsByClassName(
        "chonky-navbarWrapper"
      )[0];
      const chonkyToolBar = document.getElementsByClassName(
        "chonky-toolbarWrapper"
      )[0];
      const fileTreeNavbar = document.getElementsByClassName(
        "file-tree-new-button"
      )[0];
      const chonkyRoot =
        document.getElementsByClassName("chonky-chonkyRoot")[0];
      const btnListView = document.querySelector(
        '[title="Switch to List view"]'
      );
      const btnGridView = document.querySelector(
        '[title="Switch to Grid view"]'
      );

      const allIcons = document.querySelectorAll(
        ".newNavbarButton svg, .custom-chonky-toolbar button svg"
      );
      allIcons.forEach((icon) => {
        icon.setAttribute("width", "20");
        icon.setAttribute("height", "20");
      });

      if (
        chonkyRoot &&
        chonkyNavbar &&
        chonkyToolBar &&
        btnGridView &&
        btnListView
      ) {
        clearInterval(waitForElements); // Stop checking once elements are found

        btnListView.classList.add("newNavbarButton");
        btnGridView.classList.add("newNavbarButton");
        chonkyToolBar.classList.add("custom-chonky-toolbar");

        const newRow = document.createElement("div");
        newRow.classList.add("new-chonky-navbar");

        // Remove before appending
        chonkyRoot.removeChild(chonkyNavbar);
        chonkyRoot.removeChild(chonkyToolBar);

        newRow.appendChild(chonkyNavbar);
        newRow.appendChild(chonkyToolBar);

        chonkyRoot.prepend(newRow);

        chonkyNavbar.classList.add("custom-chonky-navbar");

        if (fileTreeNavbar) {
          fileTreeNavbar.classList.add("custom-file-tree-navbar");
        }
      }
    }, 500);

    return () => clearInterval(waitForElements);
  }, []);

  useEffect(() => {
    const target = document.getElementsByClassName(
      "chonkyWrapperChild"
    )[0] as HTMLDivElement;
    const target2 = document.getElementsByClassName(
      "chonkyWrapper"
    )[0] as HTMLDivElement;

    const updateHeight = () => {
      if (target && target2) {
        // Calculate the height based on the viewport height
        const heightInPixels = window.innerHeight - window.innerHeight * 0.1; // Subtract 1px if needed

        // Set the height of the target element
        target.style.height = `${heightInPixels}px`;
      }
    };

    // Initial height calculation
    updateHeight();

    // Add resize event listener to update height on screen size change
    window.addEventListener("resize", updateHeight);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  useEffect(() => {
    const target = document.getElementsByClassName(
      "parent-analytics"
    )[0] as HTMLDivElement;
    const target2 = document.getElementsByClassName(
      "analytics-dashboard-wrapper"
    )[0] as HTMLDivElement;
    const target3 = document.getElementsByClassName(
      "analytics-dashboard-content"
    )[0] as HTMLDivElement;

    const updateHeight = () => {
      if (target && target2 && target3) {
        // Calculate the height based on the viewport height
        const heightInPixels = window.innerHeight - window.innerHeight * 0.101; // Subtract 1px if needed

        // Set the height of the target element
        target.style.height = `${heightInPixels}px`;
        target3.style.maxHeight = `${heightInPixels - 156}px`;
        //target3.style.height = `${heightInPixels * 0.88}px`;
      }
    };

    // Initial height calculation
    updateHeight();

    // Add resize event listener to update height on screen size change
    window.addEventListener("resize", updateHeight);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  const analyticsWindowRef = useRef<HTMLDivElement>(null);
  const fileBrowserRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDetailsOpen) {
      analyticsWindowRef?.current?.classList.remove("hidden");
      fileBrowserRef?.current?.classList.add("hidden");
    } else {
      fileBrowserRef?.current?.classList.remove("hidden");
      analyticsWindowRef?.current?.classList.add("hidden");
    }
  }, [isDetailsOpen]);

  const handleMouseEnter = () => {
    const body = document.body;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    body.style.paddingRight = `${scrollbarWidth}px !important`; // Add padding to offset scrollbar disappearance
    body.classList.add("unscrollable");
  };

  const handleMouseLeave = () => {
    const body = document.body;
    body.style.paddingRight = ""; // Remove padding
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
          <br />
          <div className="loader-container">
            <Loader />
          </div>
          <div
            className="file-browser-wrapper"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="file-tree-container" id="file-tree-root">
              <div className="file-tree-new-button">
                <button
                  onClick={handleNewProjectClick}
                  className="btn btn-outline-success"
                >
                  New Project
                </button>
              </div>
              <div className="scrollable-content">
                <FileTree
                  // @ts-expect-error: The component is js so it doesnt find types
                  setDetailsOpen={setDetailsOpen}
                  setSelectedProjectData={setSelectedProjectData}
                />
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
                <div
                  ref={analyticsWindowRef}
                  className="hidden parent-analytics"
                  style={{
                    height: "100% !important",
                  }}
                >
                  <ProjectAnalytics
                    selectedProjectData={selectedProjectData}
                    setOpenDetails={() => {
                      setDetailsOpen(false);
                    }}
                  />
                </div>
                <div ref={fileBrowserRef} className="chonkyWrapper">
                  <FileBrowser
                    // @ts-expect-error: The component is js so it doesnt find types
                    setDetailsOpen={setDetailsOpen}
                    setSelectedProjectData={setSelectedProjectData}
                  />
                  <button
                    className="load-button"
                    onClick={handleLoadClick}
                    ref={loadButtonRef}
                    id="load-more-button"
                  >
                    Load more...
                  </button>
                </div>
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
