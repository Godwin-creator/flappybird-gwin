//Contexte graphique
const cvs = document.getElementById("zone_de_dessin");
cvs.width = 300;
cvs.height = 400;
cvs.style.cursor = "pointer";
const ctx = cvs.getContext("2d");


//Images
const imageArrierePlan = new Image();
imageArrierePlan.src = "images/arrierePlan.png";

const imageAvantPlan = new Image();
imageAvantPlan.src = "images/avantPlan.png";

const imageOiseau1 = new Image();
imageOiseau1.src = "images/oiseau1.png";

const imageOiseau2 = new Image();
imageOiseau2.src = "images/oiseau2.png";

const imageTuyauBas = new Image();
imageTuyauBas.src = "images/tuyauBas.png";

const imageTuyauHaut = new Image();
imageTuyauHaut.src = "images/tuyauHaut.png";


//Paramètres des tuyaux
const largeurTuyau = 40;
const ecartTuyau = 80;
let xTuyau = 200;
let yTuyauBas = cvs.height - 150;

//Dessin
function dessine(){
    ctx.drawImage(imageArrierePlan, 0, 0);
    ctx.drawImage(imageTuyauBas, xTuyau, yTuyauBas);
    ctx.drawImage(imageTuyauHaut, xTuyau, yTuyauBas - ecartTuyau - imageTuyauBas.height);
    ctx.drawImage(imageAvantPlan, 0, cvs.height - imageAvantPlan.height);
    ctx.drawImage(imageOiseau1, 100, 150);
    ctx.lineWidth = 3;
    ctx.strokeRect(0, 0, cvs.width, cvs.height);
    //la ligne suivante permet de répéter la fonction plusieurs fois dans une seconde.
    requestAnimationFrame(dessine);
}
dessine();