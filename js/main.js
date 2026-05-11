// main.js - Lógica base
console.log("Arquivo 180 - Inicializado");

document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".container");
    const pastaMae = document.querySelector(".pasta-mae");
    const pastasSecundarias = document.querySelectorAll(".pasta-secundaria");
    
    // Lógica da transição principal (Pasta Mãe)
    if (pastaMae) {
        pastaMae.addEventListener("click", () => {
            container.classList.toggle("aberto");
            console.log("Estado do Arquivo 180: " + (container.classList.contains("aberto") ? "Aberto" : "Fechado"));
        });
    }

    // Lógica das pastas secundárias
    const pastaSobre = document.getElementById("pasta-sobre");
    
    if (pastaSobre) {
        pastaSobre.addEventListener("click", (e) => {
            e.stopPropagation(); // Evita conflito
            
            // Se já estiver aberto o "Sobre", fecha. Se não, abre.
            if (container.classList.contains("sobre-aberto")) {
                container.classList.remove("sobre-aberto");
            } else {
                container.classList.add("sobre-aberto");
            }
            console.log("Estado 'Sobre': " + (container.classList.contains("sobre-aberto") ? "Aberto" : "Fechado"));
        });
    }

    const pastaIntegrantes = document.getElementById("pasta-integrantes");
    
    if (pastaIntegrantes) {
        pastaIntegrantes.addEventListener("click", (e) => {
            e.stopPropagation(); // Evita conflito
            
            // Se já estiver aberto o "Integrantes", fecha. Se não, abre.
            if (container.classList.contains("integrantes-aberto")) {
                container.classList.remove("integrantes-aberto");
            } else {
                container.classList.add("integrantes-aberto");
            }
            console.log("Estado 'Integrantes': " + (container.classList.contains("integrantes-aberto") ? "Aberto" : "Fechado"));
        });
    }

    pastasSecundarias.forEach(pasta => {
        if (pasta.id !== "pasta-sobre" && pasta.id !== "pasta-integrantes") {
            pasta.addEventListener("click", (e) => {
                e.stopPropagation(); 
                console.log(`Clicou na pasta secundária: ${pasta.id}`);
                // Futura lógica para Material
            });
        }
    });
});
