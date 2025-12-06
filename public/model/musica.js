import Archive from "./archive.js";
import { DataAccess } from "./DataAccess/dataAccess.js";

export default class Musica extends Archive{
    constructor() {
        super("musica");
    }

  async getAll(){
  return await super.getAll();
  }

  async getById(id){
  return await super.getById(id);
  }
}
