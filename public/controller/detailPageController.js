import DetailPage from "../views/detailPageView.js";
import { ArchivesController } from "./ArchivesController.js";
import { RatingController } from "./ratingController.js";

export default class DetailPageController {
    constructor() {
        this.view = new DetailPage();
        this.archiveController = new ArchivesController();
        this.ratingController = new RatingController();
    }

    async init() {
        //passagem de parâmetros entre páginas
        const urlParams = new URLSearchParams(window.location.search);
        const type = urlParams.get('type');
        const id = urlParams.get('id');
        // Debug
        //console.log('URL params:', { type, id });
        if (type && id !== null) {
            const archive = await this.archiveController.getTypeAndId(type, parseInt(id));
            const counts = await this.ratingController.getCountsByArchiveId(archive.id);
            console.log(archive.id);
            // Debug
            console.log('Archive found:', archive); 
            if (archive) {

                //aqui tem que passar o rating tb!!!!!!!!!
                this.view.render(archive, counts);
            } else {
                this.view.showError("Arquivo não encontrado");
            }
        } else {
            this.view.showError("Parâmetros inválidos na URL");
        }
    }
}