export default class account{
    constructor(ID, nome, email, senha,nickname,profile_img, type, followers, following){
        this.ID = ID;
        this.name = nome;
        this.email = email;
        this.senha = senha;
        this.nickname = nickname; 
        this.profile_img = profile_img;
        this.type = type;
        this.followers = followers;
        this.following = following;
    }
}