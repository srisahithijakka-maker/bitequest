// ===========================================
// BiteQuest
// recipe.js
// Part 1 - Initialization & Load Recipe
// ===========================================


// ---------- ELEMENTS ----------

const recipeImage = document.getElementById("recipeImage");
const recipeName = document.getElementById("recipeName");
const recipeCategory = document.getElementById("recipeCategory");
const recipeArea = document.getElementById("recipeArea");
const ingredientsList = document.getElementById("ingredientsList");
const recipeInstructions = document.getElementById("recipeInstructions");
const youtubeLink = document.getElementById("youtubeLink");
const backButton = document.getElementById("backButton");
const saveFavourite = document.getElementById("saveFavourite");


// ---------- CONSTANTS ----------

const STORAGE_KEY = "bitequest_favourites";


// ---------- START ----------

document.addEventListener("DOMContentLoaded", () => {

    backButton.addEventListener("click", function () {
        window.history.back();
    });

    loadRecipe();

});


// ===========================================
// LOAD RECIPE
// ===========================================

async function loadRecipe() {

    try {

        const params = new URLSearchParams(window.location.search);

        const recipeId = params.get("id");

        if (!recipeId) {

            showError("Recipe not found.");

            return;

        }

        showLoading();

        const recipe = await getRecipeDetails(recipeId);

        if (!recipe) {

            showError("Recipe not found.");

            return;

        }

        displayBasicRecipeInfo(recipe);

        displayRecipe(recipe);

        setupFavouriteButton(recipe);

    }

    catch (error) {

        console.error(error);

        showError("Unable to load recipe. Please try again.");

    }

}


// ===========================================
// BASIC RECIPE DETAILS
// ===========================================

function displayBasicRecipeInfo(recipe) {

    // ---------- IMAGE ----------

    recipeImage.classList.remove("loaded");

    recipeImage.src = recipe.strMealThumb;

    recipeImage.alt = recipe.strMeal;

    recipeImage.onload = () => {

        recipeImage.classList.add("loaded");

    };


    // ---------- TITLE ----------

    recipeName.textContent = recipe.strMeal;


    // ---------- BADGES ----------

    recipeCategory.innerHTML = `
        <span class="badge">
            🍽 ${recipe.strCategory}
        </span>
    `;

    recipeArea.innerHTML = `
        <span class="badge">
            🌍 ${recipe.strArea}
        </span>
    `;


    // ---------- YOUTUBE ----------

    if (recipe.strYoutube && recipe.strYoutube.trim() !== "") {

        youtubeLink.href = recipe.strYoutube;

        youtubeLink.style.display = "inline-flex";

    }

    else {

        youtubeLink.style.display = "none";

    }

}



// ===========================================
// LOADING STATE
// ===========================================

function showLoading() {

    recipeName.textContent = "Loading Recipe...";

    ingredientsList.innerHTML = `
        <p class="loading-text">
            🥕 Loading ingredients...
        </p>
    `;

    recipeInstructions.innerHTML = `
        <p class="loading-text">
            👨‍🍳 Preparing recipe...
        </p>
    `;

}



// ===========================================
// ERROR STATE
// ===========================================

function showError(message) {

    recipeName.textContent = message;

    ingredientsList.innerHTML = "";

    recipeInstructions.innerHTML = `
        <p class="error-text">
            ${message}
        </p>
    `;

}

// ===========================================
// DISPLAY RECIPE
// ===========================================

function displayRecipe(recipe) {

    displayIngredients(recipe);

    displayInstructions(recipe);

}



// ===========================================
// INGREDIENTS
// ===========================================

function displayIngredients(recipe) {

    ingredientsList.innerHTML = "";

    for (let i = 1; i <= 20; i++) {

        const ingredient = recipe[`strIngredient${i}`];
        const measure = recipe[`strMeasure${i}`];

        if (
            ingredient &&
            ingredient.trim() !== ""
        ) {

            const chip = createIngredientChip(

                ingredient,
                measure

            );

            chip.style.animationDelay = `${i * 0.05}s`;

            ingredientsList.appendChild(chip);

        }

    }

}



// ===========================================
// CREATE INGREDIENT CHIP
// ===========================================

function createIngredientChip(ingredient, measure) {

    const chip = document.createElement("div");

    chip.className = "ingredient-chip";

    chip.innerHTML = `

        <span class="ingredient-name">

            ${ingredient}

        </span>

        <span class="ingredient-measure">

            ${measure || ""}

        </span>

    `;

    return chip;

}



// ===========================================
// INSTRUCTIONS
// ===========================================

function displayInstructions(recipe) {

    recipeInstructions.innerHTML = "";

    const steps = splitInstructions(

        recipe.strInstructions

    );

    if (steps.length === 0) {

        recipeInstructions.innerHTML = `

            <p>

                No instructions available.

            </p>

        `;

        return;

    }

    steps.forEach((step, index) => {

        const card = createStepCard(

            step,
            index + 1

        );

        card.style.animationDelay = `${index * 0.08}s`;

        recipeInstructions.appendChild(card);

    });

}



// ===========================================
// SPLIT INSTRUCTIONS
// ===========================================

function splitInstructions(text) {

    if (!text) return [];

    const lines = text
        .replace(/\r/g, "")
        .split("\n")
        .map(line => line.trim())
        .filter(line => line.length > 0);

    const numberedPattern = /^\d+\.\s*/;
    const stepPattern = /^Step\s*\d+\s*/i;

    const hasNumberedSections = lines.some(function (line) {
        return numberedPattern.test(line) || stepPattern.test(line);
    });

    if (!hasNumberedSections) {

        return text
            .split(/(?<=\.)\s+(?=[A-Z])/)
            .map(step => step.trim())
            .filter(step => step.length > 0);

    }

    const steps = [];
    let currentHeading = "";
    let currentBody = [];
    let waitingForHeading = false;

    lines.forEach(function (line) {

        const numberMatch = line.match(numberedPattern);
        const stepMatch = line.match(stepPattern);

        const isSection = numberMatch || stepMatch;

        if (isSection) {

            if (currentHeading || currentBody.length > 0) {
                steps.push(buildStepHtml(currentHeading, currentBody));
            }

            const marker = (numberMatch || stepMatch)[0];
            const rest = line.slice(marker.length).trim();

            if (rest) {

                currentHeading = rest;
                currentBody = [];
                waitingForHeading = false;

            } else {

                currentHeading = "";
                currentBody = [];
                waitingForHeading = true;

            }

        } else if (waitingForHeading) {

            currentHeading = line;
            waitingForHeading = false;

        } else {

            currentBody.push(line);

        }

    });

    if (currentHeading || currentBody.length > 0) {
        steps.push(buildStepHtml(currentHeading, currentBody));
    }

    return steps.length > 0 ? steps : [text];

}


// ===========================================
// BUILD STEP HTML
// ===========================================

function buildStepHtml(heading, body) {

    let html = "<strong>" + heading + "</strong>";

    if (body.length > 0) {

        html += body.map(function (line) {
            return "<p>• " + line + "</p>";
        }).join("");

    }

    return html;

}



// ===========================================
// STEP CARD
// ===========================================

function createStepCard(step, number) {

    const card = document.createElement("div");

    card.className = "step-card";

    card.innerHTML = `

        <div class="step-number">

            ${number}

        </div>

        <div class="step-content">

            ${step}

        </div>

    `;

    return card;

}



// ===========================================
// FAVOURITE BUTTON
// ===========================================

function setupFavouriteButton(recipe) {

    const recipeId = recipe.idMeal;

    let favourites = JSON.parse(
        localStorage.getItem(STORAGE_KEY)
    ) || [];

    let isFavourite = favourites.some(function (fav) {
        return fav.id === recipeId;
    });

    function updateButton() {

        if (isFavourite) {
            saveFavourite.textContent = "❤️ Saved";
        } else {
            saveFavourite.textContent = "🤍 Save Recipe";
        }

    }

    updateButton();

    saveFavourite.addEventListener("click", function () {

        if (isFavourite) {

            favourites = favourites.filter(function (fav) {
                return fav.id !== recipeId;
            });

        } else {

            favourites.push({
                id: recipeId,
                name: recipe.strMeal,
                image: recipe.strMealThumb,
                area: recipe.strArea,
                category: recipe.strCategory
            });

        }

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(favourites)
        );

        isFavourite = !isFavourite;

        updateButton();

    });

}


