// main.js
// Handles all homepage interactions:
// 1. Renders recipe cards from the static data in recipes.js
// 2. Tag pill clicks → fill the search input
// 3. Search button → basic alert placeholder (real search in Phase 2+)
// 4. Mobile hamburger menu toggle

// ─── 1. Render Recipe Cards ───────────────────────────────────────────────────

// Build one recipe card element and return it
function createRecipeCard(recipe) {
  const card = document.createElement("article");
  card.className = "recipe-card";

  card.innerHTML = `
    <div class="recipe-img-placeholder" role="img" aria-label="${recipe.name}">
      ${recipe.emoji}
    </div>
    <div class="recipe-body">
      <h3 class="recipe-name">${recipe.name}</h3>
      <div class="recipe-meta">
        <span class="meta-badge">⏱ ${recipe.time}</span>
        <span class="meta-badge">📊 ${recipe.difficulty}</span>
      </div>
    </div>
    <div class="recipe-footer">
      <button class="btn-view">View Recipe</button>
    </div>
  `;

  return card;
}

// Inject all recipe cards into the grid
function renderRecipes() {
  const grid = document.getElementById("recipesGrid");

  // Guard: stop if the grid element doesn't exist on the page
  if (!grid) return;

  popularRecipes.forEach(function(recipe) {
    const card = createRecipeCard(recipe);
    grid.appendChild(card);
  });
}

// ─── 2. Tag Pill → Fill Search Input ─────────────────────────────────────────

function setupTagPills() {
  const input = document.getElementById("ingredientInput");
  const pills = document.querySelectorAll(".tag-pill");

  pills.forEach(function(pill) {
    pill.addEventListener("click", function() {
      const ingredient = pill.getAttribute("data-ingredient");

      // If input is empty, just set the value
      // If input already has text, append with a comma
      if (input.value.trim() === "") {
        input.value = ingredient;
      } else {
        input.value = input.value.trim() + ", " + ingredient;
      }

      // Move cursor focus to input so the user can keep typing
      input.focus();
    });
  });
}

// ─── 3. Search Button ─────────────────────────────────────────────────────────

function setupSearch() {
  const searchBtn = document.getElementById("searchBtn");
  const input = document.getElementById("ingredientInput");

  // Helper: read the input, clean it up, and return a list of ingredients
  function getIngredients() {
    return input.value
      .split(",")
      .map(function(item) { return item.trim(); })
      .filter(function(item) { return item.length > 0; });
  }

  searchBtn.addEventListener("click", function() {
    const ingredients = getIngredients();

    if (ingredients.length === 0) {
      alert("Please enter at least one ingredient.");
      input.focus();
      return;
    }

    // Placeholder until Phase 2 (React) or Phase 3 (backend) is ready
    alert("Searching for recipes with: " + ingredients.join(", ") + "\n\n(Recipe search will be built in Phase 2)");
  });

  // Also trigger search when the user presses Enter inside the input
  input.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
      searchBtn.click();
    }
  });
}

// ─── 4. Mobile Hamburger Menu ─────────────────────────────────────────────────

function setupMobileMenu() {
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");

  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener("click", function() {
    mobileMenu.classList.toggle("open");
  });

  // Close the menu when any link inside it is clicked
  const menuLinks = mobileMenu.querySelectorAll("a");
  menuLinks.forEach(function(link) {
    link.addEventListener("click", function() {
      mobileMenu.classList.remove("open");
    });
  });
}

// ─── Init: run everything after the DOM is ready ─────────────────────────────

document.addEventListener("DOMContentLoaded", function() {
  renderRecipes();
  setupTagPills();
  setupSearch();
  setupMobileMenu();
});