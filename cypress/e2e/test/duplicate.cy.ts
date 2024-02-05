import { HomePage } from "../pages/home-page";

describe("Duplicate test", () => {
  it("Duplicate visit login page", { tags: ["@smoke"] }, () => {
    HomePage.visitHomePage();
    HomePage.verifyHomePageElements();
  });

  it("Duplicate visit login page", { tags: ["@regression"] }, () => {
    HomePage.visitHomePage();
    HomePage.verifyHomePageElements();
  });
});
