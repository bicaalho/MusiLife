export class DataAccess{
    //busca pelo endpoint a url json server que vai estar o dado
    constructor(endpoint){
        this.baseUrl = endpoint;
    }

    //lista todos os dados daquela tabela
    async list(){
        const res = await fetch(this.baseUrl);
        if(!res.ok) throw new Error(`Erro ao buscar base ${this.baseUrl}`);
        return await res.json();
    }

    async searchById(id){
        //procura pelo id
        const res = await fetch(`${this.baseUrl}/${id}`);
        if(!res.ok) throw new Error(`Erro ao buscar base ${this.baseUrl}/${id}`);
        return await res.json();
    }

    //Cria o dado
    async create(data){
        const res = await fetch(this.baseUrl,{
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify(data),
        });
        //REMOVER A VARIAVEL DATA DAQUI VULNERAVEL
        if(!res.ok) throw new Error(`Erro ao criar o registros: ${data}`);
        return await res.json();
    }

    //deleta o dado pelo id
    async delete(id){
        const res = await fetch(`${this.baseUrl}/${id}`,{
            method: "DELETE",
        });
        //vulneravel
        if(!res.ok) throw new Error(`Erro ao apagar dado: ${id}`);
        return true;
    }  
    
    //atualiza o dado pelo id. Recebe o Id e o novoDado(data)
    async update(id, data) {
    const res = await fetch(`${this.baseUrl}/${id}`, {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Erro ao atualizar o registro: ${id}`);
    return await res.json();
    }

    //busca com query string
    async search(searchTerm){
        if (!searchTerm || searchTerm.trim() === "") {
            return await this.list();
        }
        const res = await fetch(`${this.baseUrl}?q=${encodeURIComponent(searchTerm)}`);
        if(!res.ok) throw new Error(`Erro ao buscar por: ${searchTerm}`);
        return await res.json();
    }
}