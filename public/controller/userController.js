import { User } from "../model/user.js";

export class UserController{
    constructor(id){
        this.model = new User(id);
    }

    getUser(){
        return this.model.getUser();
    }

    getNome(){
      return this.model.getNome();
    }

    getEmail(){
        return this.model.getEmail();
    }

    getLogin(){
        return this.model.getLogin();
    }


}