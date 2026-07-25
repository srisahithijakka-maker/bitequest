// ===========================================
// BiteQuest - api.js
// Handles communication with TheMealDB API
// ===========================================

const BASE_URL = "https://www.themealdb.com/api/json/v1/1";


// ===========================================
// SEARCH RECIPES BY INGREDIENT
// ===========================================

async function searchByIngredient(ingredient) {

    try {

        const response = await fetch(
            `${BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`
        );

        const data = await response.json();

        return data.meals || [];

    } catch (error) {

        console.error("Error searching recipes:", error);

        return [];

    }

}



// ===========================================
// GET COMPLETE RECIPE DETAILS
// ===========================================

async function getRecipeDetails(id) {

    try {

        const response = await fetch(
            `${BASE_URL}/lookup.php?i=${id}`
        );

        const data = await response.json();

        if (!data.meals) {
            return null;
        }

        return data.meals[0];

    } catch (error) {

        console.error("Error loading recipe:", error);

        return null;

    }

}



// ===========================================
// EXTRACT INGREDIENTS
// Returns an array like:
// ["egg","milk","butter"]
// ===========================================

function getIngredients(recipe) {

    const ingredients = [];

    for (let i = 1; i <= 20; i++) {

        const ingredient = recipe[`strIngredient${i}`];

        if (
            ingredient &&
            ingredient.trim() !== ""
        ) {

            ingredients.push(
                ingredient.trim().toLowerCase()
            );

        }

    }

    return ingredients;

}



// ===========================================
// REMOVE DUPLICATE RECIPES
// Multiple ingredient searches may return
// the same recipe.
// ===========================================

function removeDuplicateRecipes(recipes) {

    const unique = [];
    const ids = new Set();

    recipes.forEach(function (recipe) {

        if (!ids.has(recipe.idMeal)) {

            ids.add(recipe.idMeal);

            unique.push(recipe);

        }

    });

    return unique;

}



// ===========================================
// NORMALIZE INGREDIENTS
// Helps match singular/plural words.
// ===========================================

function normalizeIngredient(word) {

    const map = {

        eggs: "egg",
        tomatoes: "tomato",
        onions: "onion",
        potatoes: "potato",
        chillies: "chilli",
        chilies: "chilli"

    };

    word = word.toLowerCase().trim();

    return map[word] || word;

}

