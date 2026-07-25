// ===========================================
// BiteQuest
// results.js
// ===========================================

// ---------- ELEMENTS ----------

const resultsContainer = document.getElementById("resultsContainer");
const loadingMessage = document.getElementById("loadingMessage");
const noResults = document.getElementById("noResults");
const searchedIngredients = document.getElementById("searchedIngredients");

// ---------- START ----------

document.addEventListener("DOMContentLoaded", initializePage);

// ===========================================
// INITIALIZE PAGE
// ===========================================

async function initializePage() {

    const storedIngredients =
        localStorage.getItem("searchIngredients");

    if (!storedIngredients) {
        showNoResults();
        return;
    }

    const userIngredients = storedIngredients
        .split(",")
        .map(function (ingredient) {
            return ingredient.trim();
        })
        .filter(function (ingredient) {
            return ingredient.length > 0;
        });

    renderIngredientTags(userIngredients);

    try {

        const recipes = await runSearch(userIngredients);

        loadingMessage.style.display = "none";

        if (recipes.length === 0) {
            showNoResults();
            return;
        }

        renderRecipeCards(recipes);

    }
    catch (error) {

        console.error(error);
        showNoResults();

    }

}

// ===========================================
// SEARCHED INGREDIENT TAGS
// ===========================================

function renderIngredientTags(userIngredients) {

    searchedIngredients.innerHTML = "";

    userIngredients.forEach(function (ingredient) {

        const tag = document.createElement("span");

        tag.className = "ingredient-tag";

        tag.textContent = capitalize(ingredient);

        searchedIngredients.appendChild(tag);

    });

}

// ===========================================
// NO RESULTS
// ===========================================

function showNoResults() {

    loadingMessage.style.display = "none";
    noResults.style.display = "block";

}

// ===========================================
// CREATE INGREDIENT CHIPS
// ===========================================

function createIngredientChips(items, type) {

    if (items.length === 0) {

        return `<span class="${type}-chip">None</span>`;

    }

    const displayItems = items.slice(0, 4);

    let html = "";

    displayItems.forEach(function (item) {

        html += `
            <span class="${type}-chip">
                ${capitalize(item)}
            </span>
        `;

    });

    if (items.length > 4) {

        html += `
            <span class="more-chip">
                +${items.length - 4} more
            </span>
        `;

    }

    return html;

}

// ===========================================
// PROGRESS BAR
// ===========================================

function getProgressWidth(matched, total) {

    if (total === 0) return 0;

    return Math.round((matched / total) * 100);

}

// ===========================================
// RENDER RECIPE CARDS
// ===========================================

function renderRecipeCards(recipeList) {

    resultsContainer.innerHTML = "";

    recipeList.forEach(function (recipe) {

        const card = document.createElement("div");

        card.className = "recipe-card";

        const progress =
            getProgressWidth(
                recipe.available.length,
                recipe.total
            );

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

                <div class="match-section">

                    <div class="progress-bar">

                        <div
                            class="progress-fill"
                            style="width:${progress}%">
                        </div>

                    </div>

                    <p class="match-text">

                        ${recipe.available.length}
                        /
                        ${recipe.total}
                        Ingredients Matched

                    </p>

                </div>

                <div class="ingredient-group">

                    <h4>

                        ✓ You Have

                    </h4>

                    <div class="chip-container">

                        ${createIngredientChips(
                            recipe.available,
                            "available"
                        )}

                    </div>

                </div>

                <div class="ingredient-group">

                    <h4>

                        ✗ Need

                    </h4>

                    <div class="chip-container">

                        ${createIngredientChips(
                            recipe.missing,
                            "missing"
                        )}

                    </div>

                </div>

                <button
                    class="view-btn"
                    data-id="${recipe.id}">

                    View Recipe →

                </button>

        `;

        card.appendChild(content);

        resultsContainer.appendChild(card);

    });

    attachViewRecipeEvents();

}

// ===========================================
// VIEW RECIPE
// ===========================================

function attachViewRecipeEvents() {

    const buttons =
        document.querySelectorAll(".view-btn");

    buttons.forEach(function (button) {

        button.addEventListener("click", function () {

            window.location.href =
                "recipe.html?id=" + button.dataset.id;

        });

    });

}

// ===========================================
// CAPITALIZE
// ===========================================

function capitalize(word) {

    if (!word) return "";

    return word.charAt(0).toUpperCase() +
        word.slice(1);

}