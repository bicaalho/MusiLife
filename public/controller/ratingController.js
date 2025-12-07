// ../controller/ratingController.js
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

    async create(ratingData){
        // ratingData: { archiveId, stars, userId }
        return await this.model.create(ratingData);
    }

    async getByUserId(userId){
        return await this.model.getByUserId(userId);
    }

    async getByArchiveId(archiveId){
        return await this.model.getByArchiveId(archiveId);
    }
    async getCountsByArchiveId(id){
        return await this.model.getCountsByArchiveId(id);
    }
        async update(id, data){
        return await this.model.update(id, data);
    }
     async getUserRatingForArchive(userId, archiveId){
        return await this.model.getByUserAndArchive(userId, archiveId);
    }

    async createOrUpdateRating(userId, archiveId, stars){
        return await this.model.createOrUpdateByUserArchive({
            userId,
            archiveId,
            stars
        });
    }

}
