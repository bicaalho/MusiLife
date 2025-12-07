import { AlbumController } from "./AlbumController.js";
import { EpController } from "./EpController.js";
import { MusicaController } from "./MusicaController.js";
import { DataAccess } from "../model/DataAccess/dataAccess.js";


export class ArchivesController{
    constructor(){
        this.albumController = new AlbumController();
        this.epController = new EpController();
        this.musicaController = new MusicaController();
        this.acesso = new DataAccess("/album");
    }    
    
    async getAll() {
        const results = await Promise.all([
            Promise.resolve(this.albumController.getAll()),
            Promise.resolve(this.epController.getAll()),
            Promise.resolve(this.musicaController.getAll()),
        ]);
        const [albuns = [], eps = [], musicas = []] = results.map(r => Array.isArray(r) ? r : []);
        console.log([...albuns, ...eps, ...musicas]);
        return [...albuns, ...eps, ...musicas];
    }

    async getTypeAndId(type, id) {
        if (!type || id == null) return null;
        const t = String(type).toLowerCase();

        switch (t) {
            case 'album':
            case 'albuns':
            case 'albums':
                return await this.albumController.getById(id);
            case 'ep':
            case 'eps':
                return await this.epController.getById(id);
            case 'musica':
            case 'musicas':
            case 'music':
            case 'musics':
                return await this.musicaController.getById(id);
            default:
                const all = await this.getAll();
                return all.find(item => String(item.id) === String(id)) || null;
        }
    }

    async search(searchTerm) {
        if (!searchTerm || searchTerm.trim() === "") {
            return await this.getAll();
        }

        try {
            const results = await Promise.all([
                this.albumController.search ? this.albumController.search(searchTerm) : [],
                this.epController.search ? this.epController.search(searchTerm) : [],
                this.musicaController.search ? this.musicaController.search(searchTerm) : [],
            ]);

            const [albuns = [], eps = [], musicas = []] = results.map(r => Array.isArray(r) ? r : []);
            return [...albuns, ...eps, ...musicas];
        } catch (error) {
            console.error("Erro ao buscar archives:", error);
            return [];
        }
    }

   async translate(ids) {
    const promises = ids.map(async id => {
        try {
            const item = await this.acesso.searchById(id);
            return item;
        } catch {
            return null;
        }
    });

    return await Promise.all(promises);
}

}