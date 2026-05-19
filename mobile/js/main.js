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
    }

    function abrirNivel(estado) {
        pilha.push(estado);
        aplicarEstado();
    }

    function fecharNivel() {
        pilha.pop();
        aplicarEstado();
    }

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
});
