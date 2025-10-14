/**
 * Google Apps Script pour servir les données du Google Sheets GuidIA
 * Ce script lit les données du Sheets et les retourne en JSON avec les en-têtes CORS appropriés
 */

// ID de votre Google Sheets
const SHEET_ID = '1-SpJeAp64jBtofyycA6bUMllP5N9cQI1xyFiV-hATy4';

/**
 * Fonction principale qui gère les requêtes GET
 */
function doGet(e) {
  try {
    // Récupérer les données du Sheets
    const data = getData();
    
    // Créer la réponse JSON
    return ContentService
      .createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    console.error('Erreur dans doGet:', error);
    
    // Retourner une erreur en JSON
    return ContentService
      .createTextOutput(JSON.stringify({
        error: 'Erreur lors de la récupération des données: ' + error.message
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Fonction pour récupérer les données du Google Sheets
 */
function getData() {
  try {
    // Ouvrir le Sheets par son ID
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    
    // Récupérer toutes les données (à partir de la ligne 2 pour ignorer les en-têtes)
    const range = sheet.getDataRange();
    const values = range.getValues();
    
    // Ignorer la première ligne (en-têtes)
    const dataRows = values.slice(1);
    
    // Convertir en format JSON structuré
    const data = [];
    
    dataRows.forEach(row => {
      // Vérifier que la ligne n'est pas vide (au moins matière et compétence)
      if (row[0] && row[1]) {
        data.push({
          matiere: row[0] ? row[0].toString().trim() : '',
          competence: row[1] ? row[1].toString().trim() : '',
          pratiques_autorisees: row[2] ? row[2].toString().trim() : '',
          pratiques_interdites: row[3] ? row[3].toString().trim() : ''
        });
      }
    });
    
    console.log(`Données récupérées: ${data.length} lignes`);
    return data;
    
  } catch (error) {
    console.error('Erreur dans getData:', error);
    throw new Error('Impossible de lire les données du Sheets: ' + error.message);
  }
}

/**
 * Fonction de test pour vérifier que le script fonctionne
 */
function testGetData() {
  try {
    const data = getData();
    console.log('Test réussi, données récupérées:', data.length, 'lignes');
    console.log('Exemple de première ligne:', data[0]);
    return data;
  } catch (error) {
    console.error('Test échoué:', error);
    return null;
  }
}

/**
 * Gestion des requêtes OPTIONS pour CORS
 */
function doOptions(e) {
  return ContentService.createTextOutput('');
}
