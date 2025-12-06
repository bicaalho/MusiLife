import Album from "../model/album.js";

export class AlbumController{
    constructor(){
        this.modelo = new Album();
    }
    async getAll(){
   return await this.modelo.getAll();
  }

  async getById(id){
   
        return await this.modelo.getById(id);
      
  }
}