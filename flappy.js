// === Initialisation du canvas ===
const cvs = document.getElementById("zone_de_dessin");
cvs.width = 300;
cvs.height = 400;
cvs.style.cursor = "pointer";
const ctx = cvs.getContext("2d");

// === Images ===
const imageArrierePlan = new Image(); imageArrierePlan.src = "images/arrierePlan.png";
const imageAvantPlan = new Image(); imageAvantPlan.src = "images/avantPlan.png";
const imageOiseau1 = new Image(); imageOiseau1.src = "images/oiseau1.png";
const imageOiseau2 = new Image(); imageOiseau2.src = "images/oiseau2.png";
const imageTuyauBas = new Image(); imageTuyauBas.src = "images/tuyauBas.png";
const imageTuyauHaut = new Image(); imageTuyauHaut.src = "images/tuyauHaut.png";

// === Sons ===
const sonVole = new Audio("sons/sonVole.mp3");
const sonScore = new Audio("sons/sonScore.mp3");
const sonChoc = new Audio("sons/sonChoc.mp3");

// === Paramètres du jeu ===
const largeurTuyau = 40;
const ecartTuyaux = 80;
const largeurOiseau = 34;
const hauteurOiseau = 24;
const gravite = 0.5;

let xoiseau = 100;
let yoiseau = 150;
let oiseauMonte = 0;

let tabTuyaux = [{ x: cvs.width, y: cvs.height - 150 }];
let score = 0;
let record = localStorage.getItem("record") || 0;
let finDuJeu = false;
let frame = 0;

// === Événements ===
document.addEventListener("click", () => {
    if (!finDuJeu) {
        oiseauMonte = 10;
        yoiseau -= 25;
        sonVole.play();
    } else {
        setTimeout(replay, 500);
    }
});

function replay() {
    location.reload(); // recharge la page
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}

function startGame() {
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("zone_de_dessin").style.display = "block";
    dessine();
}

// === Boucle principale ===
function dessine() {
    ctx.drawImage(imageArrierePlan, 0, 0);

    // Gestion des tuyaux
    for (let i = 0; i < tabTuyaux.length; i++) {
        tabTuyaux[i].x--;

        ctx.drawImage(imageTuyauBas, tabTuyaux[i].x, tabTuyaux[i].y);
        ctx.drawImage(
            imageTuyauHaut,
            tabTuyaux[i].x,
            tabTuyaux[i].y - ecartTuyaux - imageTuyauHaut.height
        );

        if (tabTuyaux[i].x === 100) {
            tabTuyaux.push({
                x: cvs.width,
                y: Math.floor(100 + Math.random() * 180),
            });
        } else if (tabTuyaux[i].x + largeurTuyau < 0) {
            tabTuyaux.splice(i, 1);
        }

        // Collision
        const toucheTuyau =
            xoiseau + largeurOiseau >= tabTuyaux[i].x &&
            xoiseau <= tabTuyaux[i].x + largeurTuyau &&
            (yoiseau + hauteurOiseau >= tabTuyaux[i].y ||
                yoiseau + ecartTuyaux <= tabTuyaux[i].y);
        const horsEcran = yoiseau < 0 || yoiseau + hauteurOiseau > 300;

        if (toucheTuyau || horsEcran) {
            sonChoc.play();
            finDuJeu = true;
        }

        // Score
        if (xoiseau === tabTuyaux[i].x + largeurTuyau + 5) {
            score++;
            if (score > record) {
                record = score;
                localStorage.setItem("record", record);
            }
            sonScore.play();
        }
    }

    // Avant-plan
    ctx.drawImage(imageAvantPlan, 0, cvs.height - imageAvantPlan.height);

    // Mouvement de l'oiseau
    yoiseau += gravite;
    frame++;

    const imageOiseauActuel = frame % 20 < 10 ? imageOiseau1 : imageOiseau2;
    ctx.drawImage(imageOiseauActuel, xoiseau, yoiseau);

    // Cadre du jeu
    ctx.lineWidth = 3;
    ctx.strokeRect(0, 0, cvs.width, cvs.height);

    // Scores
    ctx.fillStyle = "green";
    ctx.font = "18px Verdana";
    ctx.fillText("Score : " + score, 10, cvs.height - 40);
    ctx.fillText("Record : " + record, 10, cvs.height - 15);

    // Fin de jeu
    if (!finDuJeu) {
        requestAnimationFrame(dessine);
    } else {
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, cvs.width, cvs.height);
        ctx.fillStyle = "white";
        ctx.font = "30px Verdana";
        ctx.fillText("GAME OVER", 60, 180);
        ctx.font = "18px Verdana";
        ctx.fillText("Score : " + score, 100, 210);
        ctx.fillText("Record : " + record, 95, 240);
        ctx.fillText("Clique pour rejouer", 70, 270);
    }
}
