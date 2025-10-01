document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const closeButton = document.getElementById('closeButton');

    // Gestion de la fermeture
    closeButton.addEventListener('click', function() {
        // Essayer plusieurs méthodes de fermeture
        if (window.chrome && window.chrome.tabs) {
            // Si c'est dans le contexte d'une extension
            chrome.tabs.getCurrent(function(tab) {
                if (tab) {
                    chrome.tabs.remove(tab.id);
                } else {
                    // Fallback
                    window.close();
                }
            });
        } else {
            // Fermeture standard
            window.close();
        }
    });

    // Fermeture avec Échap
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeButton.click();
        }
    });

    // Gestion des onglets
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');

            // Retirer la classe active de tous les onglets
            tabs.forEach(t => t.classList.remove('active'));

            // Cacher tous les contenus
            tabContents.forEach(content => {
                content.classList.remove('active');
                content.style.display = 'none';
            });

            // Ajouter la classe active à l'onglet cliqué
            this.classList.add('active');

            // Afficher le contenu correspondant
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
                targetContent.style.display = 'block';
            }
        });
    });
});