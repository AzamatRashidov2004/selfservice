// src/CodeEditor.tsx
import React, { useEffect, useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import "./CodeEditor.css";
import Loader from "../Loader/Loader";
import { updateFSMFile, updateHTMLFile } from "../../api/kronos/postKronos";
import keycloak from "../../keycloak";
import { useFiles } from "../../context/fileContext";
import { removeItemFromCache } from "../../utility/Session_Storage";
import { createNotificationEvent } from "../../utility/Modal_Util";

interface CodeEditorProps {
  language: string;
  theme?: "light" | "vs-dark" | "hc-black" | "hc-light";
  initialValue: string;
  readOnly?: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setCodeValue: React.Dispatch<React.SetStateAction<string>>;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  language = "",
  theme = "vs-dark",
  initialValue = "hello",
  readOnly = false,
  setVisible,
}) => {
  const { current_project_id } = useFiles();
  const mainRef = useRef<HTMLDivElement>(null);
  const [isReadOnly, setIsReadOnly] = useState(readOnly);
  const [value, setValue] = useState<string | undefined>(initialValue);
  const [tempValue, setTempValue] = useState<string | undefined>(value);
  const [p_language, setCodeLanguage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleToggleEditMode = () => {
    setTempValue(value); // Save current value for potential cancellation
    setIsReadOnly(false);
  };

  async function handleSave() {
    setIsReadOnly(true); // Set back to read-only
    if (tempValue != value) {
      setTempValue(value);
      if (p_language == "html") {
        removeItemFromCache(current_project_id + ".html");
        try {
          await updateHTMLFile(
            current_project_id,
            value ? value : "",
            keycloak.token ? keycloak.token : ""
          );
          setVisible(false);
          createNotificationEvent("Success!", "File saved ", "success", 4000);
        } catch {
          setVisible(false);
          createNotificationEvent(
            "Something Went Wrong",
            "File save failed. Please try again.",
            "danger",
            4000
          );
        }
      } else {
        removeItemFromCache(current_project_id + ".fsm");
        try {
          await updateFSMFile(
            current_project_id,
            value ? value : "",
            keycloak.token ? keycloak.token : ""
          );
          setVisible(false);
          createNotificationEvent("Success!", "File saved ", "success", 4000);
        } catch {
          setVisible(false);
          createNotificationEvent(
            "Something Went Wrong",
            "File save failed. Please try again.",
            "danger",
            4000
          );
        }
      }
    }
  }

  const handleCancel = () => {
    setValue(tempValue);
    setIsReadOnly(true);
  };

  useEffect(() => {
    const overlayDiv = document.createElement("div");
    overlayDiv.className = "overlay-code";
    document.body.appendChild(overlayDiv);
    const higlightDiv = document.getElementsByClassName("custom-main-code")[0];
    higlightDiv.classList.add("highlighted-div-code");
    higlightDiv.classList.remove("hidden");
    return () => {
      document.body.removeChild(overlayDiv);
      higlightDiv.classList.remove("highlighted-div-code");
      higlightDiv.classList.add("hidden");
    };
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setVisible(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mainRef.current && !mainRef.current.contains(event.target as Node)) {
        setVisible(false);
        setIsReadOnly(true);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (initialValue !== "") setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (language !== "") setCodeLanguage(language);
  }, [language]);

  useEffect(() => {
    if (initialValue == "") {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [initialValue]);

  return (
    <main
      className="container-fluid main-container custom-main-code"
      ref={mainRef}
    >
      {loading ? (
        <div className="loader-container-code h-100">
          <Loader loaderText="Loading Code"/>
        </div>
      ) : (
        <div className="code-container">
          <div className="buttons-div">
            {isReadOnly ? (
              <button
                className="btn btn-outline-light btn-md"
                onClick={handleToggleEditMode}
              >
                Edit
              </button>
            ) : (
              <>
                <button
                  className="btn btn-outline-light btn-md"
                  onClick={handleSave}
                >
                  Save
                </button>
                <button
                  className="btn btn-outline-light btn-md"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
          <section className="code-editor-section">
            <Editor
              key={`${p_language}-${initialValue}`}
              defaultLanguage={p_language}
              theme={theme}
              value={value}
              onChange={(e: string | undefined) => {
                setValue(e);
              }}
              options={{
                fontSize: 18,
                readOnly: isReadOnly,
              }}
            />
          </section>
        </div>
      )}
    </main>
  );
};

export default CodeEditor;
