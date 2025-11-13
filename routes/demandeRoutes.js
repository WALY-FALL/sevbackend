// backend/routes/demandeRoutes.js
import express from "express";
import { demanderAccesClasse } from "../controller/eleveController.js";
import { getDemandesAcces, repondreDemandeAcces } from "../controller/profController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { verifierAccesEleve } from "../controller/eleveController.js";
/*import {
    creerDemande,
    verifierDemandeEleveProf,
    listerDemandesProf,
    accepterDemande,
    refuserDemande
  } from "../controller/demandecontroller.js";*/
  


// routes/demandeRoutes.js
//const express = require("express");
/*const router = express.Router();
//const demandeCtrl = require("../controller/demandecontroller");

// Créer une demande
router.post("/demande", creerDemande);

// Vérifier demande pour élève + prof
router.get("/eleve/:eleveId/prof/:profId", verifierDemandeEleveProf);

// Lister les demandes d’un prof
router.get("/prof/:profId", listerDemandesProf);

// Accepter / Refuser une demande
router.put("/accepter/:id", accepterDemande);
router.put("/refuser/:id", refuserDemande);

export default router;*/
//module.exports = router;


const router = express.Router();

// Élève envoie une demande
router.post("/demande", demanderAccesClasse);
router.get("/eleve/:eleveId", verifierAccesEleve);

// Prof consulte et répond
router.get("/demandes", protect, getDemandesAcces);
router.put("/demande/:demandeId", protect, repondreDemandeAcces);
// ✅ Vérifier si l'élève est autorisé à accéder à la classe


export default router;
