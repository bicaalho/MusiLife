import { DataAcces } from "./DataAccess/dataAccess.js"

export class User{
    constructor(){
        this.acesso = new DataAcces("/usuario");

    }

    getNome(){
        
    }
}