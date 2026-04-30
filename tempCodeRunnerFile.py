@app.route("/")
def home():
    return render_template(
        "index.html",
        supabase_url=SUPABASE_URL,
        supabase_key=SUPABASE_KEY
    )