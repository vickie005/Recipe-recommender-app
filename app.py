import os
import requests
from flask import Flask, render_template, request
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

API_KEY = os.getenv("SPOONACULAR_API_KEY")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/recipes")
def recipes():
    query = request.args.get("query")
    budget = request.args.get("budget", type=int, default=20)

    url = "https://api.spoonacular.com/recipes/complexSearch"
    params = {
        "query": query,
        "maxPrice": budget,
        "number": 5,
        "addRecipeInformation": True,
        "apiKey": API_KEY
    }

    try:
        response = requests.get(url, params=params)
        data = response.json()

        recipes = []
        if "results" in data:
            for r in data["results"]:
                recipes.append({
                    "title": r["title"],
                    "ingredients": ", ".join([i["name"] for i in r.get("extendedIngredients", [])]),
                    "cost": r.get("pricePerServing", 0) / 100,  # convert cents to dollars
                    "img": r.get("image", "https://via.placeholder.com/400")
                })

        return render_template("results.html", query=query, recipes=recipes)

    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    app.run(debug=True)
