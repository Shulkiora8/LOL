import Champion from './Champions.js';

var champions = [];
let currentChampionIndex = 0;
let currentSkinIndex = 0;

const button = document.querySelector("button");
button.addEventListener("click", () => {
    button.disabled = true; 
    document.querySelector('#champ').style.visibility = 'visible'; 
    lolstart();
});

const lolstart = async () => {
    const data = await fetch("https://ddragon.leagueoflegends.com/cdn/13.18.1/data/en_US/champion.json")
        .then(result => result.json());

    const array = data.data;
    for (const [name, champion] of Object.entries(array)) {
        const champ = new Champion(champion);
        pushChampion(champ);
    }

    showChampion();
};

function pushChampion(champion) {
    champions.push(champion);
}

const showChampion = async () => {
    const championContainer = document.getElementById("champion");
    championContainer.innerHTML = "";

    champions.forEach((currentChampion, index) => {
        const championElement = document.createElement("div");
        championElement.className = "card";

        const imageUrl = `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${currentChampion.id + '_0.jpg'}`;

        championElement.innerHTML = `
            <img src="${imageUrl}" alt="${currentChampion.name}">
            <h2>${currentChampion.name}</h2>            
            <p>${currentChampion.title}</p>
        `;

        championElement.addEventListener("click", () => {
            showChampionDetails(index); 
        });

        championContainer.appendChild(championElement);
    });
};

async function showChampionDetails(championIndex) {
    const champion = champions[championIndex];
    currentChampionIndex = championIndex; 
    currentSkinIndex = 0;

    const modal = document.getElementById("champion-modal");
    const detailsContainer = document.getElementById("champion-details");

    const championData = await fetch(`https://ddragon.leagueoflegends.com/cdn/13.18.1/data/en_US/champion/${champion.id}.json`)
        .then(result => result.json());

    const skins = championData.data[champion.id].skins;

    const skinImages = skins.map(skin => 
        `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.id}_${skin.num}.jpg`
    );

    modal.style.backgroundImage = `url(${skinImages[currentSkinIndex]})`;
    modal.style.backgroundSize = 'cover';  
    modal.style.backgroundPosition = 'center';  

    detailsContainer.innerHTML = `
     <div class="champion-info">
        <div class="champion-header">
            <img src="https://ddragon.leagueoflegends.com/cdn/13.18.1/img/champion/${champion.image.full}">
            <h1>${champion.name}</h1>
            <p class="subtitle">${champion.title}</p>
        </div>
        <div class="champion-body">
            <p>${champion.lore}</p> 
        </div>
        <div class="skin-gallery">
            <button id="prev-skin" class="nav-button skin-nav">&lt;</button>
            <p class="skin-name">${skins[currentSkinIndex].name}</p>
            <button id="next-skin" class="nav-button skin-nav">&gt;</button>
        </div>
        
        
        <div class="modal-footer">
            <button id="prev-button" class="nav-button">Previous Champion</button>
            <button id="next-button" class="nav-button">Next Champion</button>
        </div>
    </div>

        
    `;
    

    modal.style.display = "block";

    document.getElementById("prev-button").addEventListener("click", () => {
        navigateChampion(-1);  
    });
    document.getElementById("next-button").addEventListener("click", () => {
        navigateChampion(1);  
    });

    document.getElementById("prev-skin").addEventListener("click", () => {
        currentSkinIndex = (currentSkinIndex - 1 + skinImages.length) % skinImages.length; 
        updateSkinImage(skinImages, skins);
    });
    
    document.getElementById("next-skin").addEventListener("click", () => {
        currentSkinIndex = (currentSkinIndex + 1) % skinImages.length; 
        updateSkinImage(skinImages, skins);
    });
}

function updateSkinImage(skinImages, skins) {
    const skinImageElement = document.querySelector('.skin-image');
    //skinImageElement.src = skinImages[currentSkinIndex]; 
    const skinNameElement = document.querySelector('.skin-name');
    skinNameElement.textContent = skins[currentSkinIndex].name; 
    const modal = document.getElementById("champion-modal");
    modal.style.backgroundImage = `url(${skinImages[currentSkinIndex]})`; 
}

function navigateChampion(direction) {
    currentChampionIndex = (currentChampionIndex + direction + champions.length) % champions.length; 
    showChampionDetails(currentChampionIndex);
}

const closeButton = document.querySelector(".close-button");
closeButton.addEventListener("click", () => {
    const modal = document.getElementById("champion-modal");
    modal.style.display = "none";
});

window.addEventListener("click", (event) => {
    const modal = document.getElementById("champion-modal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
});
