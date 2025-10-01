# GuidIA - Guide des Pratiques de l'IA pour la FWB

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Platform](https://img.shields.io/badge/platform-Google%20Apps%20Script-green.svg)
![License](https://img.shields.io/badge/license-MIT-yellow.svg)

## 📖 Description

**GuidIA** est une application web développée avec Google Apps Script qui présente le guide officiel des pratiques autorisées et interdites de l'Intelligence Artificielle dans le contexte éducatif de la Fédération Wallonie-Bruxelles (FWB).

L'application récupère automatiquement les données depuis un Google Sheets et les présente dans une interface web moderne et responsive, permettant aux enseignants et au personnel éducatif de consulter facilement les bonnes pratiques par matière et compétence.

## ✨ Fonctionnalités

- **Interface moderne** : Design responsive avec Tailwind CSS
- **Navigation par matière** : Sélection intuitive par menu déroulant
- **Organisation par compétences** : Affichage structuré des pratiques autorisées et interdites
- **Données en temps réel** : Synchronisation automatique avec le Google Sheets source
- **Gestion d'erreurs** : Système de debug et gestion des erreurs robuste
- **Compatibilité CORS** : Support des requêtes cross-origin

## 🏗️ Architecture

### Structure du projet

```
GuidIA/
├── Code.gs          # Script Google Apps Script (backend)
├── index.html       # Interface utilisateur (frontend)
└── README.md        # Documentation du projet
```

### Composants principaux

1. **Code.gs** - Backend Google Apps Script
   - `doGet()` : Point d'entrée principal, sert l'interface HTML
   - `getData()` : API REST pour récupérer les données du Google Sheets
   - `getDataForWeb()` : Fonction optimisée pour l'appel depuis l'interface web
   - `doOptions()` : Gestion des requêtes CORS preflight

2. **index.html** - Frontend moderne
   - Interface responsive avec Tailwind CSS
   - JavaScript vanilla pour l'interactivité
   - Système de debug intégré
   - Gestion d'erreurs conviviale

## 📊 Source de données

L'application se connecte au Google Sheets officiel : 
- **URL** : [GUIDIA - Pratiques de l'IA autorisées et interdites](https://docs.google.com/spreadsheets/d/1zzMwMMsgRnHgyfih1rnBpS2soan38kFd6c5FYwl2VEk/edit?usp=sharing)
- **Structure** : 4 colonnes principales
  - Matières
  - Compétences
  - Pratiques autorisées
  - Pratiques interdites

## 🚀 Installation et Configuration

### Prérequis

- Compte Google avec accès à Google Apps Script
- Accès en lecture au Google Sheets source
- Navigateur web moderne

### Étapes d'installation

1. **Créer un nouveau projet Google Apps Script**
   ```
   1. Aller sur script.google.com
   2. Créer un nouveau projet
   3. Nommer le projet "GuidIA"
   ```

2. **Copier les fichiers**
   ```
   1. Copier le contenu de Code.gs dans le fichier Code.gs
   2. Créer un fichier HTML nommé "index" et copier le contenu de index.html
   ```

3. **Configurer l'ID du Google Sheets**
   ```javascript
   // Dans Code.gs, ligne 18 et 117, mettre l'ID correct du Google Sheets
   const SHEET_ID = 'VOTRE_SHEET_ID_ICI';
   ```

4. **Déployer l'application**
   ```
   1. Cliquer sur "Déployer" > "Nouveau déploiement"
   2. Choisir "Application Web"
   3. Définir l'accès : "Tous"
   4. Copier l'URL de déploiement
   ```

5. **Mettre à jour l'URL dans le frontend**
   ```javascript
   // Dans index.html, ligne 63, remplacer par votre URL de déploiement
   const BASE_URL = 'VOTRE_URL_DE_DEPLOIEMENT';
   ```

## 🔧 Configuration

### Variables à personnaliser

**Dans Code.gs :**
- `SHEET_ID` (lignes 18 et 117) : ID du Google Sheets source
- `SHEET_NAME` (lignes 19 et 118) : Nom de l'onglet à utiliser

**Dans index.html :**
- `BASE_URL` (ligne 63) : URL de déploiement de votre Google Apps Script

### Permissions requises

L'application nécessite les permissions suivantes :
- Lecture des Google Sheets
- Création de contenu web HTML
- Gestion des requêtes HTTP

## 🎯 Utilisation

1. **Accéder à l'application** via l'URL de déploiement
2. **Sélectionner une matière** dans le menu déroulant
3. **Consulter les compétences** et pratiques associées
4. **Naviguer** entre les différentes matières selon vos besoins

### Matières disponibles

- Français
- Mathématiques
- Histoire
- Langues modernes
- *(Et autres selon le contenu du Google Sheets)*

## 🔍 Fonctionnalités techniques

### Gestion des données

- **Normalisation automatique** des clés JSON (suppression des accents, espaces)
- **Filtrage intelligent** des lignes vides
- **Transformation dynamique** des données en objets structurés

### Interface utilisateur

- **Design responsive** adapté mobile et desktop
- **Indicateurs visuels** pour pratiques autorisées (vert) et interdites (rouge)
- **Messages d'état** (chargement, erreurs, debug)

### Sécurité

- **En-têtes CORS** configurés pour l'accès cross-origin
- **Gestion d'erreurs** robuste côté serveur et client
- **Validation des données** avant affichage

## 🐛 Débogage

L'application inclut un système de debug intégré :

- **Mode debug** activable dans l'interface
- **Logs détaillés** des opérations
- **Messages d'erreur** explicites
- **Informations de connexion** au Google Sheets

Pour activer le debug, la section sera automatiquement affichée en cas de problème.

## 🤝 Contribution

Ce projet est développé pour la Fédération Wallonie-Bruxelles. Pour contribuer :

1. Forker le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Soumettre une pull request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

## 🆘 Support

Pour toute question ou problème :

1. Vérifier la configuration des ID de Google Sheets
2. Contrôler les permissions d'accès
3. Consulter les logs de debug dans l'interface
4. Vérifier l'URL de déploiement

## 🔄 Mises à jour

Les données sont automatiquement synchronisées avec le Google Sheets source. Aucune action manuelle n'est requise pour mettre à jour le contenu.

---

**Développé pour la Fédération Wallonie-Bruxelles** 🇧🇪
*Guide des bonnes pratiques de l'Intelligence Artificielle dans l'éducation*
