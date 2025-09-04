import os
from flask import Flask, render_template, request, jsonify
import requests
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

API_KEY = os.getenv("SPOONACULAR_API_KEY")
BASE_URL = "https://api.spoonacular.com/recipes/complexSearch"


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/search", methods=["GET"])
def search_recipes():
    ingredients = request.args.get("ingredients", "")
    budget = request.args.get("budget", 10, type=int)

    if not ingredients.strip():
        return jsonify({"error": "Please provide an ingredient"}), 400

    try:
        params = {
            "apiKey": API_KEY,
            "includeIngredients": ingredients,
            "number": 20,  
            "addRecipeInformation": True,
            "sort": "price"
        }

        response = requests.get(BASE_URL, params=params)
        response.raise_for_status()
        data = response.json()

        # debbugging
        print("Ingredients:", ingredients)
        print("Budget:", budget)
        print("API URL:", response.url)
        print("API Response keys:", data.keys())

        recipes = []
        for r in data.get("results", []):
            price_per_serving = r.get("pricePerServing", 0) / 100.0  # cents → dollars
            if price_per_serving <= budget:
                recipes.append({
                    "title": r.get("title"),
                    "image": r.get("image"),
                    "sourceUrl": r.get("sourceUrl"),
                    "readyInMinutes": r.get("readyInMinutes", "N/A"),
                    "servings": r.get("servings", "N/A"),
                    "pricePerServing": round(price_per_serving, 2)
                })

        if not recipes:
            return jsonify({"error": "No recipes found within your budget."}), 404

        return jsonify(recipes)

    except requests.exceptions.RequestException as e:
        return jsonify({"error": "Failed to fetch recipes", "details": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
