import Eleve from "../models/elevemodel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import DemandeAcces from "../models/DemandeAccesmodel.js";

// Générer un token JWT
const generateToken = (eleveId) => {
  return jwt.sign({ eleveId }, process.env.JWT_SECRET, { expiresIn: "24h" });
};


// ✅ INSCRIPTION
export const signupEleve = async (req, res) => {
  try {
    const { nom, prenom, email, password } = req.body;

    if (!nom || !prenom || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Tous les champs sont requis",
      });
    }

    // Vérifier si l'email existe déjà
    const existingEleve = await Eleve.findOne({ email });
    if (existingEleve) {
      return res.status(400).json({
        success: false,
        message: "Email déjà utilisé",
      });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'élève
    const newEleve = await Eleve.create({
      nom,
      prenom,
      email,
      password: hashedPassword,
    });

    // Générer le token JWT
    const token = jwt.sign(
      { id: newEleve._id, email: newEleve.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Retourner les données
    res.status(201).json({
      success: true,
      token,
      eleve: newEleve,
    });
  } catch (error) {
    console.error("Erreur signupEleve:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de l'inscription",
      error: error.message,
    });
  }
};

// ✅ CONNEXION
export const loginEleve = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("📩 Tentative de connexion de :", email);

    // 🔍 On récupère l'élève et on "populate" le prof
    const eleve = await Eleve.findOne({ email }).populate("profId");

    if (!eleve) {
      console.log("❌ Élève non trouvé");
      return res.status(404).json({ success: false, message: "Élève non trouvé" });
    }

    const isMatch = await bcrypt.compare(password, eleve.password);
    if (!isMatch) {
      console.log("❌ Mot de passe incorrect");
      return res.status(400).json({ success: false, message: "Mot de passe incorrect" });
    }

    const token = jwt.sign({ id: eleve._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    console.log("✅ Élève connecté :", eleve.email, "Prof :", eleve.profId);

    res.status(200).json({
      success: true,
      message: "Connexion réussie",
      token,
      eleve: {
        _id: eleve._id,
        nom: eleve.nom,
        prenom: eleve.prenom,
        email: eleve.email,
        profId: eleve.profId?._id || eleve.profId, // ✅ envoie bien l'id du prof
      },
    });
  } catch (error) {
    console.error("Erreur login élève:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

// ➕ Ajouter un élève
export const addEleve = async (req, res) => {
  try {
    const { nom, prenom, email, profId } = req.body;

  if (!nom || !prenom || !email || !profId) {

      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    const newEleve = new Eleve({
      nom,
      prenom,
      email,
      profId,
      
    });

    await newEleve.save();

    res.status(201).json(newEleve);
  } catch (error) {
    console.error("❌ Erreur lors de l’ajout d’un élève :", error);
    res.status(500).json({ message: "Erreur serveur lors de l’ajout" });
  }
};

// 📋 Récupérer tous les élèves d’un prof
export const getElevesByProf = async (req, res) => {
  try {
    const { profId } = req.params;
    const eleves = await Eleve.find({ profId });

    res.status(200).json(eleves);
  } catch (error) {
    console.error("❌ Erreur lors du chargement des élèves :", error);
    res.status(500).json({ message: "Erreur serveur lors du chargement" });
  }
};

export const demanderAccesClasse = async (req, res) => {
  try {
    const { eleveId, profId, classeId } = req.body;

    console.log("📥 Données reçues:", { eleveId, profId, classeId });

    // Vérification des champs obligatoires
    if (!eleveId || !profId || !classeId) {
      return res.status(400).json({ success: false, message: "Champs manquants." });
    }

    // Vérifie si une demande existe déjà pour ce couple élève + prof + classe
    const existe = await DemandeAcces.findOne({ eleveId, profId, classeId });
    if (existe) {
      return res.status(400).json({ success: false, message: "Demande déjà envoyée pour cette classe." });
    }

    // Crée la demande
    const demande = await DemandeAcces.create({
      eleveId,
      profId,
      classeId,
      statut: "en_attente",
      dateDemande: new Date(),
    });

    res.status(201).json({ success: true, message: "Demande envoyée au professeur.", demande });
  } catch (error) {
    console.error("Erreur lors de la création de la demande :", error);
    res.status(500).json({ success: false, message: "Erreur serveur." });
  }
};

/*export const demanderAccesClasse = async (req, res) => {
  try {
    console.log("📥 Données reçues:", req.body); 
    const { eleveId, profId, classeId } = req.body;

    // Vérifie si une demande existe déjà
    const existe = await DemandeAcces.findOne({ eleveId, classeId });
    if (existe) {
      return res.status(400).json({ success: false, message: "Demande déjà envoyée." });
    }

    const demande = await DemandeAcces.create({
      eleveId,
      profId,
      classeId,
      statut: "en_attente", // 👈 AJOUT ICI
    });

    res.status(201).json({ success: true, message: "Demande envoyée au professeur.", demande });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Erreur lors de la création de la demande." });
  }
};*/


export const verifierAccesEleve = async (req, res) => {
  try {
    const { eleveId } = req.params;

    const demande = await DemandeAcces.findOne({ eleveId })
      .sort({ dateDemande: -1 }) // prend la plus récente
      .populate("classeId", "niveau serie");

    if (!demande) {
      return res.status(200).json({ statut: "aucune_demande" });
    }

    return res.status(200).json({
      statut: demande.statut,
      classeId: demande.classeId?._id || null,
    });
  } catch (err) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
};


