// Variables globales
let allData = [];

// Éléments DOM
const matiereSelect = document.getElementById('matiere-select');
const resultsContainer = document.getElementById('results-container');
const selectedMatiereTitle = document.getElementById('selected-matiere');
const competencesContainer = document.getElementById('competences-container');
const loadingMessage = document.getElementById('loading-message');
const errorMessage = document.getElementById('error-message');

// Gestion des onglets
document.addEventListener('DOMContentLoaded', function() {
    initTabs();
    loadData();
    initTamponImages();

    // Recharger les données toutes les 5 minutes pour maintenir la synchronisation
    setInterval(loadData, 5 * 60 * 1000);
});

// Fonction pour initialiser les event listeners des images tampons
function initTamponImages() {
    const tamponImages = document.querySelectorAll('.tampon-image');
    tamponImages.forEach(img => {
        img.addEventListener('click', function() {
            copyImageToClipboard(this);
        });
    });
}

function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const tabIndicator = document.getElementById('tabIndicator');

    // Positionner l'indicateur sur l'onglet actif au démarrage
    updateTabIndicator();

    tabButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            // Retirer la classe active de tous les onglets
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            // Ajouter la classe active à l'onglet cliqué
            button.classList.add('active');
            const targetTab = button.getAttribute('data-tab');
            document.getElementById(targetTab).classList.add('active');

            // Mettre à jour l'indicateur
            updateTabIndicator();
        });
    });

    function updateTabIndicator() {
        const activeButton = document.querySelector('.tab-button.active');
        if (activeButton) {
            const rect = activeButton.getBoundingClientRect();
            const containerRect = activeButton.parentElement.getBoundingClientRect();
            
            tabIndicator.style.width = `${rect.width}px`;
            tabIndicator.style.left = `${rect.left - containerRect.left}px`;
        }
    }

    // Mettre à jour l'indicateur lors du redimensionnement
    window.addEventListener('resize', updateTabIndicator);
}

// Fonction pour charger les données depuis votre Google Sheets en temps réel
async function loadData() {
    try {
        loadingMessage.style.display = 'block';
        errorMessage.classList.add('hidden');
        
        // URL de votre Google Apps Script API
        // TODO: Remplacer par l'URL de votre Google Apps Script déployé
        const SCRIPT_API_URL = 'https://script.google.com/macros/s/AKfycbzgTgXXHvDuuBFWfrn4_R2x08OT4lFHK-lOiErNgfeUgSN4cdxbemwpCEMO5oVofwJw8Q/exec';
        // URL de l'API configurée, utilisation des vraies données

        // Utiliser le service worker pour récupérer les données
        const response = await new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(
                { action: 'fetchApiData', url: SCRIPT_API_URL },
                (response) => {
                    if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError.message));
                    } else if (response.success) {
                        resolve(response.data);
                    } else {
                        reject(new Error(response.error));
                    }
                }
            );
        });

        // Les données sont déjà en format JSON depuis l'API
        allData = response;
        populateMatiereSelect();
        loadingMessage.style.display = 'none';
        
    } catch (error) {
        console.error('Erreur lors du chargement:', error);
        loadingMessage.style.display = 'none';
        errorMessage.innerHTML = `
            <div class="mb-2">❌ Erreur lors du chargement des données</div>
            <div class="text-xs">${error.message}</div>
            <button id="retry-button" class="mt-3 px-4 py-2 bg-red-500 text-white rounded text-xs hover:bg-red-600">
                🔄 Réessayer
            </button>
        `;
        
        // Ajouter l'événement de clic pour le bouton réessayer
        const retryButton = document.getElementById('retry-button');
        if (retryButton) {
            retryButton.addEventListener('click', loadData);
        }
        errorMessage.classList.remove('hidden');
    }
}

// Fonction pour peupler le menu déroulant avec les matières
function populateMatiereSelect() {
    // Vider les options existantes (sauf la première)
    matiereSelect.innerHTML = '<option value="">-- Sélectionnez une matière --</option>';

    const matieres = [...new Set(allData.map(row => row.matiere))].filter(m => m);

    matieres.forEach(matiere => {
        const option = document.createElement('option');
        option.value = matiere;
        option.textContent = matiere;
        matiereSelect.appendChild(option);
    });

    // Afficher les usages transversaux par défaut
    displayUsagesTransversaux();
}

// Fonction pour afficher les compétences d'une matière
function displayCompetences(matiere) {
    if (!matiere) {
        displayUsagesTransversaux();
        return;
    }

    selectedMatiereTitle.textContent = matiere;
    selectedMatiereTitle.className = "text-lg font-bold text-orange-700 mb-4 text-center border-b border-gray-300 pb-2";
    
    // Filtrer les données pour la matière sélectionnée
    const competencesData = allData.filter(row => row.matiere === matiere);
    
    // Grouper par compétence
    const competencesGrouped = {};
    competencesData.forEach(row => {
        if (!competencesGrouped[row.competence]) {
            competencesGrouped[row.competence] = {
                autorisees: [],
                interdites: []
            };
        }
        
        if (row.pratiques_autorisees) {
            const autorisees = row.pratiques_autorisees.split('\n').filter(p => p.trim());
            competencesGrouped[row.competence].autorisees.push(...autorisees);
        }
        
        if (row.pratiques_interdites) {
            const interdites = row.pratiques_interdites.split('\n').filter(p => p.trim());
            competencesGrouped[row.competence].interdites.push(...interdites);
        }
    });

    // Générer le HTML pour chaque compétence
    competencesContainer.innerHTML = '';
    
    // Vérifier s'il y a des compétences pour cette matière
    if (Object.keys(competencesGrouped).length === 0) {
        competencesContainer.innerHTML = `
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                <h3 class="text-sm font-semibold text-yellow-800 mb-1">Aucune compétence définie</h3>
                <p class="text-xs text-yellow-700">Cette matière ne contient pas encore de compétences spécifiques.</p>
            </div>
        `;
        resultsContainer.classList.remove('hidden');
        return;
    }
    
    Object.entries(competencesGrouped).forEach(([competence, pratiques]) => {
        const competenceHtml = `
            <div class="border border-gray-200 rounded-lg overflow-hidden mb-4">
                <div class="bg-gradient-to-r from-orange-500 to-orange-600 px-3 py-2">
                    <h3 class="text-sm font-bold text-white">${competence}</h3>
                </div>
                <div class="p-3">
                    <div class="space-y-3">
                        <div>
                            <h4 class="flex items-center text-xs font-bold text-green-700 mb-2">
                                <span class="bg-green-100 rounded-full p-1 mr-2 flex-shrink-0">
                                    <svg class="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                                    </svg>
                                </span>
                                Pratiques Autorisées
                            </h4>
                            <ul class="list-disc list-inside text-gray-700 space-y-1 text-xs ml-2">
                                ${pratiques.autorisees.map(p => `<li class="leading-relaxed">${p}</li>`).join('')}
                            </ul>
                            ${pratiques.autorisees.length === 0 ? '<p class="text-gray-500 italic text-xs ml-2">Aucune pratique spécifiquement autorisée listée.</p>' : ''}
                        </div>
                        
                        <div>
                            <h4 class="flex items-center text-xs font-bold text-red-700 mb-2">
                                <span class="bg-red-100 rounded-full p-1 mr-2 flex-shrink-0">
                                    <svg class="w-3 h-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
                                    </svg>
                                </span>
                                Pratiques Interdites
                            </h4>
                            <ul class="list-disc list-inside text-gray-700 space-y-1 text-xs ml-2">
                                ${pratiques.interdites.map(p => `<li class="leading-relaxed">${p}</li>`).join('')}
                            </ul>
                            ${pratiques.interdites.length === 0 ? '<p class="text-gray-500 italic text-xs ml-2">Aucune pratique spécifiquement interdite listée.</p>' : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
        competencesContainer.insertAdjacentHTML('beforeend', competenceHtml);
    });

    resultsContainer.classList.remove('hidden');
}

// Fonction pour afficher les usages transversaux
function displayUsagesTransversaux() {
    selectedMatiereTitle.textContent = 'Usages transversaux';
    selectedMatiereTitle.className = "text-lg font-bold text-orange-700 mb-4 text-center border-b border-gray-300 pb-2";

    const usagesTransversaux = [
        {
            competence: 'Formulation',
            pratiques_autorisees: 'Aide à la formulation (traduction, simplification, correction)',
            pratiques_interdites: 'Aide interdite si elle rentre dans les compétences évaluées (langue)'
        },
        {
            competence: 'Compréhension',
            pratiques_autorisees: 'Poser des questions pour comprendre, demander des explications simplifiées',
            pratiques_interdites: 'Répondre à ta place à des questions de compréhension posées par le professeur'
        },
        {
            competence: "S'exercer",
            pratiques_autorisees: "Utiliser l'IA comme tuteur qui t'interroge, vérifie ta compréhension, te donne des exercices d'approfondissement ou de remédiation",
            pratiques_interdites: "Utiliser l'IA pour te remplacer dans l'exécution d'une tâche"
        }
    ];

    // Générer le HTML pour chaque usage transversal
    competencesContainer.innerHTML = '';

    // Message d'introduction
    const messageHtml = `
        <div class="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6 text-center">
            <h3 class="text-lg font-bold text-orange-800 mb-2">💡 Principe général</h3>
            <p class="text-orange-700 font-medium">L'IA peut t'assister dans tes tâches, dès qu'elle fait le travail à ta place, elle te remplace...</p>
        </div>
    `;
    competencesContainer.insertAdjacentHTML('beforeend', messageHtml);

    usagesTransversaux.forEach(usage => {
        const usageHtml = `
            <div class="border border-gray-200 rounded-lg overflow-hidden mb-4">
                <div class="bg-gradient-to-r from-orange-500 to-orange-600 px-3 py-2">
                    <h3 class="text-sm font-bold text-white">${usage.competence}</h3>
                </div>
                <div class="p-3">
                    <div class="space-y-3">
                        <div>
                            <h4 class="flex items-center text-xs font-bold text-green-700 mb-2">
                                <span class="bg-green-100 rounded-full p-1 mr-2 flex-shrink-0">
                                    <svg class="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                                    </svg>
                                </span>
                                Pratiques Autorisées
                            </h4>
                            <p class="text-gray-700 text-xs ml-2 leading-relaxed">${usage.pratiques_autorisees}</p>
                        </div>

                        <div>
                            <h4 class="flex items-center text-xs font-bold text-red-700 mb-2">
                                <span class="bg-red-100 rounded-full p-1 mr-2 flex-shrink-0">
                                    <svg class="w-3 h-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
                                    </svg>
                                </span>
                                Pratiques Interdites
                            </h4>
                            <p class="text-gray-700 text-xs ml-2 leading-relaxed">${usage.pratiques_interdites}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        competencesContainer.insertAdjacentHTML('beforeend', usageHtml);
    });

    resultsContainer.classList.remove('hidden');
}

// Gestionnaire d'événement pour le changement de matière
matiereSelect.addEventListener('change', (e) => {
    displayCompetences(e.target.value);
});

// Fonction pour copier une icône de tampon dans le presse-papiers
async function copyImageToClipboard(imgElement) {
    // Utilisation directe de la méthode fallback qui fonctionne sans problème CSP/CORS
    fallbackCopyMethod(imgElement);
}

// Fonction de fallback qui copie un texte alternatif
function fallbackCopyMethod(imgElement) {
    try {
        // Créer un texte descriptif de l'icône avec formatage
        let iconText = '';
        const alt = imgElement.alt;

        if (alt.includes('non utilisée')) {
            iconText = '🚫 IA NON UTILISÉE 🚫';
        } else if (alt.includes('aide')) {
            iconText = '🤝 IA UTILISÉE COMME AIDE 🤝';
        } else if (alt.includes('généré')) {
            iconText = '🤖 GÉNÉRÉ PAR IA 🤖';
        } else {
            iconText = '🤖 IA 🤖';
        }

        navigator.clipboard.writeText(iconText);
        showCopyFeedback(imgElement, 'success');
        console.log('Tampon IA copié dans le presse-papiers:', iconText);

    } catch (textErr) {
        console.error('Échec total de la copie:', textErr);
        showCopyFeedback(imgElement, 'error');
    }
}

// Fonction pour afficher le feedback visuel
function showCopyFeedback(imgElement, type) {
    const originalBorder = imgElement.style.border;
    const originalBoxShadow = imgElement.style.boxShadow;

    switch(type) {
        case 'success':
            imgElement.style.border = '2px solid #10b981';
            imgElement.style.boxShadow = '0 0 8px rgba(16, 185, 129, 0.3)';
            break;
        case 'fallback':
            imgElement.style.border = '2px solid #f59e0b';
            imgElement.style.boxShadow = '0 0 8px rgba(245, 158, 11, 0.3)';
            break;
        case 'error':
            imgElement.style.border = '2px solid #ef4444';
            imgElement.style.boxShadow = '0 0 8px rgba(239, 68, 68, 0.3)';
            break;
    }

    setTimeout(() => {
        imgElement.style.border = originalBorder;
        imgElement.style.boxShadow = originalBoxShadow;
    }, 1500);
}

// Fonction pour générer des données de démonstration
function getDemoData() {
    return [
        {
            matiere: "Français",
            competence: "Lecture et compréhension",
            pratiques_autorisees: "Utiliser l'IA pour expliquer des mots difficiles\nGénérer des questions de compréhension\nCréer des résumés de textes",
            pratiques_interdites: "Faire rédiger entièrement par l'IA\nRemplacer la lecture personnelle\nGénérer des réponses sans réflexion"
        },
        {
            matiere: "Français",
            competence: "Expression écrite",
            pratiques_autorisees: "Corriger l'orthographe et la grammaire\nProposer des synonymes\nAméliorer la structure du texte",
            pratiques_interdites: "Écrire l'entièreté du devoir\nCopier-coller sans modification\nNe pas citer l'utilisation de l'IA"
        },
        {
            matiere: "Mathématiques",
            competence: "Résolution de problèmes",
            pratiques_autorisees: "Vérifier ses calculs\nExpliquer une démarche\nGénérer des exercices similaires",
            pratiques_interdites: "Faire résoudre le problème entièrement\nNe pas comprendre la solution\nCopier sans expliquer"
        },
        {
            matiere: "Sciences",
            competence: "Recherche et investigation",
            pratiques_autorisees: "Rechercher des informations fiables\nExpliquer des concepts complexes\nGénérer des hypothèses",
            pratiques_interdites: "Accepter toute information sans vérification\nRemplacer l'expérimentation\nNe pas citer les sources"
        }
    ];
}

