import HomePage from "../views/homePageView.js";
import { ArchivesController } from "./ArchivesController.js";

export default class HomePageController{
    constructor(){
        this.view = new HomePage();
        this.data = new ArchivesController();
        this.allArchives = []; // Armazena todos os álbuns
    }

    async init(){
        // Carrega todos os álbuns
        this.allArchives = await this.data.getAll();
        this.view.render(this.allArchives);
        
        // Vincula o evento de busca
        this.view.bindSearch(this.handleSearch.bind(this));
    }

    // Handler para a busca
    handleSearch(searchTerm){
        this.handleSearchFrontend(searchTerm);
    }

    //Busca no Frontend 
    handleSearchFrontend(searchTerm){
        // Se não houver termo de busca, mostra todos os álbuns
        if (!searchTerm || searchTerm.trim() === "") {
            this.view.render(this.allArchives);
            return;
        }

        // Filtra os álbuns baseado no termo de busca
        const filteredArchives = this.filterArchives(searchTerm);
        this.view.render(filteredArchives);
    }

    // Metodo para filtrar os albuns, busca pelo title, type, year, etc
    filterArchives(searchTerm){
        const term = searchTerm.toLowerCase().trim();
        
        return this.allArchives.filter(archive => {
            // Busca no título
            const titleMatch = archive.title?.toLowerCase().includes(term);
            
            // Busca no artista
            const artistMatch = archive.artist?.toLowerCase().includes(term);
            
            // Busca no ano (converte para string)
            const yearMatch = archive.year?.toString().includes(term);
            
            // Busca no tipo (album, ep, musica)
            const typeMatch = archive.type?.toLowerCase().includes(term);
            
            // Retorna true se encontrar em qualquer campo
            return titleMatch || artistMatch || yearMatch || typeMatch;
        });
    }

}