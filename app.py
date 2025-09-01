from flask import Flask, jsonify, request
import requests
import mysql.connector

app = Flask(__name__)

# --- Database Connection ---
db = mysql.connector.connect(
    host="localhost",        
    user="root",             
    password="ML@engineer1",
    database="reciperec_db"
)
cursor = db.cursor(dictionary=True)

# --- Home Route ---
@app.route('/')
def home():
    return jsonify({"message": "Welcome to Recipe Recommender API!"})

# --- Search Recipes by Ingredient ---
@app.route('/search')
def search_recipes():
    ingredient = request.args.get('ingredient')
    if not ingredient:
        return jsonify({"error": "Please provide an ingredient"}), 400

    url = f"https://www.themealdb.com/api/json/v1/1/filter.php?i={ingredient}"
    response = requests.get(url)
    data = response.json()

    # Save query to DB
    cursor.execute(
        "INSERT INTO queries (ingredients, budget) VALUES (%s, %s)",
        (ingredient, 0.0)  # default budget for now
    )
    db.commit()
    query_id = cursor.lastrowid

    # Save meals into DB
    if data["meals"]:
        for meal in data["meals"]:
            cursor.execute(
                "INSERT INTO recipes (query_id, title, ingredients_list, steps, estimated_cost) VALUES (%s, %s, %s, %s, %s)",
                (query_id, meal["strMeal"], "N/A", "N/A", 0.0) # just storing basics for now
            )
        db.commit()

    return jsonify(data)

# --- Filter Recipes by Category ---
@app.route('/category')
def by_category():
    category = request.args.get('c')
    if not category:
        return jsonify({"error": "Please provide a category"}), 400

    url = f"https://www.themealdb.com/api/json/v1/1/filter.php?c={category}"
    response = requests.get(url)
    return jsonify(response.json())

# --- Get Recipe Details (ingredients + instructions) ---
@app.route('/meal/<meal_id>')
def meal_details(meal_id):
    url = f"https://www.themealdb.com/api/json/v1/1/lookup.php?i={meal_id}"
    response = requests.get(url)
    return jsonify(response.json())

if __name__ == '__main__':
    app.run(debug=True)
