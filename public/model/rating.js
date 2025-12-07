// ../model/rating.js
import { DataAccess } from "./DataAccess/dataAccess.js";

export class Rating {
    constructor() {
        this.acesso = new DataAccess("/rating")
    }

    async getAll() {
        return await this.acesso.list();
    }

    async getById(id) {
        return await this.acesso.searchById(id);
    }

    // cria um rating novo
    async create(ratingData) {
        // ratingData deve ter: { archiveId, stars, userId }
        return await this.acesso.create(ratingData);
    }

    // pega todos ratings de um user (filtra localmente)
    async getByUserId(userId) {
        try {
            const all = await this.getAll();
            return all.filter(r => String(r.userId) === String(userId));
        } catch (err) {
            console.error('Erro ao buscar ratings por userId', err);
            return [];
        }
    }

    // opcional: pegar ratings por archiveId
    async getByArchiveId(archiveId) {
        try {
            const all = await this.getAll();
            return all.filter(r => String(r.archiveId) === String(archiveId));
        } catch (err) {
            console.error('Erro ao buscar ratings por archiveId', err);
            return [];
        }
    }

    async getCountsByArchiveId(archiveId) {
        const counts = [0, 0, 0, 0, 0];
        try {
            const all = await this.getAll();
            const filtered = all.filter(r => Number(r.archiveId) === Number(archiveId));
            filtered.forEach(r => {
                const s = Number(r.stars);
                if (s >= 1 && s <= 5) counts[s - 1] += 1;
            });
        } catch (err) {
            console.error('Erro ao buscar/contar ratings', err);
        }
        return counts;
    }
    async update(id, data) {
        try {
            return await this.acesso.update(id, data);
        } catch (err) {
            console.error('Erro ao atualizar rating', err);
            throw err;
        }
    }
    async getByUserAndArchive(userId, archiveId) {
        try {
            const all = await this.getAll();
            return all.find(r => String(r.userId) === String(userId) && Number(r.archiveId) === Number(archiveId)) || null;
        } catch (err) {
            console.error('Erro ao buscar rating por user+archive', err);
            return null;
        }
    }

    async createOrUpdateByUserArchive(payload) {
        try {
            const existing = await this.getByUserAndArchive(payload.userId, payload.archiveId);
            if (existing) {
                return await this.update(existing.id, { stars: Number(payload.stars) });
            } else {
                return await this.create({
                    userId: payload.userId,
                    archiveId: Number(payload.archiveId),
                    stars: Number(payload.stars)
                });
            }
        } catch (err) {
            console.error('Erro createOrUpdate rating', err);
            throw err;
        }
    }

}
