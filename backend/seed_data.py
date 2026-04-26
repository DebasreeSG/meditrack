import firebase_admin
from firebase_admin import credentials, db
from dotenv import load_dotenv
import os

# ============================================
# SETUP
# ============================================

load_dotenv()

cred = credentials.Certificate("firebase_config.json")
firebase_admin.initialize_app(cred, {
    "databaseURL": os.getenv("FIREBASE_URL")
})

# ============================================
# BLOOD BANK DATA
# ============================================

blood_banks = {
    "bank1": {
        "name": "Apollo Hospital Blood Bank",
        "address": "Salt Lake, Kolkata",
        "phone": "+919800000001",
        "lat": 22.5726,
        "lng": 88.3639,
        "stock": {
            "A+": 12, "A-": 3,
            "B+": 8,  "B-": 1,
            "O+": 15, "O-": 2,
            "AB+": 5, "AB-": 0
        }
    },
    "bank2": {
        "name": "SSKM Hospital Blood Bank",
        "address": "Park Street, Kolkata",
        "phone": "+919800000002",
        "lat": 22.5414,
        "lng": 88.3426,
        "stock": {
            "A+": 6,  "A-": 0,
            "B+": 11, "B-": 4,
            "O+": 9,  "O-": 1,
            "AB+": 3, "AB-": 2
        }
    },
    "bank3": {
        "name": "RG Kar Medical Blood Bank",
        "address": "Shyambazar, Kolkata",
        "phone": "+919800000003",
        "lat": 22.6088,
        "lng": 88.3713,
        "stock": {
            "A+": 0,  "A-": 2,
            "B+": 7,  "B-": 0,
            "O+": 4,  "O-": 3,
            "AB+": 1, "AB-": 0
        }
    },
    "bank4": {
        "name": "Medica Superspecialty Blood Bank",
        "address": "Mukundapur, Kolkata",
        "phone": "+919800000004",
        "lat": 22.5074,
        "lng": 88.3948,
        "stock": {
            "A+": 9,  "A-": 1,
            "B+": 5,  "B-": 3,
            "O+": 13, "O-": 0,
            "AB+": 7, "AB-": 1
        }
    },
    "bank5": {
        "name": "Fortis Hospital Blood Bank",
        "address": "Anandapur, Kolkata",
        "phone": "+919800000005",
        "lat": 22.5204,
        "lng": 88.4017,
        "stock": {
            "A+": 4,  "A-": 2,
            "B+": 9,  "B-": 1,
            "O+": 7,  "O-": 2,
            "AB+": 3, "AB-": 1
        }
    }
}

# ============================================
# DONOR DATA
# ============================================

donors = {
    "donor1": {
        "name": "Rahul Sharma",
        "bloodType": "O+",
        "phone": "+919800000010",
        "location": "Salt Lake, Kolkata",
        "available": True,
        "lastDonated": "3 months ago"
    },
    "donor2": {
        "name": "Priya Das",
        "bloodType": "A+",
        "phone": "+919800000011",
        "location": "Howrah, Kolkata",
        "available": True,
        "lastDonated": "5 months ago"
    },
    "donor3": {
        "name": "Amit Roy",
        "bloodType": "B+",
        "phone": "+919800000012",
        "location": "Dum Dum, Kolkata",
        "available": False,
        "lastDonated": "1 month ago"
    },
    "donor4": {
        "name": "Sneha Ghosh",
        "bloodType": "AB-",
        "phone": "+919800000013",
        "location": "Newtown, Kolkata",
        "available": True,
        "lastDonated": "4 months ago"
    },
    "donor5": {
        "name": "Vikram Singh",
        "bloodType": "O-",
        "phone": "+919800000014",
        "location": "Behala, Kolkata",
        "available": True,
        "lastDonated": "6 months ago"
    },
    "donor6": {
        "name": "Riya Banerjee",
        "bloodType": "A-",
        "phone": "+919800000015",
        "location": "Jadavpur, Kolkata",
        "available": True,
        "lastDonated": "2 months ago"
    },
    "donor7": {
        "name": "Sourav Mondal",
        "bloodType": "B-",
        "phone": "+919800000016",
        "location": "Barasat, Kolkata",
        "available": False,
        "lastDonated": "2 months ago"
    },
    "donor8": {
        "name": "Ananya Sen",
        "bloodType": "AB+",
        "phone": "+919800000017",
        "location": "Park Street, Kolkata",
        "available": True,
        "lastDonated": "7 months ago"
    }
}

# ============================================
# PUSH TO FIREBASE
# ============================================

def seed_database():
    print("🌱 Seeding Firebase database...")

    banks_ref = db.reference("/bloodbanks")
    banks_ref.set(blood_banks)
    print("✅ Blood banks seeded!")

    donors_ref = db.reference("/donors")
    donors_ref.set(donors)
    print("✅ Donors seeded!")

    print("🎉 Database seeded successfully!")

if __name__ == "__main__":
    seed_database()