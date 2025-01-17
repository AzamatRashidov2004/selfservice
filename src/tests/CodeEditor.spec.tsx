/// <reference types="cypress" />
import React from "react";
import { mount } from "cypress/react18";
import CodeEditor from "../../src/CodeEditor"; // adjust the import path
import keycloak from "../keycloak"; // mock or stub

describe("CodeEditor Component", () => {
  beforeEach(() => {
    // Mock keycloak token
    cy.stub(keycloak, "token").value("fake-token");

    // Intercept API calls
    cy.intercept("POST", "/path/to/fsm", { statusCode: 200, body: {} }).as(
      "updateFSMFile"
    );
    cy.intercept("POST", "/path/to/html", { statusCode: 200, body: {} }).as(
      "updateHTMLFile"
    );
  });

  it("renders the editor with default props", () => {
    mount(
      <CodeEditor
        language="html"
        theme="vs-dark"
        initialValue="<h1>Hello</h1>"
        readOnly={true}
        setVisible={cy.stub()}
        setCodeValue={cy.stub()}
      />
    );
    cy.contains("Edit").should("exist");
    cy.get(".monaco-editor").should("exist");
  });

  it("allows switching to edit mode and then saving (HTML path)", () => {
    const setVisibleStub = cy.stub();

    mount(
      <CodeEditor
        language="html"
        theme="vs-dark"
        initialValue="<h1>Hello</h1>"
        readOnly={true}
        setVisible={setVisibleStub}
        setCodeValue={cy.stub()}
      />
    );

    // Initially read-only
    cy.get("button").contains("Edit").click();
    // Now in edit mode -> shows Save & Cancel
    cy.get("button").contains("Save").should("exist");
    cy.get("button").contains("Cancel").should("exist");

    // Modify the content in the monaco editor
    // For a real test, you might need to simulate typing in the editor.
    // Here, we just verify the "Save" flow:
    cy.get("button").contains("Save").click();

    // We expect either an intercept for updateHTMLFile or updateFSMFile
    cy.wait("@updateHTMLFile");
    cy.get("button").contains("Edit").should("exist"); // back to read-only
  });
});
