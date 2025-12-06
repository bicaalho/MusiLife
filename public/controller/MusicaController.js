import Musica from "../model/musica.js";

export class MusicaController{
    constructor(){
        this.model = new Musica();
    }

    async getAll(){
    return await this.model.getAll();
  }
   async getById(id){
   
        return await this.model.getById(id);
      
  }
}