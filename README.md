# 🤖 GuidIA - Extension Chrome

## 📖 Description

**GuidIA** est maintenant une extension Chrome qui fournit un accès rapide et pratique au guide officiel des pratiques de l'Intelligence Artificielle de la Fédération Wallonie-Bruxelles directement depuis votre navigateur.

## ✨ Fonctionnalités

### 🔄 Popup d'activation
- Interface élégante pour activer/désactiver l'extension
- Bouton rapide pour ouvrir directement le guide
- Sauvegarde automatique des préférences

### 📋 Panneau latéral
- **En-tête fixe** avec navigation par onglets
- **Onglet "Charte IA"** : Guide complet des pratiques par matière
- **Onglet "Référencement"** : (À développer)
- **Onglet "Code d'usage"** : (À développer)

### 🎯 Navigation intuitive
- Sélection par matière dans un menu déroulant
- Affichage structuré par compétences
- Distinction visuelle entre pratiques autorisées et interdites

## 🚀 Installation

### Méthode 1 : Installation en mode développeur

1. **Télécharger le projet**
   ```bash
   git clone [URL_DU_REPOSITORY]
   cd GuidIA
   ```

2. **Ouvrir Chrome et aller aux extensions**
   - Tapez `chrome://extensions/` dans la barre d'adresse
   - Activez le "Mode développeur" (en haut à droite)

3. **Charger l'extension**
   - Cliquez sur "Charger l'extension non empaquetée"
   - Sélectionnez le dossier `GuidIA`
   - L'extension apparaît dans la liste

4. **Épingler l'extension** (optionnel)
   - Cliquez sur l'icône puzzle dans la barre d'outils
   - Épinglez GuidIA pour un accès rapide

### Méthode 2 : Package .crx (à venir)

## 🎮 Utilisation

### Activation de l'extension
1. Cliquez sur l'icône GuidIA dans la barre d'outils
2. Dans le popup, activez le toggle ou cliquez sur "Ouvrir le Guide"
3. Le panneau latéral s'ouvre automatiquement

### Navigation dans le guide
1. **Onglet "Charte IA"** : Sélectionnez une matière dans le menu déroulant
2. Consultez les compétences et pratiques associées
3. Naviguez entre les onglets selon vos besoins

### Gestion de l'affichage
- Le panneau latéral reste ouvert pendant votre navigation
- Pour le fermer, utilisez le bouton de fermeture du panneau
- L'état d'activation est sauvegardé automatiquement

## 🏗️ Structure de l'extension

```
GuidIA/
├── manifest.json           # Configuration de l'extension
├── background.js           # Service Worker
├── popup/
│   ├── popup.html         # Interface du popup
│   └── popup.js           # Logique du popup
├── sidepanel/
│   ├── sidepanel.html     # Interface du panneau latéral
│   └── sidepanel.js       # Logique du panneau latéral
├── icons/
│   └── [icônes PNG]       # Icônes de l'extension
└── README_EXTENSION.md    # Cette documentation
```

## ⚙️ Configuration

### Permissions requises
- `sidePanel` : Affichage du panneau latéral
- `storage` : Sauvegarde des préférences
- `activeTab` : Interaction avec l'onglet actif

### Source de données
L'extension se connecte à l'API Google Apps Script existante :
- **URL** : `https://script.google.com/macros/s/[ID]/exec`
- **Endpoint** : `?action=getData`

## 🔧 Développement

### Modification du code
1. Éditez les fichiers dans les dossiers `popup/` ou `sidepanel/`
2. Rechargez l'extension dans `chrome://extensions/`
3. Testez les modifications

### Ajout de nouvelles fonctionnalités
- **Onglet "Référencement"** : Modifier `sidepanel/sidepanel.html` et `sidepanel/sidepanel.js`
- **Onglet "Code d'usage"** : Même principe
- **Nouvelles permissions** : Mettre à jour `manifest.json`

## 🎨 Personnalisation

### Thème et couleurs
- Modifier les styles CSS dans les fichiers HTML
- Gradient principal : `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- Utilise Tailwind CSS pour la mise en forme

### Icônes
- Remplacer les fichiers PNG dans le dossier `icons/`
- Tailles requises : 16x16, 32x32, 48x48, 128x128 pixels

## 🐛 Débogage

### Console de développement
1. Ouvrir `chrome://extensions/`
2. Cliquer sur "Inspecter les vues" > "Service Worker" pour le background
3. Clic droit sur le popup > "Inspecter" pour le popup
4. Ouvrir les DevTools du panneau latéral directement

### Problèmes courants
- **Panneau ne s'ouvre pas** : Vérifier les permissions dans le manifest
- **Données non chargées** : Vérifier l'URL de l'API Google Apps Script
- **Styles cassés** : Vérifier la connexion à Tailwind CSS

## 🔄 Mises à jour

### Version actuelle : 2.0.0
- Transformation en extension Chrome
- Interface popup moderne
- Panneau latéral avec onglets
- Adaptation du code GuidIA original

### Prochaines versions
- Onglets "Référencement" et "Code d'usage"
- Mode hors ligne
- Personnalisation des thèmes
- Notifications

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

---

**Développé pour la Fédération Wallonie-Bruxelles** 🇧🇪  
*Extension Chrome - Guide des bonnes pratiques de l'Intelligence Artificielle dans l'éducation*
