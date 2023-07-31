const API_KEY = "e559bf00c19b4e68a7a2901cb95e67cb";
const url = "https://newsapi.org/v2/everything?q=";

window.addEventListener('load', () => fetchNews("India"));

function reload(){
    window.location.reload(); // if we want to return to home page by clicking on logo
}

async function fetchNews ( query ){
    const res = await fetch(`${url}${query}&apiKey=${API_KEY}`)
    const data = await res.json();
    bindData(data.articles);
} 

// we have now got our articles
// now e just have to find them and inflate them

function bindData( articles ){
    const cardsContainer = document.getElementById('cards-container');
    const newsCardTemplate = document.getElementById('template-news-card')

    cardsContainer.innerHTML = "";
    // agar yeh empty nahi karenge toh jitni bar bind data karenge toh utni baar card dalte 
    //rehenge even cards pehle se hi present ho
    // iske baad hum for loop chaleyenge for each article
    articles.forEach(article => {
        if(!article.urlToImage) return; // jis url mein no img, usko show mat karo
        const cardClone = newsCardTemplate.content.cloneNode(true); // used for deep cloning

        // filling data in card
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone); // clone bannte jayenge aur isme store hote jayenge
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector('#news-img');
    const newsTitle = cardClone.querySelector('#news-title');
    const newsSource = cardClone.querySelector('#news-source');
    const newsDesc = cardClone.querySelector('#news-desc');

    // now we have to add source to this news img
    // this syntax is from the news api site
    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    // converting api time synta to normal syntax
    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta"
    });

    newsSource.innerHTML = `${article.source.name} ▪️ ${date}`;

    // if we click on some card, it will take us to source
    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank"); // blank means new tab
    })
}

let curSelectedNav = null;
function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active"); // jab kisi naye nav par click kiya toh purane nav mein se active class ko remove kardo
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active"); // purane se active class hatke naye mein aa jayegi
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value;
    if(!query) return;
    fetchNews(query);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
});