// ===========================================
// BiteQuest - pantry.js
// Handles all pantry operations
// ===========================================


// ---------- STORAGE KEY ----------

const PANTRY_KEY = "bitequest_pantry";


// ---------- GET PANTRY ----------

function getPantry() {

    const pantry = localStorage.getItem(PANTRY_KEY);

    if (pantry === null) {
        return [];
    }

    return JSON.parse(pantry);

}



// ---------- SAVE PANTRY ----------

function savePantry(pantry) {

    localStorage.setItem(

        PANTRY_KEY,

        JSON.stringify(pantry)

    );

}



// ---------- LOAD PANTRY ----------

function loadPantry() {

    const pantryList = document.getElementById("pantryList");

    if (!pantryList) {
        return;
    }

    pantryList.innerHTML = "";

    const pantry = getPantry();

    if (pantry.length === 0) {

        pantryList.innerHTML = `
            <li class="empty">
                Your pantry is empty.
            </li>
        `;

        return;
    }

    pantry.forEach(function (ingredient, index) {

        const item = document.createElement("li");

        item.innerHTML = `

            <span>

                ${capitalize(ingredient)}

            </span>

            <button
                class="delete-btn"
                data-index="${index}">

                ×

            </button>

        `;

        pantryList.appendChild(item);

    });

    attachDeleteEvents();

}



// ---------- ADD INGREDIENT ----------

function addIngredient(name) {

    name = name.trim().toLowerCase();

    if (name === "") {
        return;
    }

    let pantry = getPantry();

    // prevent duplicates
    if (pantry.includes(name)) {

        alert("Ingredient already exists.");

        return;

    }

    pantry.push(name);

    pantry.sort();

    savePantry(pantry);

    loadPantry();

}



// ---------- REMOVE INGREDIENT ----------

function removeIngredient(index) {

    let pantry = getPantry();

    pantry.splice(index, 1);

    savePantry(pantry);

    loadPantry();

}



// ---------- SEARCH USING PANTRY ----------

function searchUsingPantry() {

    const pantry = getPantry();

    if (pantry.length === 0) {

        alert("Add ingredients to your pantry first.");

        return;

    }

    localStorage.setItem(

        "searchIngredients",

        pantry.join(",")

    );

    window.location.href = "results.html";

}



// ---------- DELETE EVENTS ----------

function attachDeleteEvents() {

    const buttons = document.querySelectorAll(".delete-btn");

    buttons.forEach(function (button) {

        button.addEventListener("click", function () {

            const index = Number(button.dataset.index);

            removeIngredient(index);

        });

    });

}



// ---------- CAPITALIZE ----------

function capitalize(word) {

    return word.charAt(0).toUpperCase() + word.slice(1);

}