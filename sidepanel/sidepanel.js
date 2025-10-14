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

// ========================================
// GÉNÉRATEUR DE RÉFÉRENCES APA
// ========================================

let references = [];

// Initialiser le générateur de références au chargement du DOM
document.addEventListener('DOMContentLoaded', function() {
    initReferenceGenerator();
});

function initReferenceGenerator() {
    const sourceType = document.getElementById('sourceType');
    const addRefBtn = document.getElementById('addRefBtn');
    const clearRefBtn = document.getElementById('clearRefBtn');
    const exportWordBtn = document.getElementById('exportWordBtn');
    const exportCSVBtn = document.getElementById('exportCSVBtn');
    const autoFillWebBtn = document.getElementById('autoFillWebBtn');

    // Gestion des événements
    if (sourceType) {
        sourceType.addEventListener('change', updateRefFields);
        sourceType.addEventListener('change', updateRefPreview);
        sourceType.addEventListener('change', toggleAutoFillButton);
    }

    // Événements pour les champs de saisie
    ['authors', 'year', 'title'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', updateRefPreview);
            element.addEventListener('change', updateRefPreview);
        }
    });

    // Événements des boutons
    if (addRefBtn) addRefBtn.addEventListener('click', addRefToList);
    if (clearRefBtn) clearRefBtn.addEventListener('click', clearRefForm);
    if (exportWordBtn) exportWordBtn.addEventListener('click', exportRefWord);
    if (exportCSVBtn) exportCSVBtn.addEventListener('click', exportRefCSV);
    if (autoFillWebBtn) autoFillWebBtn.addEventListener('click', autoFillFromActivePage);

    // Initialiser les champs dynamiques
    updateRefFields();
    toggleAutoFillButton();
}

function updateRefFields() {
    const type = document.getElementById('sourceType')?.value;
    const container = document.getElementById('dynamicFields');
    if (!container) return;

    container.innerHTML = '';

    let fields = [];

    if (type === 'book') {
        fields = [
            { id: 'publisher', label: 'Éditeur', placeholder: 'Nom de l\'éditeur' },
            { id: 'edition', label: 'Édition (optionnel)', placeholder: '2e éd.' }
        ];
    } else if (type === 'article') {
        fields = [
            { id: 'journal', label: 'Nom du journal', placeholder: 'Revue scientifique' },
            { id: 'volume', label: 'Volume', placeholder: '12' },
            { id: 'issue', label: 'Numéro (optionnel)', placeholder: '3' },
            { id: 'pages', label: 'Pages', placeholder: '45-67' },
            { id: 'doi', label: 'DOI (optionnel)', placeholder: '10.1234/exemple' }
        ];
    } else if (type === 'website') {
        fields = [
            { id: 'website', label: 'Nom du site', placeholder: 'Nom du site web' },
            { id: 'url', label: 'URL', placeholder: 'https://...' },
            { id: 'accessDate', label: 'Date de consultation', placeholder: '15 mars 2024' }
        ];
    } else if (type === 'chapter') {
        fields = [
            { id: 'bookTitle', label: 'Titre du livre', placeholder: 'Titre du livre complet' },
            { id: 'editors', label: 'Éditeur(s) du livre', placeholder: 'Nom, P. (dir.)' },
            { id: 'pages', label: 'Pages', placeholder: '123-145' },
            { id: 'publisher', label: 'Éditeur', placeholder: 'Nom de l\'éditeur' }
        ];
    } else if (type === 'thesis') {
        fields = [
            { id: 'thesisType', label: 'Type', placeholder: 'Thèse de doctorat' },
            { id: 'institution', label: 'Institution', placeholder: 'Université de Paris' },
            { id: 'url', label: 'URL (optionnel)', placeholder: 'https://...' }
        ];
    }

    fields.forEach(field => {
        const div = document.createElement('div');
        div.className = 'ref-form-group';
        div.innerHTML = `
            <label for="${field.id}">${field.label}</label>
            <input type="text" id="${field.id}" class="ref-input" placeholder="${field.placeholder}">
        `;
        container.appendChild(div);

        // Ajouter les événements aux nouveaux champs
        const input = div.querySelector('input');
        if (input) {
            input.addEventListener('input', updateRefPreview);
            input.addEventListener('change', updateRefPreview);
        }
    });

    updateRefPreview();
}

function formatAuthors(authorsStr) {
    if (!authorsStr || authorsStr.trim() === '') return '';
    
    const authors = authorsStr.split(';').map(a => a.trim()).filter(a => a);
    
    if (authors.length === 0) return '';
    if (authors.length === 1) return authors[0];
    if (authors.length === 2) return authors[0] + ', & ' + authors[1];
    
    const lastAuthor = authors[authors.length - 1];
    const otherAuthors = authors.slice(0, -1).join(', ');
    return otherAuthors + ', & ' + lastAuthor;
}

function getRefValue(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
}

function generateReference() {
    const type = document.getElementById('sourceType')?.value;
    const authors = formatAuthors(getRefValue('authors'));
    const year = getRefValue('year');
    const title = getRefValue('title');

    let ref = '';

    if (type === 'book') {
        const publisher = getRefValue('publisher');
        const edition = getRefValue('edition');
        if (authors) ref += authors;
        if (year) ref += ' (' + year + ')';
        if (title) ref += '. <em>' + title + '</em>';
        if (edition) ref += ' (' + edition + ')';
        if (publisher) ref += '. ' + publisher;
        if (ref) ref += '.';
    }
    else if (type === 'article') {
        const journal = getRefValue('journal');
        const volume = getRefValue('volume');
        const issue = getRefValue('issue');
        const pages = getRefValue('pages');
        const doi = getRefValue('doi');
        
        if (authors) ref += authors;
        if (year) ref += ' (' + year + ')';
        if (title) ref += '. ' + title;
        if (journal) ref += '. <em>' + journal + '</em>';
        if (volume) ref += ', <em>' + volume + '</em>';
        if (issue) ref += '(' + issue + ')';
        if (pages) ref += ', ' + pages;
        if (ref) ref += '.';
        if (doi) ref += ' https://doi.org/' + doi;
    }
    else if (type === 'website') {
        const website = getRefValue('website');
        const url = getRefValue('url');
        const accessDate = getRefValue('accessDate');
        
        if (authors) ref += authors;
        if (year) ref += ' (' + year + ')';
        if (title) ref += '. <em>' + title + '</em>';
        if (website) ref += '. ' + website;
        if (ref) ref += '.';
        if (accessDate) ref += ' Consulté le ' + accessDate + '.';
        if (url) ref += ' ' + url;
    }
    else if (type === 'chapter') {
        const bookTitle = getRefValue('bookTitle');
        const editors = getRefValue('editors');
        const pages = getRefValue('pages');
        const publisher = getRefValue('publisher');
        
        if (authors) ref += authors;
        if (year) ref += ' (' + year + ')';
        if (title) ref += '. ' + title;
        if (editors) ref += '. Dans ' + editors + ' (dir.)';
        if (bookTitle) ref += ', <em>' + bookTitle + '</em>';
        if (pages) ref += ' (p. ' + pages + ')';
        if (publisher) ref += '. ' + publisher;
        if (ref) ref += '.';
    }
    else if (type === 'thesis') {
        const thesisType = getRefValue('thesisType');
        const institution = getRefValue('institution');
        const url = getRefValue('url');
        
        if (authors) ref += authors;
        if (year) ref += ' (' + year + ')';
        if (title) ref += '. <em>' + title + '</em>';
        if (thesisType) ref += ' [' + thesisType + ']';
        if (institution) ref += '. ' + institution;
        if (ref) ref += '.';
        if (url) ref += ' ' + url;
    }

    return ref || '<em>Commencez à remplir les champs pour voir la référence apparaître...</em>';
}

function updateRefPreview() {
    const preview = document.getElementById('preview');
    if (!preview) return;
    
    const ref = generateReference();
    preview.innerHTML = '<div class="ref-reference-item">' + ref + '</div>';
}

function addRefToList() {
    const preview = document.getElementById('preview');
    if (!preview) return;
    
    const previewContent = preview.innerHTML.trim();
    
    // Vérifier que l'aperçu contient du contenu valide (pas juste le message par défaut)
    if (!previewContent || previewContent === '<em>Commencez à remplir les champs pour voir la référence apparaître...</em>') {
        alert('Veuillez remplir au moins l\'auteur, l\'année et le titre avant d\'ajouter à la liste.');
        return;
    }
    
    // Ajouter le contenu éditable de l'aperçu (qui peut avoir été modifié par l'utilisateur)
    references.push(previewContent);
    displayReferences();
    clearRefForm();
}

function displayReferences() {
    const list = document.getElementById('referencesList');
    if (!list) return;
    
    if (references.length === 0) {
        list.innerHTML = '<p class="ref-info-text">Aucune référence ajoutée. Ajoutez des références pour les voir apparaître ici.</p>';
        return;
    }

    let html = '';
    for (let i = 0; i < references.length; i++) {
        html += '<div class="ref-saved-reference" data-index="' + i + '">';
        html += '<div class="ref-saved-reference-text">' + references[i] + '</div>';
        html += '<div class="ref-saved-reference-actions">';
        html += '<button class="ref-btn-small ref-btn-copy" data-index="' + i + '" title="Copier">⎘</button>';
        html += '<button class="ref-btn-small ref-btn-delete" data-index="' + i + '" title="Supprimer">×</button>';
        html += '</div></div>';
    }
    
    list.innerHTML = html;
    
    // Ajouter les event listeners aux boutons de copie
    const copyButtons = list.querySelectorAll('.ref-btn-copy');
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            copyReference(index);
        });
    });
    
    // Ajouter les event listeners aux boutons de suppression
    const deleteButtons = list.querySelectorAll('.ref-btn-delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            deleteReference(index);
        });
    });
}

function copyReference(index) {
    if (index >= 0 && index < references.length) {
        const refText = stripHTML(references[index]);
        navigator.clipboard.writeText(refText).then(() => {
            // Feedback visuel temporaire
            const buttons = document.querySelectorAll('.ref-btn-copy');
            if (buttons[index]) {
                const originalText = buttons[index].textContent;
                buttons[index].textContent = '✓';
                buttons[index].style.backgroundColor = '#28a745';
                setTimeout(() => {
                    buttons[index].textContent = originalText;
                    buttons[index].style.backgroundColor = '';
                }, 1000);
            }
        }).catch(err => {
            console.error('Erreur lors de la copie:', err);
        });
    }
}

function deleteReference(index) {
    references.splice(index, 1);
    displayReferences();
}

function clearRefForm() {
    const fieldsToReset = ['authors', 'year', 'title'];
    fieldsToReset.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.value = '';
    });
    
    const dynamicInputs = document.querySelectorAll('#dynamicFields input');
    dynamicInputs.forEach(input => input.value = '');
    
    updateRefPreview();
}

function stripHTML(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
}

function exportRefWord() {
    if (references.length === 0) {
        alert('Veuillez ajouter au moins une référence avant d\'exporter.');
        return;
    }

    // Créer un document RTF (compatible Word et Google Docs)
    const rtfContent = generateRTF(references);
    
    const blob = new Blob([rtfContent], { type: 'application/rtf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'references_APA.rtf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Fonction pour générer un document RTF
function generateRTF(references) {
    // En-tête RTF
    let rtf = '{\\rtf1\\ansi\\deff0\n';
    rtf += '{\\fonttbl{\\f0\\froman\\fcharset0 Times New Roman;}}\n';
    rtf += '{\\colortbl;\\red0\\green0\\blue0;}\n';
    rtf += '\\viewkind4\\uc1\\pard\\sa200\\sl276\\slmult1\\lang12\\f0\\fs24\n';
    
    // Titre "Références" centré et en gras
    rtf += "\\qc\\b\\fs28 R\\'e9f\\'e9rences\\b0\\fs24\\par\n";
    rtf += '\\par\n'; // Ligne vide
    
    // Retour à l'alignement gauche
    rtf += '\\ql\n';
    
    // Ajouter chaque référence avec indentation suspendue
    for (let i = 0; i < references.length; i++) {
        const clean = stripHTML(references[i]);
        const escaped = escapeRTF(clean);
        
        // Indentation suspendue : 720 twips = 0.5 inch
        rtf += '\\fi-720\\li720 ' + escaped + '\\par\n';
        rtf += '\\par\n'; // Ligne vide entre les références
    }
    
    rtf += '}';
    
    return rtf;
}

// Fonction pour échapper les caractères spéciaux RTF
function escapeRTF(text) {
    return text
        .replace(/\\/g, '\\\\')
        .replace(/{/g, '\\{')
        .replace(/}/g, '\\}')
        .replace(/é/g, "\\'e9")
        .replace(/è/g, "\\'e8")
        .replace(/ê/g, "\\'ea")
        .replace(/à/g, "\\'e0")
        .replace(/ù/g, "\\'f9")
        .replace(/ô/g, "\\'f4")
        .replace(/î/g, "\\'ee")
        .replace(/ç/g, "\\'e7")
        .replace(/É/g, "\\'c9")
        .replace(/È/g, "\\'c8")
        .replace(/Ê/g, "\\'ca")
        .replace(/À/g, "\\'c0")
        .replace(/Ù/g, "\\'d9")
        .replace(/Ô/g, "\\'d4")
        .replace(/Î/g, "\\'ce")
        .replace(/Ç/g, "\\'c7");
}

function exportRefCSV() {
    if (references.length === 0) {
        alert('Veuillez ajouter au moins une référence avant d\'exporter.');
        return;
    }

    // Créer le contenu CSV
    let csvContent = '\ufeff'; // BOM pour UTF-8
    csvContent += 'Numéro,Référence\n'; // En-tête
    
    for (let i = 0; i < references.length; i++) {
        const clean = stripHTML(references[i]);
        // Échapper les guillemets et entourer de guillemets
        const escaped = '"' + clean.replace(/"/g, '""') + '"';
        csvContent += (i + 1) + ',' + escaped + '\n';
    }
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'references_APA.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Fonction pour afficher/cacher le bouton de remplissage automatique
function toggleAutoFillButton() {
    const sourceType = document.getElementById('sourceType')?.value;
    const autoFillWebBtn = document.getElementById('autoFillWebBtn');
    
    if (autoFillWebBtn) {
        if (sourceType === 'website') {
            autoFillWebBtn.style.display = 'block';
        } else {
            autoFillWebBtn.style.display = 'none';
        }
    }
}

// Fonction pour récupérer les informations de la page active
async function autoFillFromActivePage() {
    try {
        // Obtenir l'onglet actif
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        if (!tab || !tab.id) {
            alert('Impossible d\'accéder à l\'onglet actif.');
            return;
        }

        // Injecter un script pour extraire les métadonnées de la page
        const results = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: extractPageMetadata
        });

        if (results && results[0] && results[0].result) {
            const metadata = results[0].result;
            
            // Pré-remplir les champs
            const titleInput = document.getElementById('title');
            const authorsInput = document.getElementById('authors');
            const yearInput = document.getElementById('year');
            const websiteInput = document.getElementById('website');
            const urlInput = document.getElementById('url');
            const accessDateInput = document.getElementById('accessDate');
            
            if (titleInput && metadata.title) {
                titleInput.value = metadata.title;
            }
            
            if (authorsInput && metadata.author) {
                authorsInput.value = metadata.author;
            }
            
            if (yearInput && metadata.year) {
                yearInput.value = metadata.year;
            }
            
            if (websiteInput && metadata.siteName) {
                websiteInput.value = metadata.siteName;
            }
            
            if (urlInput && metadata.url) {
                urlInput.value = metadata.url;
            }
            
            if (accessDateInput) {
                // Date du jour au format français
                const today = new Date();
                const options = { day: 'numeric', month: 'long', year: 'numeric' };
                accessDateInput.value = today.toLocaleDateString('fr-FR', options);
            }
            
            // Mettre à jour l'aperçu
            updateRefPreview();
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des métadonnées:', error);
        alert('Impossible de récupérer les informations de la page. Assurez-vous d\'être sur une page web valide.');
    }
}

// Fonction exécutée dans le contexte de la page pour extraire les métadonnées
function extractPageMetadata() {
    const metadata = {
        title: document.title || '',
        url: window.location.href || '',
        author: '',
        year: '',
        siteName: ''
    };
    
    // === TITRE : Recherche exhaustive ===
    // Chercher d'abord dans les meta tags Open Graph, Twitter, etc.
    const titleMeta = document.querySelector('meta[property="og:title"]') ||
                      document.querySelector('meta[name="twitter:title"]') ||
                      document.querySelector('meta[property="dc:title"]') ||
                      document.querySelector('meta[name="dc.title"]');
    if (titleMeta && titleMeta.content) {
        metadata.title = titleMeta.content;
    } else if (!metadata.title) {
        // Essayer h1 comme fallback
        const h1 = document.querySelector('h1');
        if (h1) {
            metadata.title = h1.textContent.trim();
        }
    }
    
    // === AUTEUR : Recherche exhaustive ===
    const authorSelectors = [
        'meta[name="author"]',
        'meta[property="article:author"]',
        'meta[property="og:article:author"]',
        'meta[name="DC.creator"]',
        'meta[name="dc.creator"]',
        'meta[property="dc:creator"]',
        'meta[name="twitter:creator"]',
        'meta[name="parsely-author"]',
        'meta[property="author"]',
        'meta[name="byl"]',
        'meta[property="article:author:name"]'
    ];
    
    for (const selector of authorSelectors) {
        const authorMeta = document.querySelector(selector);
        if (authorMeta && authorMeta.content) {
            metadata.author = authorMeta.content;
            break;
        }
    }
    
    // Si pas trouvé dans les meta, chercher dans le contenu
    if (!metadata.author) {
        const authorSelectors = [
            '.author',
            '.by-author',
            '.article-author',
            '[rel="author"]',
            '[itemprop="author"]',
            '.byline',
            '.writer'
        ];
        
        for (const selector of authorSelectors) {
            const authorElement = document.querySelector(selector);
            if (authorElement && authorElement.textContent.trim()) {
                metadata.author = authorElement.textContent.trim();
                break;
            }
        }
    }
    
    // === NOM DU SITE : Recherche exhaustive ===
    const siteNameSelectors = [
        'meta[property="og:site_name"]',
        'meta[name="application-name"]',
        'meta[property="al:android:app_name"]',
        'meta[property="al:iphone:app_name"]',
        'meta[name="apple-mobile-web-app-title"]',
        'meta[name="twitter:site"]',
        'meta[property="og:site"]'
    ];
    
    for (const selector of siteNameSelectors) {
        const siteMeta = document.querySelector(selector);
        if (siteMeta && siteMeta.content) {
            metadata.siteName = siteMeta.content.replace('@', '');
            break;
        }
    }
    
    // Fallback sur le domaine
    if (!metadata.siteName) {
        try {
            const hostname = new URL(window.location.href).hostname;
            metadata.siteName = hostname.replace('www.', '');
        } catch (e) {
            metadata.siteName = '';
        }
    }
    
    // === DATE/ANNÉE : Recherche exhaustive ===
    const dateSelectors = [
        'meta[property="article:published_time"]',
        'meta[name="publication_date"]',
        'meta[name="date"]',
        'meta[property="og:article:published_time"]',
        'meta[name="DC.date"]',
        'meta[name="dc.date"]',
        'meta[property="dc:date"]',
        'meta[name="dcterms.created"]',
        'meta[name="article:published"]',
        'meta[property="article:published"]',
        'meta[name="publishdate"]',
        'meta[name="pubdate"]',
        'meta[itemprop="datePublished"]',
        'meta[name="date.created"]',
        'meta[name="lastmod"]'
    ];
    
    for (const selector of dateSelectors) {
        const dateMeta = document.querySelector(selector);
        if (dateMeta && dateMeta.content) {
            try {
                const pubDate = new Date(dateMeta.content);
                if (!isNaN(pubDate.getTime())) {
                    metadata.year = pubDate.getFullYear().toString();
                    break;
                }
            } catch (e) {
                // Continuer avec le prochain sélecteur
            }
        }
    }
    
    // Chercher dans les éléments HTML avec attributs time ou datetime
    if (!metadata.year) {
        const timeSelectors = [
            'time[datetime]',
            '[itemprop="datePublished"]',
            '.published-date',
            '.publication-date',
            '.post-date',
            '.entry-date'
        ];
        
        for (const selector of timeSelectors) {
            const timeElement = document.querySelector(selector);
            if (timeElement) {
                const dateStr = timeElement.getAttribute('datetime') || timeElement.textContent;
                try {
                    const pubDate = new Date(dateStr);
                    if (!isNaN(pubDate.getTime())) {
                        metadata.year = pubDate.getFullYear().toString();
                        break;
                    }
                } catch (e) {
                    // Continuer
                }
            }
        }
    }
    
    // Si toujours pas de date, chercher dans l'URL
    if (!metadata.year) {
        const urlYearMatch = window.location.href.match(/\/(\d{4})\//);
        if (urlYearMatch) {
            metadata.year = urlYearMatch[1];
        }
    }
    
    // Dernier recours : chercher dans le footer ou le contenu
    if (!metadata.year) {
        const footer = document.querySelector('footer');
        if (footer) {
            const yearMatch = footer.textContent.match(/©?\s*(\d{4})/);
            if (yearMatch) {
                metadata.year = yearMatch[1];
            }
        }
    }
    
    // Nettoyer les données
    if (metadata.author) {
        // Supprimer "Par", "By", etc.
        metadata.author = metadata.author.replace(/^(Par|By|De|Von)\s+/i, '').trim();
    }
    
    if (metadata.title) {
        // Supprimer les tirets ou pipes à la fin avec le nom du site
        metadata.title = metadata.title.replace(/[\|\-–—]\s*[^|\-–—]+$/, '').trim();
    }
    
    return metadata;
}
