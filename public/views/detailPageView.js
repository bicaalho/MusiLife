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
                    backgroundColor: 'black',
                    borderColor: 'black',
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