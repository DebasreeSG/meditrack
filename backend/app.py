# ============================================
# IMPORTS
# ============================================

from flask import Flask, jsonify, request
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, db
from dotenv import load_dotenv
from google import genai
import os

# ============================================
# SETUP
# ============================================

load_dotenv()

app = Flask(__name__)
CORS(app)

# ============================================
# FIREBASE INIT
# ============================================

cred = credentials.Certificate("firebase_config.json")
firebase_admin.initialize_app(cred, {
    "databaseURL": os.getenv("FIREBASE_URL")
})

# ============================================
# GEMINI INIT
# ============================================

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# ============================================
# BLOOD BANK ROUTES
# ============================================

# GET all blood banks
@app.route("/api/bloodbanks", methods=["GET"])
def get_bloodbanks():
    ref = db.reference("/bloodbanks")
    data = ref.get()
    return jsonify(data or {})

# GET blood banks by blood type
@app.route("/api/bloodbanks/<blood_type>", methods=["GET"])
def get_by_bloodtype(blood_type):
    ref = db.reference("/bloodbanks")
    all_banks = ref.get() or {}
    filtered = {
        k: v for k, v in all_banks.items()
        if v.get("stock", {}).get(blood_type, 0) > 0
    }
    return jsonify(filtered)

# UPDATE blood stock
@app.route("/api/bloodbanks/<bank_id>/stock", methods=["PUT"])
def update_stock(bank_id):
    data = request.json
    ref = db.reference(f"/bloodbanks/{bank_id}/stock")
    ref.update(data)
    return jsonify({"message": "Stock updated successfully"})

# ============================================
# DONOR ROUTES
# ============================================

# GET all donors
@app.route("/api/donors", methods=["GET"])
def get_donors():
    ref = db.reference("/donors")
    data = ref.get()
    return jsonify(data or {})

# GET donors by blood type
@app.route("/api/donors/<blood_type>", methods=["GET"])
def get_donors_by_type(blood_type):
    ref = db.reference("/donors")
    all_donors = ref.get() or {}
    filtered = {
        k: v for k, v in all_donors.items()
        if v.get("bloodType") == blood_type
        and v.get("available") == True
    }
    return jsonify(filtered)

# POST register new donor
@app.route("/api/donors", methods=["POST"])
def register_donor():
    data = request.json
    if not all(k in data for k in
        ["name", "phone", "bloodType"]):
        return jsonify({"error": "Missing fields"}), 400

    ref = db.reference("/donors")
    new_donor = ref.push({
        "name": data["name"],
        "phone": data["phone"],
        "bloodType": data["bloodType"],
        "location": data.get("location", "Unknown"),
        "available": True,
        "lastDonated": data.get("lastDonated", "Never")
    })
    return jsonify({
        "message": "Donor registered",
        "id": new_donor.key
    })

# PUT update donor availability
@app.route("/api/donors/<donor_id>", methods=["PUT"])
def update_donor(donor_id):
    data = request.json
    ref = db.reference(f"/donors/{donor_id}")
    ref.update(data)
    return jsonify({"message": "Donor updated successfully"})

# DELETE donor
@app.route("/api/donors/<donor_id>", methods=["DELETE"])
def delete_donor(donor_id):
    ref = db.reference(f"/donors/{donor_id}")
    ref.delete()
    return jsonify({"message": "Donor removed"})

# ============================================
# GEMINI EMERGENCY ADVICE
# ============================================

@app.route("/api/emergency", methods=["POST"])
def emergency_suggest():
    data = request.json
    blood_type = data.get("bloodType", "O+")
    location = data.get("location", "Kolkata")

    prompt = f"""
    There is a medical emergency in {location}.
    The patient urgently needs {blood_type} blood.
    Give a short, clear action plan in 3 bullet points
    for what the family should do right now.
    Keep it simple, calm and practical.
    """

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt
    )
    return jsonify({"advice": response.text})

# ============================================
# RUN
# ============================================

if __name__ == "__main__":
    app.run(debug=True, port=5000)