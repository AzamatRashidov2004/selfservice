// src/CodeEditor.tsx
import React, { useEffect, useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import "./CodeEditor.css";

interface CodeEditorProps {
  language?: string;
  theme?: "light" | "vs-dark" | "hc-black" | "hc-light";
  initialValue: string;
  readOnly?: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  language = "html",
  theme = "vs-dark",
  initialValue = "hello",
  readOnly = true,
  setVisible,
}) => {
  const mainRef = useRef<HTMLDivElement>(null);
  const [isReadOnly, setIsReadOnly] = useState(readOnly);
  const [value, setValue] = useState<string | undefined>(initialValue);
  const [tempValue, setTempValue] = useState<string | undefined>(value);

  const handleToggleEditMode = () => {
    setTempValue(value); // Save current value for potential cancellation
    setIsReadOnly(false);
  };

  const handleSave = () => {
    setTempValue(value);
    setIsReadOnly(true); // Set back to read-only
  };

  const handleCancel = () => {
    setValue(tempValue);
    setIsReadOnly(true);
  };

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
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <main className="container-fluid main-container custom-main" ref={mainRef}>
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
          defaultLanguage={language}
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
    </main>
  );
};

export default CodeEditor;
