// ===========================================
// BiteQuest - favourites.js
// Displays saved recipes from localStorage
// ===========================================


// ---------- CONSTANTS ----------

const FAV_STORAGE_KEY = "bitequest_favourites";


// ---------- ELEMENTS ----------

const favouritesContainer =
    document.getElementById("favouritesContainer");

const loadingMessage =
    document.getElementById("loadingMessage");

const noFavourites =
    document.getElementById("noFavourites");


// ---------- START ----------

document.addEventListener("DOMContentLoaded", initializePage);


// ===========================================
// INITIALIZE PAGE
// ===========================================

function initializePage() {

    const favourites = getFavourites();

    loadingMessage.style.display = "none";

    if (favourites.length === 0) {
        noFavourites.style.display = "block";
        return;
    }

    renderFavouriteCards(favourites);

}


// ===========================================
// GET FAVOURITES
// ===========================================

function getFavourites() {

    const data = localStorage.getItem(FAV_STORAGE_KEY);

    if (!data) {
        return [];
    }

    try {

        return JSON.parse(data);

    } catch (error) {

        console.error("Failed to parse favourites:", error);

        return [];

    }

}


// ===========================================
// SAVE FAVOURITES
// ===========================================

function saveFavourites(favourites) {

    localStorage.setItem(
        FAV_STORAGE_KEY,
        JSON.stringify(favourites)
    );

}


// ===========================================
// RENDER CARDS
// ===========================================

function renderFavouriteCards(favourites) {

    favouritesContainer.innerHTML = "";

    favourites.forEach(function (recipe) {

        const card = document.createElement("div");

        card.className = "recipe-card";

        const image = document.createElement("img");

        image.className = "recipe-image";
        image.alt = recipe.name;

        image.onload = function () {
            image.classList.add("loaded");
        };

        image.src = recipe.image;

        card.appendChild(image);

        const content = document.createElement("div");

        content.className = "recipe-content";

        content.innerHTML = `

                <h2 class="recipe-title">

                    ${recipe.name}

                </h2>

                <div class="recipe-badges">

                    <span class="badge">

                        ${recipe.area || ""}

                    </span>

                    <span class="badge">

                        ${recipe.category || ""}

                    </span>

                </div>

                <button
                    class="view-btn"
                    onclick="window.location.href='recipe.html?id=${recipe.id}'">

                    View Recipe →

                </button>

                <button
                    class="remove-btn"
                    data-id="${recipe.id}">

                    ✕ Remove

                </button>

        `;

        card.appendChild(content);

        favouritesContainer.appendChild(card);

    });

    attachRemoveEvents();

}


// ===========================================
// REMOVE FROM FAVOURITES
// ===========================================

function attachRemoveEvents() {

    const buttons =
        document.querySelectorAll(".remove-btn");

    buttons.forEach(function (button) {

        button.addEventListener("click", function () {

            const recipeId = button.dataset.id;

            let favourites = getFavourites();

            favourites = favourites.filter(function (fav) {
                return fav.id !== recipeId;
            });

            saveFavourites(favourites);

            // Re-render the grid

            if (favourites.length === 0) {

                favouritesContainer.innerHTML = "";
                noFavourites.style.display = "block";

            } else {

                renderFavouriteCards(favourites);

            }

        });

    });

}
