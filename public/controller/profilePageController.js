import { ProfilePage } from "../views/profilePageView.js";

export class ProfilePageController{
    constructor(){
        this.view = new ProfilePage();
        this.rawUser =JSON.parse(sessionStorage.getItem("usuarioCorrente"));
        
    }

    async init(){
        this.view.render(this.rawUser);
    }
}