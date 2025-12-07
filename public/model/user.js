import { DataAccess } from "./DataAccess/dataAccess.js"

export class User{

    constructor(id){
        this.id = id;
        this.acesso = new DataAccess("/usuario");
        this.rawUser;
    }

    async getUser(){
        return await this.acesso.searchById(this.id);
    }

    getNome(){
        return this.rawUser.nome;
    }

    getEmail(){
        return this.rawUser.email;
    }

    getLogin(){
        return this.rawUser.login;
    }

    
    async update(userId, data){
        return await this.acesso.update(userId, data);
    }

    async toggleFavorite(archiveId){
        const user = await this.getUser();
        if(!user) throw new Error('Usuário não encontrado');

        user.favoritos = user.favoritos || [];
        const idx = user.favoritos.findIndex(id => Number(id) === Number(archiveId));
        if(idx === -1){
            user.favoritos.push(Number(archiveId));
        } else {
            user.favoritos.splice(idx, 1);
        }

        // update no servidor
        const updated = await this.update(user.id, { favoritos: user.favoritos });
        // atualiza sessionStorage
        sessionStorage.setItem("usuarioCorrente", JSON.stringify(updated));
        return updated;
    }
    
}