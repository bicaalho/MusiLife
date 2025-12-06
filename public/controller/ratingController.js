import { Rating } from "../model/rating.js";

export class RatingController{
    constructor(){
        this.model = new Rating();
    }

    async getAll(){
        return await this.model.getAll();
    }

    async getById(id){
        return await this.model.getById(id);
    }
    async getCountsByArchiveId(id){
        return await this.model.getCountsByArchiveId(id);
    }
}