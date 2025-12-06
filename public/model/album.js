import Archive from "./archive.js"

export default class Album extends Archive{
    constructor() {
      super("album");
    }

  async getAll(){
  return await super.getAll();
  }

  async getById(id){
  return await super.getById(id);
  }
}