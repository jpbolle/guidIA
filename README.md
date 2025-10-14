# 🤖 GuidIA - Extension Chrome

## 📖 Description

**GuidIA** est une extension Chrome complète développée pour le **Collège Notre-Dame de Dinant** qui fournit un accès rapide aux pratiques de l'Intelligence Artificielle dans l'éducation, un générateur de références bibliographiques APA et un guide des codes d'usage de l'IA.

## ✨ Fonctionnalités

### 🔄 Popup d'activation
- Interface élégante pour activer/désactiver l'extension
- Bouton rapide pour ouvrir directement le guide
- Sauvegarde automatique des préférences

### 📋 Panneau latéral avec 3 onglets

#### 1️⃣ **Pratiques IA**
- **Citation mise en avant** : Principe général affiché en vert et gras
- Sélection par matière dans un menu déroulant
- Affichage des **usages transversaux** (Formulation, Compréhension, S'exercer)
- Affichage structuré par **compétences** pour chaque matière
- Distinction visuelle entre **pratiques autorisées** (vert ✓) et **interdites** (rouge ✗)
- Données synchronisées en temps réel depuis Google Sheets
- Rafraîchissement automatique toutes les 5 minutes

#### 2️⃣ **Code d'usage**
- **Cadrages du professeur** : Explication des 3 icônes (Non recours, Aide, Généré)
- **Tampons de l'IA** : 3 icônes cliquables pour copier dans le presse-papiers
  - 🚫 IA NON UTILISÉE
  - 🤝 IA UTILISÉE COMME AIDE
  - 🤖 GÉNÉRÉ PAR IA
- Feedback visuel lors de la copie

#### 3️⃣ **Le bibliographe** (Générateur de références APA 7e édition)

**Fonctionnalités principales :**
- **Aperçu en temps réel** éditable de la référence
- **5 types de sources** : Livre, Article de journal, Site web, Chapitre de livre, Thèse/Mémoire
- **Champs dynamiques** adaptés au type de source sélectionné
- **Remplissage automatique** pour les sites web :
  - Extraction intelligente des métadonnées de la page active
  - Recherche exhaustive : title, author, year, siteName, URL
  - Compatible avec tous les sites web
- **Gestion de la liste** : 
  - Ajout/suppression instantanés
  - Copie individuelle de chaque référence
  - Icônes d'action visibles au survol
- **Exports multiples** :
  - 📄 **Export Word (.rtf)** : Format RTF professionnel avec indentation suspendue, compatible Word et Google Docs
  - 📊 **Export CSV** : Pour Google Sheets ou Excel, structure en tableau

**Format APA respecté :**
- Police Times New Roman
- Indentation suspendue (hanging indent) de 0.5 pouces
- Double interligne
- Titre centré et en gras

## 🚀 Installation

### Installation en mode développeur

1. **Télécharger le projet**
   ```bash
   git clone [URL_DU_REPOSITORY]
   cd guidIA-main
   ```

2. **Ouvrir Chrome et aller aux extensions**
   - Tapez `chrome://extensions/` dans la barre d'adresse
   - Activez le "Mode développeur" (en haut à droite)

3. **Charger l'extension**
   - Cliquez sur "Charger l'extension non empaquetée"
   - Sélectionnez le dossier `guidIA-main`
   - L'extension apparaît dans la liste

4. **Accepter les permissions**
   - L'extension demandera les permissions nécessaires
   - Acceptez pour activer toutes les fonctionnalités

5. **Épingler l'extension** (optionnel)
   - Cliquez sur l'icône puzzle dans la barre d'outils
   - Épinglez GuidIA pour un accès rapide

## 🎮 Utilisation

### Activation de l'extension
1. Cliquez sur l'icône GuidIA dans la barre d'outils
2. Dans le popup, activez le toggle ou cliquez sur "Ouvrir le Guide"
3. Le panneau latéral s'ouvre automatiquement

### Navigation dans les onglets

#### 📋 Onglet "Pratiques IA"
1. Lisez le principe général en vert
2. Sélectionnez une matière dans le menu déroulant
3. Consultez les compétences et pratiques associées
4. Les données se mettent à jour automatiquement depuis Google Sheets

#### ⚖️ Onglet "Code d'usage"
1. Découvrez les cadrages du professeur
2. Cliquez sur un tampon IA pour le copier
3. Collez-le dans votre travail (Ctrl+V ou Cmd+V)

#### 📚 Onglet "Le bibliographe"
1. Sélectionnez le type de source (Site web par défaut)
2. Pour un site web : cliquez sur "🌐 Remplir depuis la page active"
3. Les champs se remplissent automatiquement
4. Modifiez l'aperçu si nécessaire (éditable)
5. Cliquez sur **+** pour ajouter à la liste
6. Répétez pour d'autres références
7. Exportez au format souhaité (Word ou CSV)

## 🏗️ Structure de l'extension

```
guidIA-main/
├── manifest.json              # Configuration de l'extension
├── background.js              # Service Worker
├── popup/
│   ├── popup.html            # Interface du popup
│   └── popup.js              # Logique du popup
├── sidepanel/
│   ├── sidepanel.html        # Interface du panneau latéral
│   ├── sidepanel.js          # Logique complète (1100+ lignes)
│   └── styles.css            # Styles personnalisés
├── google-apps-script/
│   ├── Code.gs               # Script Google Apps Script
│   └── INSTRUCTIONS.md       # Instructions de déploiement
├── icons/                     # Icônes de l'extension (16-128px)
└── README.md                 # Cette documentation
```

## ⚙️ Configuration

### Permissions requises
- `sidePanel` : Affichage du panneau latéral
- `storage` : Sauvegarde des préférences
- `activeTab` : Interaction avec l'onglet actif
- `scripting` : Injection de scripts pour récupérer les métadonnées
- `tabs` : Accès aux informations des onglets
- `<all_urls>` : Accès au contenu de toutes les pages web

### Sources de données
- **Pratiques IA** : Google Sheets via Google Apps Script
  - URL : `https://script.google.com/macros/s/[ID]/exec`
  - Google Sheets ID : `1zzMwMMsgRnHgyfih1rnBpS2soan38kFd6c5FYwl2VEk`
- **Métadonnées web** : Extraction directe depuis les pages visitées

## 🎨 Personnalisation

### Palette de couleurs
- **Vert principal** : `#007c75` (boutons, bordures, textes importants)
- **Orange** : `#f66d00` (en-têtes, onglets actifs, accents)
- **Rouge** : `#dc3545` (suppressions, interdictions)
- Police principale : **Inter** (Google Fonts)
- Police références : **Times New Roman**

### Thème et style
- Design moderne et épuré
- Ombres et transitions fluides
- Icônes emoji pour une meilleure lisibilité
- Scrollbar personnalisée
- Footer fixe avec logo et version

## 🔧 Développement

### Modification du code
1. Éditez les fichiers dans les dossiers `popup/` ou `sidepanel/`
2. Rechargez l'extension dans `chrome://extensions/`
3. Testez les modifications dans la console du panneau latéral

### Débogage
- **Service Worker** : `chrome://extensions/` > "Inspecter les vues" > "Service Worker"
- **Popup** : Clic droit sur le popup > "Inspecter"
- **Panneau latéral** : F12 ou clic droit > "Inspecter"

### Tests des métadonnées
Testez sur différents types de sites :
- Sites d'actualités (articles avec auteurs et dates)
- Sites éducatifs (Alloprof, Wikipedia, etc.)
- Sites académiques (publications scientifiques)

## 📊 Version actuelle : 2.0

### Nouveautés de la version 2.0
✅ Transformation en extension Chrome complète  
✅ 3 onglets fonctionnels et interconnectés  
✅ Générateur de références APA 7e édition  
✅ Remplissage automatique depuis les pages web  
✅ Exports multiples (RTF, CSV)  
✅ Tampons IA copiables  
✅ Synchronisation temps réel avec Google Sheets  
✅ Interface moderne avec palette de couleurs cohérente  
✅ Gestion complète des accents français  

## 🎯 Prochaines étapes (Version 2.1)

### 1. Amélioration des pratiques IA
- [ ] **Menus déroulants** pour les pratiques autorisées et interdites
- [ ] Affichage/masquage pour une meilleure lisibilité
- [ ] Possibilité d'imprimer ou d'exporter les pratiques d'une matière

### 2. Optimisation du Code d'usage
- [ ] **Juxtaposition** des icônes et leurs descriptifs (côte à côte au lieu d'en dessous)
- [ ] Mise en page plus compacte et visuellement attractive
- [ ] Ajout d'exemples d'utilisation

### 3. Générateur de déclaration d'emploi de l'IA (Kherbouche)
- [ ] **Paragraphe type** généré automatiquement
- [ ] Indication du rôle de l'IA dans le travail
- [ ] Degré d'assistance (aide minime, aide substantielle, génération complète)
- [ ] Détail des tâches effectuées par l'IA
- [ ] Format prêt à copier-coller dans un document

### 4. Évolution du Bibliographe
- [ ] **Connexion directe à un Google Sheets** de références
- [ ] Récupération automatique de références prédéfinies
- [ ] **Menu déroulant de thèmes** de recherche
- [ ] Possibilité d'ajouter de nouveaux thèmes
- [ ] Synchronisation bidirectionnelle (lecture et écriture dans Sheets)
- [ ] Partage de bibliographies entre utilisateurs

### 5. Améliorations générales
- [ ] Mode hors ligne (cache local des données)
- [ ] Notifications pour les mises à jour de contenu
- [ ] Options de personnalisation (thème clair/sombre)
- [ ] Raccourcis clavier
- [ ] Export PDF des pratiques IA

## 🤝 Contribution

Ce projet est développé pour le **Collège Notre-Dame de Dinant (CNDD)**.  
Pour toute suggestion ou amélioration, contactez l'équipe pédagogique.

## 📄 Licence

Ce projet est développé pour un usage éducatif au sein du Collège Notre-Dame de Dinant.

---

**Développé pour le Collège Notre-Dame de Dinant** 🇧🇪  
*Extension Chrome - Version 2.0 - 2025*  
*Guide des bonnes pratiques de l'Intelligence Artificielle dans l'éducation*
