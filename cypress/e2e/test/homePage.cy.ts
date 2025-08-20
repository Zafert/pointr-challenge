import { HomePage } from "../pages/home-page";

describe("Home page visit test", () => {
  it("Home page visit test", { tags: ["@smoke", "@regression"] }, () => {
    HomePage.visitHomePage();
  });
});
