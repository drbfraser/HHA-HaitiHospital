import React from "react";
import { shallow } from "enzyme";
import chai from "chai";
import chaiEnzyme from "chai-enzyme";
chai.use(chaiEnzyme());

describe("App", () => {
  it("always passes tests", () => {
    expect(true).to.equal(true);
  });
});