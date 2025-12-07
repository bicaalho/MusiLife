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

        const itens = currentUser.favoritos;
        const favs = await this.archiveController.translate(itens);

        const libraryItemsRaw = currentUser.library;
        const libraryItems = await this.archiveController.translate(libraryItemsRaw);
        
        
        this.view.render(currentUser, favs, libraryItems);
    }
}