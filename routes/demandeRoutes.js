// backend/routes/demandeRoutes.js
import express from "express";
import { demanderAccesClasse} from "../controller/eleveController.js";
import { getDemandesAcces, repondreDemandeAcces } from "../controller/profController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { verifierAccesEleve } from "../controller/eleveController.js";
import { getDemandesByEleve } from "../controller/demandecontroller.js";


const router = express.Router();

// Élève envoie une demande
router.post("/demande", demanderAccesClasse);
router.get("/eleve/:eleveId", verifierAccesEleve);

// Prof consulte et répond
router.get("/demandes", protect, getDemandesAcces);
router.put("/demande/:demandeId", protect, repondreDemandeAcces);
// ✅ Vérifier si l'élève est autorisé à accéder à la classe

// 🔹 Récupérer toutes les demandes d’un élève
router.get("/all/:eleveId", getDemandesByEleve);



export default router;
