
export class ProfilePage {
    constructor() {
        this.infos = document.querySelector(".profileInf");
    }

    render(user, archives) {
        if (!this.infos) return;
        this.infos.innerHTML = "";

        const container = document.createElement("div");
        container.classList.add("containerProfile");
        container.innerHTML = "";

        const head = document.createElement("div");
        head.classList.add("headProfile");

        const left = document.createElement("div");
        left.classList.add("left");
        const card = document.createElement("div");
        card.classList.add("userInfo");

        card.innerHTML = `
            <h1>${user.nome ?? "Sem nome"}</h1>
            <p><span style="color: #828282;">@${user.login ?? "—"}</span></p>
            <div class="followArea">
                <p>${user.seguidores ?? "—"} <span style="color: #828282;">Seguidores</span></p> <p>${user.seguindo} <span style="color: #828282;">Seguindo</span></p>
            </div>
            `;

        left.appendChild(card);

        const right = document.createElement("div");
        right.classList.add("right");

        const imgContainer = document.createElement("div");
        imgContainer.classList.add("imgContainer");
        imgContainer.innerHTML = `
            <img src="../assets/fotoPerfilQuadrada.jpg">
        `;

        //botoes editar perfil e compartilhar
        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("buttonContainer");

        buttonContainer.innerHTML = `
            <a class="btnEdit">Editar Perfil</a>
            <a class ="btnShare">Compartilhar</a>
        `;
        const carousel = document.createElement("carrossel-slider");
        carousel.setAttribute("width", "500px");
        carousel.setAttribute("height", "26px");

        // desenhando itens do carrossel

        carousel.draw(archives, (archive) => {
            const wrapper = document.createElement("a");
            const href = `../pages/details.html?type=${encodeURIComponent(archive.type || 'archive')}&id=${encodeURIComponent(archive.id)}`;
            wrapper.href = href;
            wrapper.innerHTML = `
            <img src="${archive.img}" style="width:100%;height:auto;">
        `;
            return wrapper;
        });


        //area dos appends
        right.appendChild(imgContainer);
        head.appendChild(left);
        head.appendChild(right);
        container.appendChild(head);
        container.appendChild(buttonContainer);
        container.appendChild(carousel);
        this.infos.appendChild(container);
    }

    renderError(msg) {
        if (!this.infos) return;
        this.infos.innerHTML = `<div class="error">${msg}</div>`;
    }
}
