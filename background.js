// Service Worker pour l'extension GuidIA
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension GuidIA installée');
});

// Gestion de l'activation/désactivation du panneau latéral
chrome.action.onClicked.addListener(async (tab) => {
  // Ouvrir le side panel
  await chrome.sidePanel.open({ tabId: tab.id });
});

// Écouter les messages du popup et du sidepanel
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleSidePanel') {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const tabId = tabs[0].id;
      
      if (request.enabled) {
        await chrome.sidePanel.open({ tabId: tabId });
      } else {
        // Chrome ne permet pas de fermer le side panel programmatiquement
        // L'utilisateur doit le fermer manuellement
        console.log('Panneau latéral activé - fermeture manuelle requise');
      }
    });
    
    sendResponse({ success: true });
  }
  
  // Gestion des requêtes vers l'API Google Apps Script
  if (request.action === 'fetchApiData') {
    handleApiRequest(request.url)
      .then(data => sendResponse({ success: true, data: data }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    
    return true; // Indique que la réponse sera asynchrone
  }
});

// Fonction pour récupérer les données depuis l'API Google Apps Script
async function handleApiRequest(url) {
  try {
    console.log('Récupération des données depuis:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const textData = await response.text();
    console.log('Réponse brute reçue:', textData.substring(0, 200));

    // Vérifier si la réponse est du JSON valide
    let jsonData;
    try {
      jsonData = JSON.parse(textData);
    } catch (parseError) {
      console.error('Erreur de parsing JSON:', parseError);
      console.error('Contenu reçu:', textData.substring(0, 500));
      throw new Error('L\'API ne retourne pas du JSON valide. Vérifiez la configuration du Google Apps Script.');
    }

    if (jsonData.error) {
      throw new Error(jsonData.error);
    }
    
    console.log('Données reçues:', jsonData.length, 'éléments');
    return jsonData;
  } catch (error) {
    console.error('Erreur lors de la requête API:', error);
    throw error;
  }
}
