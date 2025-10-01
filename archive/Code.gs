function doGet(e) {
  // Vérification de sécurité pour e et e.parameter
  if (e && e.parameter && e.parameter.action === 'getData') {
    return getData();
  }
  
  // Sinon, servir la page HTML
  const html = HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Guide des Pratiques de l\'IA - FWB')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  
  return html;
}

function getData() {
  try {
    // ID de votre Google Sheet
    const SHEET_ID = '1zzMwMMsgRnHgyfih1rnBpS2soan38kFd6c5FYwl2VEk';
    const SHEET_NAME = 'Feuille 1';
    
    // Ouvrir le sheet
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      throw new Error(`Feuille "${SHEET_NAME}" introuvable`);
    }
    
    // Récupérer toutes les données
    const range = sheet.getDataRange();
    const values = range.getValues();
    
    if (values.length === 0) {
      const output = ContentService
        .createTextOutput(JSON.stringify({ error: 'Aucune donnée trouvée dans le sheet' }))
        .setMimeType(ContentService.MimeType.JSON);
      
      // Ajouter les en-têtes CORS
      output.addHeader('Access-Control-Allow-Origin', '*');
      output.addHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      output.addHeader('Access-Control-Allow-Headers', 'Content-Type');
      
      return output;
    }
    
    // La première ligne contient les en-têtes
    const headers = values[0];
    const dataRows = values.slice(1);
    
    // Transformer les données en objets JSON
    const data = dataRows.map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        let key = header.toLowerCase()
          .replace(/é/g, 'e')
          .replace(/è/g, 'e')
          .replace(/ê/g, 'e')
          .replace(/à/g, 'a')
          .replace(/ç/g, 'c')
          .replace(/[^a-z0-9]/g, '_')
          .replace(/_+/g, '_')
          .replace(/^_|_$/g, '');
        
        if (key === 'matieres' || key === 'matiere') key = 'matiere';
        if (key === 'competences' || key === 'competence') key = 'competence';
        if (key === 'pratiques_autorisees' || key === 'autorisees') key = 'pratiques_autorisees';
        if (key === 'pratiques_interdites' || key === 'interdites') key = 'pratiques_interdites';
        
        obj[key] = typeof row[index] === 'string' ? row[index].trim() : row[index] || '';
      });
      return obj;
    });
    
    // Filtrer les lignes vides
    const filteredData = data.filter(row => row.matiere && row.competence);
    
    const output = ContentService
      .createTextOutput(JSON.stringify(filteredData))
      .setMimeType(ContentService.MimeType.JSON);
    
    // Ajouter les en-têtes CORS
    output.addHeader('Access-Control-Allow-Origin', '*');
    output.addHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    output.addHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    return output;
      
  } catch (error) {
    const output = ContentService
      .createTextOutput(JSON.stringify({ 
        error: 'Erreur serveur: ' + error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
    
    // Ajouter les en-têtes CORS même en cas d'erreur
    output.addHeader('Access-Control-Allow-Origin', '*');
    output.addHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    output.addHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    return output;
  }
}

// Fonction pour gérer les requêtes OPTIONS (préflight CORS)
function doOptions() {
  const output = ContentService.createTextOutput('');
  output.addHeader('Access-Control-Allow-Origin', '*');
  output.addHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  output.addHeader('Access-Control-Allow-Headers', 'Content-Type');
  return output;
}


// Nouvelle fonction pour appel direct depuis le HTML
function getDataForWeb() {
  try {
    // ID de votre Google Sheet
    const SHEET_ID = '1zzMwMMsgRnHgyfih1rnBpS2soan38kFd6c5FYwl2VEk';
    const SHEET_NAME = 'Feuille 1';
    
    // Ouvrir le sheet
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      throw new Error(`Feuille "${SHEET_NAME}" introuvable`);
    }
    
    // Récupérer toutes les données
    const range = sheet.getDataRange();
    const values = range.getValues();
    
    if (values.length === 0) {
      throw new Error('Aucune donnée trouvée dans le sheet');
    }
    
    // La première ligne contient les en-têtes
    const headers = values[0];
    const dataRows = values.slice(1);
    
    // Transformer les données en objets JSON
    const data = dataRows.map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        let key = header.toLowerCase()
          .replace(/é/g, 'e')
          .replace(/è/g, 'e')
          .replace(/ê/g, 'e')
          .replace(/à/g, 'a')
          .replace(/ç/g, 'c')
          .replace(/[^a-z0-9]/g, '_')
          .replace(/_+/g, '_')
          .replace(/^_|_$/g, '');
        
        if (key === 'matieres' || key === 'matiere') key = 'matiere';
        if (key === 'competences' || key === 'competence') key = 'competence';
        if (key === 'pratiques_autorisees' || key === 'autorisees') key = 'pratiques_autorisees';
        if (key === 'pratiques_interdites' || key === 'interdites') key = 'pratiques_interdites';
        
        obj[key] = typeof row[index] === 'string' ? row[index].trim() : row[index] || '';
      });
      return obj;
    });
    
    // Filtrer les lignes vides
    const filteredData = data.filter(row => row.matiere && row.competence);
    
    return filteredData;
      
  } catch (error) {
    throw new Error('Erreur serveur: ' + error.toString());
  }
}