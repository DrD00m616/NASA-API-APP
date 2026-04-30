from flask import Flask, jsonify, render_template
from dotenv import load_dotenv
import os
import requests

load_dotenv()

app = Flask(__name__)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
NASA_API_KEY = os.getenv("NASA_API_KEY")


@app.route("/")
def home():
    return render_template(
        "index.html",
        supabase_url=SUPABASE_URL,
        supabase_key=SUPABASE_KEY
    )


@app.route("/apod")
def apod():
    
    try:
        if not NASA_API_KEY:
            return jsonify({"error": "NASA API key missing"}), 500

        url = f"https://api.nasa.gov/planetary/apod?api_key={NASA_API_KEY}"
        res = requests.get(url, timeout=5)

        if res.status_code != 200:
            return jsonify({
                "error": "NASA API failed",
                "status": res.status_code,
                "details": res.text
            }), 500

        return jsonify(res.json())

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/images")
def images():
    try:
        url = "https://images-api.nasa.gov/search?q=mars&media_type=image"

        res = requests.get(url, timeout=5)

        return jsonify(res.json())

    except Exception as e:
        print("ERROR:", e)
        return jsonify({"error": str(e)}), 500
    
@app.route("/events")
def events():
    try:
        url = "https://eonet.gsfc.nasa.gov/api/v3/events"
        res = requests.get(url, timeout=5)

        if res.status_code != 200:
            return jsonify({"error": "API failed"}), 500

        return jsonify(res.json())

    except Exception as e:
        print("ERROR:", e)
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5001)