// ---------- COMPARE INGREDIENTS ----------

function compareIngredients(userIngredients, recipeIngredients) {

    const normalizedUser = userIngredients.map(normalizeIngredient);

    const available = [];
    const missing = [];

    recipeIngredients.forEach(function (recipeIngredient) {

        const recipeItem = normalizeIngredient(recipeIngredient);

        const found = normalizedUser.some(function (userItem) {

            return (
                recipeItem.includes(userItem) ||
                userItem.includes(recipeItem)
            );

        });

        if (found) {
            available.push(recipeIngredient);
        } else {
            missing.push(recipeIngredient);
        }

    });

    return {
        available,
        missing
    };

}


// ---------- SORT RECIPES ----------

function sortRecipes(recipes) {

    return recipes.sort(function (a, b) {

        // More matching ingredients first
        if (b.available.length !== a.available.length) {
            return b.available.length - a.available.length;
        }

        // Then fewer missing ingredients
        if (a.missing.length !== b.missing.length) {
            return a.missing.length - b.missing.length;
        }

        // Alphabetical as final tie breaker
        return a.name.localeCompare(b.name);

    });

}


// ---------- FILTER RECIPES ----------

function shouldIncludeRecipe(recipe) {

    const blockedWords = [
        "beef",
        "pork",
        "lamb",
        "goat"
    ];

    const mealName = recipe.strMeal.toLowerCase();
    const category = (recipe.strCategory || "").toLowerCase();

    return !blockedWords.some(function (word) {

        return mealName.includes(word) ||
               category.includes(word);

    });

}


// ---------- RUN SEARCH ----------

async function runSearch(userIngredients) {

    // Remove duplicate user ingredients
    userIngredients = [...new Set(
        userIngredients.map(normalizeIngredient)
    )];


    // ---------------------------------------
    // Search every ingredient simultaneously
    // ---------------------------------------

    const searchResults = await Promise.all(

        userIngredients.map(function (ingredient) {
            return searchByIngredient(ingredient);
        })

    );


    // Merge

    let candidateMeals = [];

    searchResults.forEach(function (mealList) {

        candidateMeals = candidateMeals.concat(mealList);

    });


    // Remove duplicates

    candidateMeals = removeDuplicateRecipes(candidateMeals);


    // Limit number of detail requests

    candidateMeals = candidateMeals.slice(0, 30);


    // ---------------------------------------
    // Load recipe details simultaneously
    // ---------------------------------------

    const detailResults = await Promise.all(

        candidateMeals.map(function (meal) {
            return getRecipeDetails(meal.idMeal);
        })

    );


    const results = [];


    detailResults.forEach(function (recipe) {

        if (!recipe) return;

        // Remove unwanted recipes

        if (!shouldIncludeRecipe(recipe)) return;

        const recipeIngredients = getIngredients(recipe);

        const comparison = compareIngredients(
            userIngredients,
            recipeIngredients
        );


        // Ignore recipes with zero matches
        if (comparison.available.length === 0) {
            return;
        }


        results.push({

            id: recipe.idMeal,

            name: recipe.strMeal,

            image: recipe.strMealThumb,

            category: recipe.strCategory,

            area: recipe.strArea,

            instructions: recipe.strInstructions,

            youtube: recipe.strYoutube,

            ingredients: recipeIngredients,

            available: comparison.available,

            missing: comparison.missing,

            total: recipeIngredients.length

        });

    });


    return sortRecipes(results);

}