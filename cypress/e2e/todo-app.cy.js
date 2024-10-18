/// <reference types="cypress" />

describe("Test Todo App from Live Session", function () {
  let randomStr;

  beforeEach(function () {
    cy.visit("http://localhost:3000");
  });

  it("renders todos", function () {
    cy.get("ul li");
  });

  it("adds todos", function () {
    const rndm = Math.random() * Date.now();
    randomStr = rndm;

    cy.get("[data-cy='description']").type(rndm);

    cy.get("[data-cy='btn-add']").click();

    cy.get("ul li").last().should("contain.text", rndm);
  });
});
