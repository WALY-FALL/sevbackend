/*import Demande from "../models/DemandeAccesmodel.js";

// ✅ 1. Créer une nouvelle demande
export const creerDemande = async (req, res) => {
  try {
    const { eleveId, profId, classeId } = req.body;

    if (!eleveId || !profId || !classeId) {
      return res.status(400).json({ success: false, message: "Champs manquants" });
    }

    // Vérifier si une demande existe déjà pour ce couple (élève + prof + classe)
    const dejaExistante = await Demande.findOne({ eleveId, profId, classeId });
    if (dejaExistante) {
      return res.status(400).json({ success: false, message: "Demande déjà envoyée." });
    }

    const demande = new Demande({
      eleveId,
      profId,
      classeId,
      statut: "en_attente",
      dateDemande: new Date(),
    });

    await demande.save();
    res.status(201).json({
      success: true,
      message: "Demande envoyée au professeur.",
      demande,
    });
  } catch (err) {
    console.error("Erreur création demande :", err);
    res.status(500).json({ success: false, message: "Erreur serveur." });
  }
};

// ✅ 2. Vérifier la demande entre un élève et un prof
export const verifierDemandeEleveProf = async (req, res) => {
  try {
    const { eleveId, profId } = req.params;
    const demande = await Demande.findOne({ eleveId, profId });

    if (!demande) {
      return res.json({ exists: false });
    }

    res.json({
      exists: true,
      statut: demande.statut,
      classeId: demande.classeId,
    });
  } catch (err) {
    console.error("Erreur vérification demande :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ✅ 3. Récupérer les demandes d’un prof
export const listerDemandesProf = async (req, res) => {
  try {
    const { profId } = req.params;
    const demandes = await Demande.find({ profId })
      .populate("eleveId", "nom prenom email")
      .populate("classeId", "nom niveau serie");

    res.json(demandes);
  } catch (err) {
    console.error("Erreur récupération demandes prof :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ✅ 4. Accepter une demande
export const accepterDemande = async (req, res) => {
  try {
    const { id } = req.params;
    const demande = await Demande.findByIdAndUpdate(id, { statut: "accepte" }, { new: true });
    res.json({ success: true, message: "Demande acceptée.", demande });
  } catch (err) {
    console.error("Erreur acceptation demande :", err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

// ✅ 5. Refuser une demande
export const refuserDemande = async (req, res) => {
  try {
    const { id } = req.params;
    const demande = await Demande.findByIdAndUpdate(id, { statut: "refuse" }, { new: true });
    res.json({ success: true, message: "Demande refusée.", demande });
  } catch (err) {
    console.error("Erreur refus demande :", err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};*/
