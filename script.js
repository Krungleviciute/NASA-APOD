const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');


// NASA API

const count = 10;
const apiKey = 'DEMO_KEY'
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`

let resultsArray = [];

let favorites = {};

const showContent = (page) => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    if(page === 'results'){
        resultsNav.classList.remove('hidden');
        favoritesNav.classList.add('hidden');
    } else {
        favoritesNav.classList.remove('hidden');
        resultsNav.classList.add('hidden');
    }
    loader.classList.add('hidden');
}

const createDOMNodes = (page) => {
    const currentArray = page === 'results' ? resultsArray : Object.values(favorites);
    currentArray.forEach((result) => {
        const card = document.createElement('div');
        card.classList.add('card');

        const link = document.createElement('a');
        link.href = result.hdurl;
        link.title = 'View Full Image';
        link.target = '_blank';
        link.classList.add('card-img-top');

        const image = document.createElement('img');
        image.src = result.url;
        image.alt = 'NASA Picture of The Day';
        image.loading = 'lazy';
        image.classList.add('card-img-top');

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const cardTitle = document.createElement('h5');
        cardTitle.textContent = result.title;
        cardTitle.classList.add('card-title');

        const saveText = document.createElement('p');
        saveText.classList.add('clickable');
        if(page === 'results'){
            saveText.textContent = "Add to Favorites";
            saveText.setAttribute('onclick', `saveToFavorites('${result.url}')`);
        } else {
            saveText.textContent = "Remove Favorite";
            saveText.setAttribute('onclick', `removeFavorite('${result.url}')`);
        }

        const cardText = document.createElement("p");
        cardText.classList.add('card-text');
        cardText.textContent = result.explanation;

        const footer = document.createElement('small');
        footer.classList.add('text-muted');

        const date = document.createElement('strong');
        date.textContent = result.date;

        const copyrightResult = result.copyright === undefined ? "" : result.copyright;
        const copyright = document.createElement('span');
        copyright.textContent = ` ${copyrightResult}`;

        // Appending Elements

        footer.append(date, copyright);
        cardBody.append(cardTitle, saveText, cardText, footer);
        link.appendChild(image);
        card.append(link, cardBody);
        imagesContainer.appendChild(card)
    })  
}

const updateDOM = (page) => {
    if(localStorage.getItem('nasaFavorites')){
        favorites = JSON.parse(localStorage.getItem('nasaFavorites'));
    }
    imagesContainer.textContent = "";
    createDOMNodes(page);
    showContent(page);
}

const getNasaPictures = async () => {
    loader.classList.remove('hidden');
    try {
        const response = await fetch(apiUrl)
        resultsArray = await response.json();
        updateDOM('results');
    }catch(err){
        // Catch Error
    }
}

const saveToFavorites = (itemUrl) => {
    resultsArray.forEach((item) => {
        if(item.url.includes(itemUrl) && !favorites[itemUrl]){
            favorites[itemUrl] = item;
            // Show confirmation for 2 s and then disapear
            saveConfirmed.hidden = false;
            setTimeout(() => {
                saveConfirmed.hidden = true;
            }, 2000)
            localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        }
    });
}

const removeFavorite = (itemUrl) => {
    if(favorites[itemUrl]){
       delete favorites[itemUrl] 
       localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
       updateDOM('favorites');
    }
}

getNasaPictures();

