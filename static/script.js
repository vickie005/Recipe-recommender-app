const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const resultsContainer = document.getElementById("results");
const detailsContainer = document.getElementById("details");

// Handle form submit
searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();

  if (!query) return;

  resultsContainer.innerHTML = "<p>Loading recipes...</p>";
  detailsContainer.innerHTML = "";

  try {
    const res = await fetch(`http://127.0.0.1:5000/recipes?query=${query}`);
    const data = await res.json();

    if (data.results && data.results.length > 0) {
      displayRecipes(data.results);
    } else {
      resultsContainer.innerHTML = "<p>No recipes found.</p>";
    }
  } catch (error) {
    resultsContainer.innerHTML = "<p>Error fetching recipes.</p>";
    console.error(error);
  }
});

// Display recipe search results
function displayRecipes(recipes) {
  resultsContainer.innerHTML = "";

  recipes.forEach((recipe) => {
    const card = document.createElement("div");
    card.className = "recipe-card";

    card.innerHTML = `
      <img src="${recipe.image}" alt="${recipe.title}">
      <h3>${recipe.title}</h3>
      <button onclick="getRecipeDetails(${recipe.id})">View Details</button>
    `;

    resultsContainer.appendChild(card);
  });
}

// Fetch recipe details
async function getRecipeDetails(id) {
  detailsContainer.innerHTML = "<p>Loading details...</p>";

  try {
    const res = await fetch(`http://127.0.0.1:5000/recipes/${id}`);
    const recipe = await res.json();

    detailsContainer.innerHTML = `
      <h2>${recipe.title}</h2>
      <img src="${recipe.image}" alt="${recipe.title}">
      <h3>Ingredients</h3>
      <ul>
        ${recipe.extendedIngredients
          .map((ing) => `<li>${ing.original}</li>`)
          .join("")}
      </ul>
      <h3>Instructions</h3>
      <p>${recipe.instructions || "No instructions provided."}</p>
    `;
  } catch (error) {
    detailsContainer.innerHTML = "<p>Error loading recipe details.</p>";
    console.error(error);
  }
}
