// ===========================================
// BiteQuest - main.js
// Homepage interactions
// ===========================================


// ---------- PAGE ELEMENTS ----------

const searchForm = document.getElementById("searchForm");
const ingredientInput = document.getElementById("ingredientInput");

const quickItems = document.querySelectorAll(".quick-item");

const addIngredientBtn = document.getElementById("addIngredientBtn");
const searchPantryBtn = document.getElementById("searchPantryBtn");



// ---------- INITIALIZE ----------

document.addEventListener("DOMContentLoaded", function () {

    loadPantry();

});



// ===========================================
// SEARCH FORM
// ===========================================

searchForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const ingredients = ingredientInput.value.trim();

    if (ingredients === "") {

        alert("Please enter at least one ingredient.");

        ingredientInput.focus();

        return;

    }

    localStorage.setItem(

        "searchIngredients",

        ingredients

    );

    window.location.href = "results.html";

});



// ===========================================
// QUICK SEARCH
// ===========================================

quickItems.forEach(function (button) {

    button.addEventListener("click", function () {

        ingredientInput.value = button.dataset.value;

        ingredientInput.focus();

    });

});



// ===========================================
// ADD INGREDIENT
// ===========================================

addIngredientBtn.addEventListener("click", function () {

    const ingredient = prompt("Enter an ingredient:");

    if (ingredient === null) {
        return;
    }

    addIngredient(ingredient);

});



// ===========================================
// SEARCH USING PANTRY
// ===========================================

searchPantryBtn.addEventListener("click", function () {

    searchUsingPantry();

});