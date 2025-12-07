export default class DetailPage {
    constructor() {
        this.mainInfos = document.querySelector(".mainInfos");
        this.initialWidth = 60;
    }

    async render(archive, rating) {
        if (!this.mainInfos) return;
        if (!archive) {
            console.error('Archive não fornecido para render');
            return;
        }
        //debug
        //console.log('Rendering archive:', archive);

        this.mainInfos.innerHTML = "";
        //cria o aside
        const asideContainerInfo = document.createElement("aside");
        asideContainerInfo.classList.add("containerInfo");
        asideContainerInfo.innerHTML = `
            <h1 class="alternativeCoverTitle">Alternative Covers</h1>
                <div>
                    ${this.renderAlternativeCovers(archive)}
                </div>
            </div>
        `;
        this.mainInfos.appendChild(asideContainerInfo);


        //cria o article
        const articleMainDetails = document.createElement("article");
        articleMainDetails.classList.add("mainInformation");
        articleMainDetails.innerHTML = `
            <p class="introducaoAlbum">${archive.description || 'Descrição não disponível'}</p>
            ${this.renderTrackList(archive)}
            <hr class="hrTam">
        `;
        this.mainInfos.appendChild(articleMainDetails);

        //cria o section
        const section = document.createElement("section");
        section.classList.add("about");
        section.innerHTML = `
            <div class="albumCoverInfos">
                <img class="AlbumCover" src="${archive.img}" alt="${archive.title}">
            </div>

            <div class="infoAtAll">
                <div class="albumInfos">
                    <h1 class="albumTitleInfo">${archive.title}</h1>
                    <h2 class="albumArtistInfo">${archive.artist || 'Artista desconhecido'}</h2>
                    <h3 class="albumYearInfo">${archive.year || 'Ano desconhecido'}</h3>
                    ${this.renderDuration(archive)}
                </div>
                <div class="estrelas"></div>
                <div id="rating" class="stars">
                    <canvas id="ratingChart" aria-label="Gráfico de avaliações" role="img"></canvas>
                </div>
                

                ${this.renderProducerInfo(archive)}
                ${this.renderGenreInfo(archive)}
            </div>
        `;
        this.mainInfos.appendChild(section);

        //DIMINUIR A FOTO DO ALBUM NO DETAIL DE ACORDO COM O SCROLL
        const albumCover = section.querySelector(".AlbumCover");
        if (albumCover) {
            window.addEventListener('scroll', () => {
                const scrollY = window.scrollY;
                const decreaseFactor = 0.07;
                let newWidth = this.initialWidth - scrollY * decreaseFactor;
                if (newWidth < 30) newWidth = 30;
                albumCover.style.width = newWidth + '%';
            });
        }
        await this.ensureChartJs();

        this.mountStarsUI(archive)
        this.mountHeartUI(archive);
        this.drawRatingChart(rating);

    }


    drawRatingChart(counts = [0, 0, 0, 0, 0]) {
        const canvas = document.getElementById('ratingChart');
        if (!canvas) return;

        if (this.chartInstance) {
            try { this.chartInstance.destroy(); } catch (e) { }
            this.chartInstance = null;
        }

        const ctx = canvas.getContext('2d');

        canvas.style.width = "120px";
        canvas.style.height = "160px";

        const labels = ["1★", "2★", "3★", "4★", "5★"];

        const totalVotes = counts.reduce((s, c) => s + c, 0);
        const options = {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: { display: false },

                tooltip: {
                    enabled: true,
                    mode: 'nearest',
                    intersect: true,
                    position: 'nearest',

                    backgroundColor: 'rgba(50,50,55,0.95)',
                    titleFont: { size: 13, family: "'Helvetica Neue', Arial, sans-serif", weight: '600' },
                    bodyFont: { size: 13, family: "'Helvetica Neue', Arial, sans-serif" },
                    padding: 8,
                    cornerRadius: 8,
                    caretSize: 6,
                    displayColors: false,
                    boxPadding: 0,

                    callbacks: {
                        title: () => '',

                        label: (context) => {
                            const idx = context.dataIndex;
                            const value = Number(context.dataset.data[idx] ?? 0);
                            const percent = totalVotes > 0 ? Math.round((value / totalVotes) * 100) : 0;
                            const stars = '★★★★★'.slice(0, idx + 1);
                            const formatted = value.toLocaleString();

                            return `${formatted} ${stars} ratings (${percent}%)`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    display: false,
                    grid: { display: false }
                },
                x: {
                    display: true,
                    grid: { display: false },
                    ticks: {
                        color: "black",
                        font: { size: 12 }
                    }
                }
            },
            animation: {
                duration: 300,
                easing: 'easeOutQuart'
            }
        };

        this.chartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: '',
                    data: counts,
                    backgroundColor: '#282828',
                    borderColor: '#282828',
                    borderWidth: 1,
                    borderRadius: {
                        topLeft: 6,
                        topRight: 6,
                        bottomLeft: 0,
                        bottomRight: 0,
                    },
                    borderSkipped: false
                }]
            },
            options
        });
        const ratingDiv = document.getElementById('rating');
        let existing = ratingDiv.querySelector('.rating-info');
        if (existing) existing.remove();

        if (totalVotes === 0) {
            const p = document.createElement('p');
            p.className = 'rating-info';
            p.textContent = 'Seja o primeiro a avaliar!';
            ratingDiv.appendChild(p);
        }
    }
    ensureChartJs() {
        return new Promise((resolve, reject) => {
            if (window.Chart) return resolve();
            if (this.chartLoaded) {
                const tryWait = () => window.Chart ? resolve() : setTimeout(tryWait, 50);
                tryWait();
                return;
            }
            this.chartLoaded = true;
            const s = document.createElement('script');
            s.src = 'https://cdn.jsdelivr.net/npm/chart.js';
            s.onload = () => resolve();
            s.onerror = (e) => reject(e);
            document.head.appendChild(s);
        });
    }

    renderAlternativeCovers(archive) {
        //FAZER LOGICA PRA FOTOS DOS ALTERNATIVE COVERS
        return '<p>Capas alternativas não disponíveis</p>';
    }

    renderTrackList(archive) {
        if (archive.type === 'album' || archive.type === 'ep') {
            if (archive.tracks && archive.tracks.length > 0) {
                const trackListItems = archive.tracks.map(track => `<li>${track}</li>`).join('');
                return `
                    <h2>TrackList</h2>
                    <ol class="tracklist">
                        ${trackListItems}
                    </ol>
                `;
            } else {
                return `Tracklist não disponível`;
            }
        }
        return '';
    }

    renderDuration(archive) {
        if (archive.type === 'musica' && archive.duration) {
            return `<h4 class="albumDurationInfo">Duração: ${archive.duration}</h4>`;
        }
        return '';
    }

    renderProducerInfo(archive) {
        if (archive.producers) {
            return `
                <div class="producerInfo">
                    <p class="producesTextStyle">Producers: ${archive.producers}</p>
                </div>
            `;
        }
        return `
            <div class="producerInfo">
                <p class="producesTextStyle">Producers:Não Disponível</p>
            </div>
        `;
    }

    renderGenreInfo(archive) {
        if (archive.genre) {
            return `
                <div class="genreInfo">
                    <p>Genre: ${archive.genre}</p>
                </div>
            `;
        }
        return `
            <div class="genreInfo">
                <p>Genre: Não disponível</p>
            </div>
        `;
    }

    async handleCreateRating(archiveId, stars) {
        try {
            const rawUser = sessionStorage.getItem("usuarioCorrente");
            if (!rawUser) throw new Error('Usuário não logado');
            const user = JSON.parse(rawUser);
            const { RatingController } = await import("../controller/ratingController.js");
            const ratingController = new RatingController();

            // buscar ratings do usuário e ver se já existe para esse archiveId
            const userRatings = await ratingController.getByUserId(user.id);
            const existing = userRatings.find(r => Number(r.archiveId) === Number(archiveId));

            let result;
            if (existing) {
                // atualiza
                result = await ratingController.update(existing.id, { stars: Number(stars) });
                console.log('Rating atualizado', result);
            } else {
                // cria novo
                const payload = {
                    archiveId: Number(archiveId),
                    stars: Number(stars),
                    userId: user.id
                };
                result = await ratingController.create(payload);
                console.log('Rating criado', result);
            }

            this.showTemporaryMessage(`Obrigado! Você avaliou ${stars} ★`);
            // opcional: atualiza gráfico ou contadores aqui (se quiser)
            return result;
        } catch (err) {
            console.error('Erro criando/atualizando rating', err);
            this.showTemporaryMessage('Erro ao salvar avaliação');
        }
    }


    showTemporaryMessage(msg, timeout = 1600) {
        let el = document.querySelector('.tmp-message');
        if (!el) {
            el = document.createElement('div');
            el.className = 'tmp-message';
            Object.assign(el.style, {
                position: 'fixed',
                right: '16px',
                top: '16px',
                background: 'rgba(0,0,0,0.8)',
                color: '#fff',
                padding: '8px 12px',
                borderRadius: '8px',
                zIndex: 9999,
                fontSize: '14px'
            });
            document.body.appendChild(el);
        }
        el.textContent = msg;
        el.style.opacity = '1';
        setTimeout(() => el.style.opacity = '0', timeout);
    }

   mountStarsUI(archive, initialValue = 0) {
    // pegar a DIV .estrelas (não usar #rating)
    const ratingDiv = document.querySelector('.estrelas');
    if (!ratingDiv) return;

    // limpa conteúdo anterior
    ratingDiv.innerHTML = '';

    const container = document.createElement('div');
    container.className = 'rating-widget';
    Object.assign(container.style, { display: 'flex', alignItems: 'center', gap: '10px' });

    const starsWrapper = document.createElement('div');
    starsWrapper.className = 'stars-wrapper';
    Object.assign(starsWrapper.style, { display: 'flex', cursor: 'pointer', userSelect: 'none', alignItems: 'center' });

    // SVG base da estrela (contorno)
    const starSvg = encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="1">
            <path d="M12 .587l3.668 7.431L24 9.748l-6 5.854 1.416 8.266L12 19.771 4.584 23.868 6 15.6 0 9.748l8.332-1.73z"/>
        </svg>`
    );

    const paint = (value) => {
        const children = starsWrapper.children;
        for (let i = 0; i < 5; i++) {
            const starEl = children[i];
            const starIndex = i + 1;
            let fill = 0;
            if (value >= starIndex) fill = 1;
            else if (value >= (starIndex - 0.5)) fill = 0.5;
            else fill = 0;

            if (fill === 1) {
                starEl.style.background = `linear-gradient(90deg, #FFD54A 100%, transparent 0), url("data:image/svg+xml;utf8,${starSvg}")`;
            } else if (fill === 0.5) {
                starEl.style.background = `linear-gradient(90deg, #FFD54A 50%, transparent 50%), url("data:image/svg+xml;utf8,${starSvg}")`;
            } else {
                starEl.style.background = `linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 100%), url("data:image/svg+xml;utf8,${starSvg}")`;
            }
            starEl.style.backgroundRepeat = 'no-repeat, no-repeat';
            starEl.style.backgroundPosition = 'left center, center';
            starEl.style.backgroundSize = '100% 100%, 20px 20px';
        }
    };

    for (let i = 0; i < 5; i++) {
        const s = document.createElement('div');
        s.className = 'star';
        Object.assign(s.style, {
            width: '30px',
            height: '30px',
            display: 'inline-block',
            borderRadius: '4px',
            overflow: 'hidden',
            transition: 'background 120ms ease'
        });

        s.addEventListener('mousemove', (ev) => {
            const rect = s.getBoundingClientRect();
            const x = ev.clientX - rect.left;
            const half = rect.width / 2;
            const starIndex = i + 1;
            const value = x < half ? (starIndex - 0.5) : starIndex;
            paint(value);
            s.dataset.hoverValue = String(value);
        });

        s.addEventListener('mouseleave', () => {
            const selected = starsWrapper.dataset.selectedValue ? Number(starsWrapper.dataset.selectedValue) : 0;
            paint(selected);
        });

        s.addEventListener('click', async () => {
            const value = s.dataset.hoverValue ? Number(s.dataset.hoverValue) : (i + 1);
            // cria ou atualiza rating
            await this.handleCreateRating(archive.id, value);
            starsWrapper.dataset.selectedValue = String(value);
            paint(value);
        });

        starsWrapper.appendChild(s);
    }

    starsWrapper.addEventListener('mouseleave', () => {
        const selected = starsWrapper.dataset.selectedValue ? Number(starsWrapper.dataset.selectedValue) : 0;
        paint(selected);
    });

    const info = document.createElement('div');
    info.className = 'rating-text';
    info.textContent = 'Clique para avaliar';
    Object.assign(info.style, { fontSize: '13px', color: '#333' });

    container.appendChild(starsWrapper);
    container.appendChild(info);
    ratingDiv.appendChild(container);

    // se veio initialValue (ex.: 3.5) marca como selecionado
    if (initialValue && Number(initialValue) > 0) {
        starsWrapper.dataset.selectedValue = String(initialValue);
        paint(Number(initialValue));
    } else {
        paint(0);
    }
}


    // monta o coração (favoritar)
    // monta o coração (favoritar) — usa também .estrelas (mas adiciona em container próprio dentro dela)
    async mountHeartUI(archive) {
        const parent = document.querySelector('.estrelas');
        if (!parent) return;

        // cria / limpa área de heart
        let heartArea = parent.querySelector('.heart-area');
        if (heartArea) heartArea.remove();

        heartArea = document.createElement('div');
        heartArea.className = 'heart-area';
        Object.assign(heartArea.style, { marginLeft: '8px', display: 'flex', alignItems: 'center' });

        const heartEl = document.createElement('div');
        heartEl.className = 'favorite-heart';
        Object.assign(heartEl.style, {
            width: '34px',
            height: '34px',
            display: 'inline-block',
            cursor: 'pointer',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '20px 20px',
            backgroundPosition: 'center',
            transition: 'transform 120ms ease, filter 120ms ease'
        });

        // helpers para imagens inline
        const heartOutline = encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black"><path d="M12 21s-7-4.434-9.5-7.332C-0.5 8.3 4 3 8.5 6.5 10.4 8 12 9 12 9s1.6-1 3.5-2.5C20 3 24.5 8.3 21.5 13.668 19 16.566 12 21 12 21z"/></svg>`
        );
        const heartFilled = encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FF3B30" stroke="#FF3B30"><path d="M12 21s-7-4.434-9.5-7.332C-0.5 8.3 4 3 8.5 6.5 10.4 8 12 9 12 9s1.6-1 3.5-2.5C20 3 24.5 8.3 21.5 13.668 19 16.566 12 21 12 21z"/></svg>`
        );

        // aplica estado inicial
        const favInit = this.isArchiveFavorited(archive.id);
        if (favInit) {
            heartEl.style.backgroundImage = `url("data:image/svg+xml;utf8,${heartFilled}")`;
        } else {
            heartEl.style.backgroundImage = `url("data:image/svg+xml;utf8,${heartOutline}")`;
        }

        heartEl.addEventListener('mouseenter', () => {
            // efeito hover visual (mostra preenchido)
            heartEl.style.transform = 'scale(1.05)';
            heartEl.style.backgroundImage = `url("data:image/svg+xml;utf8,${heartFilled}")`;
        });

        heartEl.addEventListener('mouseleave', () => {
            const isFav = this.isArchiveFavorited(archive.id);
            heartEl.style.transform = 'scale(1)';
            heartEl.style.backgroundImage = isFav ? `url("data:image/svg+xml;utf8,${heartFilled}")` : `url("data:image/svg+xml;utf8,${heartOutline}")`;
        });

        heartEl.addEventListener('click', async () => {
            try {
                const rawUser = sessionStorage.getItem("usuarioCorrente");
                if (!rawUser) throw new Error('Usuário não logado');
                const user = JSON.parse(rawUser);
                const UserController = (await import("../controller/userController.js")).UserController;
                const uc = new UserController(user.id);
                const updated = await uc.toggleFavorite(archive.id);
                const isFav = updated.favoritos && updated.favoritos.includes(Number(archive.id));
                heartEl.style.backgroundImage = isFav ? `url("data:image/svg+xml;utf8,${heartFilled}")` : `url("data:image/svg+xml;utf8,${heartOutline}")`;
                this.showTemporaryMessage(isFav ? 'Favoritado' : 'Removido dos favoritos');
            } catch (err) {
                console.error('Erro ao favoritar', err);
                this.showTemporaryMessage('Erro ao favoritar');
            }
        });

        heartArea.appendChild(heartEl);
        parent.appendChild(heartArea);
    }

    // util: verifica sessionStorage.usuarioCorrente.favoritos
    isArchiveFavorited(archiveId) {
        try {
            const raw = sessionStorage.getItem('usuarioCorrente');
            if (!raw) return false;
            const u = JSON.parse(raw);
            if (!u.favoritos) return false;
            return u.favoritos.some(id => Number(id) === Number(archiveId));
        } catch (e) {
            return false;
        }
    }

    // util: pinta heart preenchido/nao
    applyHeartState(heartEl, isFav) {
        if (isFav) {
            heartEl.style.backgroundImage = `url('data:image/svg+xml;utf8,${encodeURIComponent(
                `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FF3B30" stroke="#FF3B30"><path d="M12 21s-7-4.434-9.5-7.332C-0.5 8.3 4 3 8.5 6.5 10.4 8 12 9 12 9s1.6-1 3.5-2.5C20 3 24.5 8.3 21.5 13.668 19 16.566 12 21 12 21z" /></svg>`
            )}')`;
        } else {
            heartEl.style.backgroundImage = `url('data:image/svg+xml;utf8,${encodeURIComponent(
                `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black"><path d="M12 21s-7-4.434-9.5-7.332C-0.5 8.3 4 3 8.5 6.5 10.4 8 12 9 12 9s1.6-1 3.5-2.5C20 3 24.5 8.3 21.5 13.668 19 16.566 12 21 12 21z" /></svg>`
            )}')`;
        }
    }


    showError(message) {
        const mainInfos = document.querySelector(".mainInfos");
        if (mainInfos) {
            mainInfos.innerHTML = `
            <div></div>
                <div class="error-message">
                    <h2>Erro</h2>
                    <p>${message}</p>
                    <iframe class="frameErro" src="https://lottie.host/embed/aab4f643-0891-4240-b9e8-8777e206de3f/ZG942K8Wua.lottie"></iframe> 
                    <a href="../public/index.html">Voltar para a página inicial</a>
                </div>
                 <div></div>
            `;
        }
    }
}