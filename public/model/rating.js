import { DataAccess } from "./DataAccess/dataAccess.js";

export class Rating{
    constructor(){
        this.acesso = new DataAccess("/rating")
    }

    async getAll(){
        return await this.acesso.list();
    }

    async getById(id){
        return await this.acesso.searchById(id);
    }

    async getCountsByArchiveId(archiveId){
        const counts = [0,0,0,0,0];
        try{
            const all = await this.getAll();
            const filtered = all.filter(r => Number(r.archiveId) === Number(archiveId));
            filtered.forEach(r => {
                const s = Number(r.stars);
                if (s >= 1 && s <= 5) counts[s-1] += 1;
            });
        }catch(err){
            console.error('Erro ao buscar/contar ratings', err);
        }
        return counts;
    }
}