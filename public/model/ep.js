import Archive from "./archive.js"
import { DataAccess } from "./DataAccess/dataAccess.js";

export default class Ep extends Archive{
    constructor() {
        super("ep");
    }
    
  async getAll(){
  return await super.getAll();
  }

  async getById(id){
  return await super.getById(id);
  }
}