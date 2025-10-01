# 📋 Instructions pour déployer le Google Apps Script

## 🚀 Étapes à suivre :

### 1. Créer un nouveau Google Apps Script
1. Allez sur [script.google.com](https://script.google.com)
2. Cliquez sur "Nouveau projet"
3. Donnez-lui un nom : "GuidIA API"

### 2. Coller le code
1. Supprimez le code par défaut dans `Code.gs`
2. Copiez-collez tout le contenu du fichier `Code.gs` fourni
3. Sauvegardez (Ctrl+S)

### 3. Tester le script
1. Sélectionnez la fonction `testGetData` dans le menu déroulant
2. Cliquez sur "Exécuter" (▶️)
3. **Première fois :** Autorisez l'accès aux Google Sheets
4. Vérifiez dans les logs que les données sont bien récupérées

### 4. Déployer comme application web
1. Cliquez sur "Déployer" → "Nouveau déploiement"
2. **Type :** Sélectionnez "Application Web"
3. **Description :** "API GuidIA pour extension Chrome"
4. **Exécuter en tant que :** "Moi"
5. **Qui a accès :** "Tout le monde" 
6. Cliquez sur "Déployer"

### 5. Récupérer l'URL de déploiement
1. Copiez l'**URL de l'application web** fournie
2. Elle ressemble à : `https://script.google.com/macros/s/VOTRE_ID/exec`
3. **IMPORTANT :** Gardez cette URL, elle sera nécessaire pour l'extension

### 6. Tester l'API
Ouvrez l'URL dans un navigateur, vous devriez voir les données JSON :
```json
[
  {
    "matiere": "Français",
    "competence": "Résumer un texte",
    "pratiques_autorisees": "Lui demander une démarche type...",
    "pratiques_interdites": "Lui donner le texte et demander..."
  }
]
```

## 🔧 Permissions nécessaires

Le script aura besoin de l'autorisation pour :
- ✅ Lire vos Google Sheets
- ✅ Servir du contenu web

## 🚨 Troubleshooting

**Erreur d'autorisation :**
1. Vérifiez que vous êtes connecté avec le bon compte Google
2. Relancez l'autorisation : "Exécuter" → Autoriser

**Pas de données :**
1. Vérifiez l'ID du Sheets dans le code
2. Vérifiez que le Sheets contient des données
3. Testez avec `testGetData()`

**Erreur 404 sur l'URL :**
1. Vérifiez que le déploiement est bien actif
2. Utilisez la bonne URL (celle avec `/exec` à la fin)

## 📝 Une fois déployé

Donnez-moi l'URL de votre API et je mettrai à jour l'extension pour utiliser votre nouveau Google Apps Script !
