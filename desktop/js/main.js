document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".container");
    const pilha = [];
    let menuAberto = false;

    function estadoAtual() {
        return pilha.length > 0 ? pilha[pilha.length - 1] : null;
    }

    function limparTodosEstados() {
        container.classList.remove("aberto");
        document.querySelectorAll("[data-estado]").forEach(el => {
            container.classList.remove(el.dataset.estado);
        });
    }

    function aplicarEstado() {
        limparTodosEstados();
        if (menuAberto || pilha.length > 0) {
            container.classList.add("aberto");
        }
        pilha.forEach(estado => {
            container.classList.add(estado);
        });
        // Ao sair do Podcast/Documentário, encerra qualquer player e volta às capas/thumbnails
        if (!pilha.includes("podcast-aberto")) {
            resetPodcast();
        }
        if (!pilha.includes("videos-aberto")) {
            resetVideos();
        }
    }

    // Reseta o podcast: remove o player (parando o áudio) e restaura as capas
    function resetPodcast() {
        document.querySelectorAll(".podcast-card").forEach(card => {
            const embed = card.querySelector(".podcast-embed");
            if (embed) embed.remove();
            const facade = card.querySelector(".podcast-facade");
            if (facade) facade.style.display = "";
            card.classList.remove("playing");
        });
    }

    // Reseta os vídeos: remove o iframe (parando o vídeo) e restaura as thumbnails
    function resetVideos() {
        document.querySelectorAll(".video-card").forEach(card => {
            const iframe = card.querySelector(".video-iframe");
            if (iframe) iframe.remove();
            const facade = card.querySelector(".video-facade");
            if (facade) facade.style.display = "";
            card.classList.remove("playing");
        });
    }

    function abrirNivel(estado) {
        pilha.push(estado);
        aplicarEstado();
    }

    function fecharNivel() {
        pilha.pop();
        aplicarEstado();
    }

    // Pasta Mae - voltar um nivel por vez
    const pastaMae = document.querySelector(".pasta-mae");
    if (pastaMae) {
        pastaMae.addEventListener("click", () => {
            if (pilha.length > 0) {
                fecharNivel();
            } else if (menuAberto) {
                menuAberto = false;
                aplicarEstado();
            } else {
                menuAberto = true;
                aplicarEstado();
            }
        });
    }

    // Todas as pastas com data-estado
    document.querySelectorAll("[data-estado]").forEach(pasta => {
        pasta.addEventListener("click", (e) => {
            e.stopPropagation();
            const estado = pasta.dataset.estado;

            if (estadoAtual() === estado) {
                fecharNivel();
            } else {
                const nivel = parseInt(pasta.dataset.nivel || "1", 10);
                while (pilha.length >= nivel) {
                    pilha.pop();
                }
                abrirNivel(estado);
            }
        });
    });

    // Facade dos vídeos: carrega o player do YouTube só ao clicar (performance)
    document.querySelectorAll(".video-facade").forEach(facade => {
        facade.addEventListener("click", () => {
            const id = facade.dataset.videoid;
            if (!id) return;
            const card = facade.closest(".video-card");
            if (!card) return;
            card.classList.add("playing");
            facade.style.display = "none"; // oculta a thumbnail, sem removê-la

            const iframe = document.createElement("iframe");
            iframe.className = "video-iframe";
            iframe.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0";
            iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
            iframe.allowFullscreen = true;
            iframe.title = facade.getAttribute("aria-label") || "Vídeo do documentário";
            card.insertBefore(iframe, card.querySelector(".video-titulo"));
        });
    });

    // Facade do podcast: mostra a capa; ao clicar, carrega o player do Spotify
    document.querySelectorAll(".podcast-facade").forEach(facade => {
        facade.addEventListener("click", () => {
            const id = facade.dataset.episodeid;
            if (!id) return;
            const card = facade.closest(".podcast-card");
            if (!card) return;
            card.classList.add("playing");
            facade.style.display = "none"; // oculta a capa, sem removê-la

            const wrap = document.createElement("div");
            wrap.className = "podcast-embed";
            card.insertBefore(wrap, card.querySelector(".podcast-titulo"));

            const api = window.SpotifyIframeAPI;
            if (api) {
                // iFrame API: carrega e já toca (1 clique)
                const target = document.createElement("div");
                wrap.appendChild(target);
                api.createController(target, {
                    uri: "spotify:episode:" + id,
                    width: "100%",
                    height: "152"
                }, (controller) => {
                    controller.play();
                });
            } else {
                // Fallback: embed padrão (caso a API ainda não tenha carregado)
                const iframe = document.createElement("iframe");
                iframe.src = "https://open.spotify.com/embed/episode/" + id + "?utm_source=generator";
                iframe.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
                iframe.loading = "lazy";
                iframe.title = facade.getAttribute("aria-label") || "Episódio do podcast";
                wrap.appendChild(iframe);
            }
        });
    });
});
