import { ProfilePage } from "../views/profilePageView.js";
import {ArchivesController} from "../controller/ArchivesController.js"
import { UserController } from "./userController.js";

export class ProfilePageController{
    constructor(){
        this.view = new ProfilePage();
        this.userId =JSON.parse(sessionStorage.getItem("usuarioCorrente")).id;
        this.archiveController = new ArchivesController();
        this.userController = new UserController(this.userId);
    }

    async init(){
        const currentUser = await this.userController.getUser();

        let i = 9;
        const itens = currentUser.favoritos;
        const favs = await this.archiveController.translate(itens);

        let j=0;
        favs.forEach(fav => {
            console.log(j++ +fav.img);
        });
        
        this.view.render(currentUser, favs);
    }
}