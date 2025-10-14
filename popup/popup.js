document.addEventListener('DOMContentLoaded', function() {
    const openPanelBtn = document.getElementById('openPanel');
    const charteBtn = document.getElementById('charteButton');

    // Bouton pour ouvrir directement le panneau
    openPanelBtn.addEventListener('click', function() {
        chrome.runtime.sendMessage({
            action: 'toggleSidePanel',
            enabled: true
        }, function(response) {
            if (chrome.runtime.lastError) {
                console.error('Erreur:', chrome.runtime.lastError);
            } else {
                // Fermer le popup après ouverture
                window.close();
            }
        });
    });

    // Bouton pour ouvrir la charte IA dans un nouvel onglet
    charteBtn.addEventListener('click', function() {
        chrome.tabs.create({
            url: chrome.runtime.getURL('charte.html')
        });
        window.close();
    });
});
