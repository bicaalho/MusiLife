import HomePageController from "./controller/homePageController.js"

document.addEventListener("DOMContentLoaded", () => {
  const homePageController = new HomePageController();
  homePageController.init();
});
