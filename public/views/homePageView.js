export default class HomePage {
    constructor() {
        this.gallery = document.querySelector(".gallery");
        this.aside = document.querySelector(".infos");
        this.searchInput = document.querySelector("#searchInput");
        this.searchButton = document.querySelector("#searchButton");
        this.searchIcon = document.querySelector("#searchIcon");
        this.isClearMode = false;

        this.setupSearchIconBehavior();
    }

    render(archives) {
        //debug
        console.log('archives raw:', archives);
        console.log('isArray?', Array.isArray(archives));
        console.log('typeof archives', typeof archives);
        console.log('this.gallery', document.querySelector('.gallery'));

        if (!this.gallery) return;

        // Limpa a galeria
        this.gallery.innerHTML = "";

        // Verifica se há resultados
        if (!archives || archives.length === 0) {
            this.gallery.innerHTML = '<p class="no-results">Nenhum álbum encontrado</p>';
            return;
        }

        // Renderiza os cards
        archives.forEach(archive => {
            const card = document.createElement("div");
            card.classList.add("container_cards");
            const href = `../pages/details.html?type=${encodeURIComponent(archive.type || 'archive')}&id=${encodeURIComponent(archive.id)}`;
            card.innerHTML = `
                <a class="cards" href="${href}">
                    <img class="imageCard" src="${archive.img}" alt="${archive.title}">
                </a>
                <p class="informationTitle">${archive.title}</p>
                <p class="information">Artist: ${archive.artist || ''}</p>
                <p class="information">Year: ${archive.year || ''}</p>
            `;
            this.gallery.appendChild(card);
        });
    }

    // Método para vincular o evento de busca
    bindSearch(handler) {
        this.onSearchHandler = handler;

        this.searchInput.addEventListener("input", (e) => {
            handler(e.target.value);
        });
    }


    // Método para obter o valor da busca
    getSearchValue() {
        return this.searchInput ? this.searchInput.value : "";
    }

    setupSearchIconBehavior() {
        if (!this.searchInput || !this.searchIcon) return;

        // muda ícone enquanto digita
        this.searchInput.addEventListener("input", () => {
            const hasText = this.searchInput.value.trim() !== "";

            if (hasText && !this.isClearMode) {
                this.turnIconToX();
            } else if (!hasText && this.isClearMode) {
                this.turnIconToSearch();
            }
        });

        // clicar no X limpa tudo
        this.searchIcon.addEventListener("click", () => {
            if (this.isClearMode) {
                this.searchInput.value = "";
                this.turnIconToSearch();

                // chama render com input vazio
                if (this.onSearchHandler) {
                    this.onSearchHandler("");
                }
            }
        });
    }

    turnIconToX() {
        this.searchIcon.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" stroke="black"
            stroke-width="2" viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    `;
        this.isClearMode = true;
    }

    turnIconToSearch() {
        this.searchIcon.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none"
            stroke="black" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
    `;
        this.isClearMode = false;
    }

}