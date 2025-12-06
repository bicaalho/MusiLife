import { DataAccess } from "./DataAccess/dataAccess.js";

export default class Archive{
    constructor(type){
        this.type = String(type).toLowerCase();
        this.acesso = new DataAccess(`/${this.type}`);
    }

    async getAll(){
        return await this.acesso.list();
    }

    async getById(id){
        return await this.acesso.searchById(id);
    }

    async getTypeAndId(id) {
        if (!this.type || id == null) return null;
        const archive = this.archives[this.type];
        if (!archive) return null; 
        return await collection.getById(id);
    }

    // Método de busca que usa o dataAccess
    async search(searchTerm){
        return await this.acesso.search(searchTerm);
    }
}