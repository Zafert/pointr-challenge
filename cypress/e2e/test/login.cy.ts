import { HomePage } from "../pages/home-page";

describe("Basic test", () => {
  it("Visit login page", { tags: ["@smoke"] }, () => {
    HomePage.visitHomePage();
    HomePage.verifyHomePageElements();
  });

  it("Visit login page", { tags: ["@regression"] }, () => {
    HomePage.visitHomePage();
    HomePage.verifyHomePageElements();
  });
});
