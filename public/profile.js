import {ProfilePageController} from "./controller/profilePageController.js"

document.addEventListener("DOMContentLoaded", () => {
  const profilePageController = new ProfilePageController();
  profilePageController.init();
});
