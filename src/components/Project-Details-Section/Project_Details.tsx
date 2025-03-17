import React from "react";

interface ProjectDescriptionSectionProps {
  projectName: string;
  setProjectName: React.Dispatch<React.SetStateAction<string>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  setLanguage: React.Dispatch<React.SetStateAction<"cs-CZ" | "en-US">>;
  introMessage: string;
  setIntroMessage: React.Dispatch<React.SetStateAction<string>>;
  introImage: string;
  setIntroImage: React.Dispatch<React.SetStateAction<string>>;
  handleNextButtonClick: () => void;
}

const ProjectDetails: React.FC<ProjectDescriptionSectionProps> = ({
  projectName,
  setProjectName,
  description,
  setDescription,
  setLanguage,
  introMessage,
  setIntroMessage,
  introImage,
  setIntroImage,
  handleNextButtonClick,
}) => {
  return (
    <section className="project-description-wrapper mt-4">
      <h2 className="project-description-title">Project Description</h2>
      <div className="mb-3">
        <label htmlFor="projectName" className="form-label">
          Project Name<span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className="form-control"
          id="projectName"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="description" className="form-label">
          Description<span className="text-danger">*</span>
        </label>
        <textarea
          className="form-control"
          id="description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="language" className="form-label">
          Select Language
        </label>
        <select
          id="language"
          className="form-select"
          onChange={(e) => setLanguage(e.target.value as "cs-CZ" | "en-US")}
        >
          <option value="en-US">English</option>
          <option value="cs-CZ">Czech</option>
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="introMessage" className="form-label">
          Introductory Message
        </label>
        <textarea
          className="form-control"
          id="introMessage"
          rows={4}
          value={introMessage}
          onChange={(e) => setIntroMessage(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="introImage" className="form-label">
          Introductory Image URL
        </label>
        <input
          type="url"
          className="form-control"
          id="introImage"
          value={introImage}
          onChange={(e) => setIntroImage(e.target.value)}
        />
      </div>
      <div className="d-flex justify-content-end">
        <button
          className="btn btn-primary"
          type="button"
          disabled={!projectName || !description}
          onClick={handleNextButtonClick}
        >
          Next Step
        </button>
      </div>
    </section>
  );
};

export default ProjectDetails;
