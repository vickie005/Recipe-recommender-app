const getRecipesBtn = document.getElementById("getRecipes");
const budgetSlider = document.getElementById("budget");
const budgetValue = document.getElementById("budget-value");
const recipesContainer = document.getElementById("recipes");
const loadingDiv = document.getElementById("loading");
const errorDiv = document.getElementById("error");

// budget display
budgetSlider.addEventListener("input", () => {
  budgetValue.textContent = budgetSlider.value;
});

// Display recipes
function displayRecipes(recipes) {
  recipesContainer.innerHTML = "";
  recipes.forEach((r) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${r.image}" alt="${r.title}">
      <h3>${r.title}</h3>
      <p><strong>Ready in:</strong> ${r.readyInMinutes} minutes</p>
      <p><strong>Servings:</strong> ${r.servings}</p>
      <p><strong>Cost per serving:</strong> $${r.pricePerServing}</p>
      <a href="${r.sourceUrl}" target="_blank">View Recipe</a>
    `;
    recipesContainer.appendChild(card);
  });
}

// Handle button click
getRecipesBtn.addEventListener("click", async () => {
  const ingredients = document.getElementById("ingredients").value;
  const budget = budgetSlider.value;

  if (!ingredients.trim()) {
    errorDiv.textContent = "⚠️ Please enter at least one ingredient!";
    errorDiv.classList.remove("hidden");
    return;
  }

  errorDiv.classList.add("hidden");
  loadingDiv.classList.remove("hidden");

  try {
    const response = await fetch(
      `/search?ingredients=${encodeURIComponent(ingredients)}&budget=${budget}`
    );
    const data = await response.json();
    loadingDiv.classList.add("hidden");

    if (data.error) {
      errorDiv.textContent = `⚠️ ${data.error}`;
      errorDiv.classList.remove("hidden");
    } else {
      displayRecipes(data);
    }
  } catch (err) {
    loadingDiv.classList.add("hidden");
    errorDiv.textContent = "⚠️ Failed to fetch recipes. Please try again.";
    errorDiv.classList.remove("hidden");
  }
});
