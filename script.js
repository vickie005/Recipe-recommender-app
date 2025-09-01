const getRecipesBtn = document.getElementById('getRecipes');
const budgetSlider = document.getElementById("budget");
const budgetValue = document.getElementById("budget value");
const recipesContainer = document.getElementById("recipes");
const loadingDiv = document.getElementById("loading");
const errorDiv = document.getElementById("error");

// Update budget display
budgetSlider.addEventListener('input', () => {
  budgetValue.textContent = budgetSlider.value;
});

//demo data
const sampleRecipes = [
  { title: "Chicken Tomato Stew", ingredients: "Chicken, Tomatoes, Onions", cost: 12, img: "https://source.unsplash.com/400x300/?chicken,stew"},
  { title: "Vegetable Rice Bowl", ingredients: "Rice, Carrots, Beans", cost: 8, img: "https://source.unsplash.com/400x300/?vegetables,rice" },
  { title: "Eggplant Pasta", ingredients: "Pasta, Eggplant, Garlic", cost: 15, img: "https://source.unsplash.com/400x300/?pasta,eggplant" }
];

// Display recipes
function displayRecipes(recipes) {
  recipesContainer.innerHTML = "";
  let found = false;

  recipes.forEach(r => {
    if (r, cost <= budgetSlider.value) {
      found = true;
      const card = document.createElement{ "div"};
      card.className = "card";
      card.innerHTML = `
        <h3>${r.title}</h3>
        <p><strong>Ingredients:</strong>${r.ingredients}</p>
        <p><strong>Estimate Cost:</strong>$${r.cost}</p>
      `;
      recipesContainer.appendChild(card);
    }
  });

  // Handle error message
  if (!found) {
    errorDiv.classList.remove("hidden");
  } else {
    errorDiv.classList.add("hidden");
  }
}

// Handle button click
getRecipesBtn.addEventListener("click", () => {
  displayRecipes(sampleRecipes);
});

// Show loading
loadingDiv.classList.remove("hidden");

// Simulate API delay
setTimeout(() => {
  loadingDiv.classList.add("hidden");
  displayRecipes(sampleRecipes);
}, 1500);
