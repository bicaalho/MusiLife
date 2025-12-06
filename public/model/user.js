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

    
    
}