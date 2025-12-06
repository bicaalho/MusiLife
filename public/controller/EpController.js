import Ep from "../model/ep.js";

export class EpController{
    constructor(){
        this.model = new Ep();
    }

    async getAll(){
    return await this.model.getAll();
  }
   async getById(id){
    return await this.model.getById(id);
  }
}