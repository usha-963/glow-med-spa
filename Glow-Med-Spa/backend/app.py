
from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import pickle
from pathlib import Path
from datetime import datetime

app = Flask(__name__)
CORS(app)

# --------------------------------------------------
# CONFIGURATION
# --------------------------------------------------

DB_PATH = Path(__file__).with_name("glow_med_spa.db")
MODEL_PATH = Path(__file__).parent / "chatbot" / "trained_model.pkl"


# --------------------------------------------------
# LOAD TRAINED CHATBOT MODEL
# --------------------------------------------------

with open(MODEL_PATH, "rb") as file:
    saved_data = pickle.load(file)

chatbot_model = saved_data["model"]
chatbot_intents = saved_data["intents"]


# --------------------------------------------------
# CHATBOT RESPONSES
# --------------------------------------------------

CHATBOT_RESPONSES = {
    "greeting": "Hello! Welcome to Glow Med Spa. How can I help you today?",

    "services": "We offer facial treatments, skin rejuvenation and beauty consultations. Which service would you like to know more about?",

    "facial": "We offer facial treatments at Glow Med Spa. A consultation can help you understand which options may be appropriate for your needs.",

    "dry_skin": "Thanks for sharing your concern. We can help you explore skincare service options. A qualified skincare professional can assess your skin before recommending a treatment.",

    "oily_skin": "We understand your concern. Our team can discuss available skincare options with you. A professional consultation is recommended before choosing a treatment.",

    "acne": "We can discuss our available skincare services with you. For acne concerns, please consult a qualified skincare or medical professional before selecting a treatment.",

    "sensitive_skin": "Sensitive skin needs special attention. Please discuss your sensitivities with a qualified professional before choosing any treatment.",

    "rejuvenation": "We offer skin rejuvenation services. Contact our team to learn more about the available options.",

    "consultation": "A beauty consultation helps you discuss your skincare goals and understand available services. Would you like to request an appointment?",

    "pricing": "Our demo currently does not have a configured price list. Please contact the Glow Med Spa team for pricing information.",

    "hours": "Our demo currently does not have configured business hours. Please contact the Glow Med Spa team to confirm availability.",

    "location": "Our demo currently does not have a configured clinic address. Please contact the Glow Med Spa team for location details.",

    "booking": "You can request an appointment using our booking form. Would you like to book a visit?",

    "reschedule": "For appointment changes or cancellations, please contact the Glow Med Spa team so they can assist you.",

    "contact": "You can leave your contact details through our enquiry form, and the Glow Med Spa team can follow up.",

    "thanks": "You're welcome! Happy to help. Is there anything else you'd like to know?"
}


# --------------------------------------------------
# DATABASE CONNECTION
# --------------------------------------------------

def connect():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


# --------------------------------------------------
# INITIALIZE DATABASE
# --------------------------------------------------

def init_db():

    with connect() as conn:

        conn.execute('''
            CREATE TABLE IF NOT EXISTS appointments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT,
                service TEXT NOT NULL,
                date TEXT NOT NULL,
                time TEXT NOT NULL,
                notes TEXT,
                status TEXT NOT NULL DEFAULT 'New',
                created_at TEXT NOT NULL
            )
        ''')

        conn.execute('''
            CREATE TABLE IF NOT EXISTS leads (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                message TEXT,
                created_at TEXT NOT NULL
            )
        ''')


# --------------------------------------------------
# HEALTH CHECK API
# --------------------------------------------------

@app.get("/api/health")
def health():

    return jsonify({
        "ok": True,
        "service": "Glow Med Spa demo API"
    })


# --------------------------------------------------
# ML CHATBOT API
# --------------------------------------------------

@app.post("/api/chatbot")
def chatbot():

    data = request.get_json(silent=True) or {}

    message = str(data.get("message", "")).strip()

    if not message:
        return jsonify({
            "error": "Please enter a message."
        }), 400

    try:

        predicted_intent = chatbot_model.predict([message])[0]

        reply = CHATBOT_RESPONSES.get(
            predicted_intent,
            "Sorry, I couldn't understand that. Could you please rephrase your question?"
        )

        return jsonify({
            "ok": True,
            "message": message,
            "intent": predicted_intent,
            "reply": reply
        })

    except Exception:

        app.logger.exception("Chatbot prediction failed")

        return jsonify({
            "error": "The chatbot could not process your message."
        }), 500


# --------------------------------------------------
# CREATE APPOINTMENT + AUTOMATIC LEAD
# --------------------------------------------------


@app.post("/api/appointments")
def create_appointment():

    data = request.get_json(silent=True) or {}

    required = ["name", "email", "service", "date", "time"]

    missing = [
        field for field in required
        if not str(data.get(field, "")).strip()
    ]

    if missing:
        return jsonify({
            "error": "Please complete: " + ", ".join(missing)
        }), 400

    name = str(data["name"]).strip()
    email = str(data["email"]).strip()
    phone = str(data.get("phone", "")).strip()
    service = str(data["service"]).strip()
    date = str(data["date"]).strip()
    time = str(data["time"]).strip()
    notes = str(data.get("notes", "")).strip()

    created_at = datetime.utcnow().isoformat(timespec="seconds")

    with connect() as conn:
        cur = conn.execute('''
            INSERT INTO appointments
            (name, email, phone, service, date, time, notes, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            name,
            email,
            phone,
            service,
            date,
            time,
            notes,
            created_at
        ))

        appointment_id = cur.lastrowid

    return jsonify({
        "ok": True,
        "id": appointment_id,
        "message": "Your demo appointment request has been saved. This is not a confirmed real appointment."
    }), 201


    data = request.get_json(silent=True) or {}

    required = ["name", "email", "service", "date", "time"]

    missing = [
        field for field in required
        if not str(data.get(field, "")).strip()
    ]

    if missing:

        return jsonify({
            "error": "Please complete: " + ", ".join(missing)
        }), 400

    name = str(data["name"]).strip()
    email = str(data["email"]).strip()
    phone = str(data.get("phone", "")).strip()
    service = str(data["service"]).strip()
    date = str(data["date"]).strip()
    time = str(data["time"]).strip()
    notes = str(data.get("notes", "")).strip()

    created_at = datetime.utcnow().isoformat(timespec="seconds")

    # Save appointment and lead in one database transaction
    with connect() as conn:

        # Save appointment
        cur = conn.execute('''
            INSERT INTO appointments
            (name, email, phone, service, date, time, notes, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            name,
            email,
            phone,
            service,
            date,
            time,
            notes,
            created_at
        ))

        appointment_id = cur.lastrowid

        # Save customer as a lead
        lead_message = (
            f"Appointment enquiry | "
            f"Service: {service} | "
            f"Date: {date} | "
            f"Time: {time} | "
            f"Phone: {phone} | "
            f"Notes: {notes}"
        )

        conn.execute('''
            INSERT INTO leads
            (name, email, message, created_at)
            VALUES (?, ?, ?, ?)
        ''', (
            name,
            email,
            lead_message,
            created_at
        ))

    return jsonify({
        "ok": True,
        "id": appointment_id,
        "message": "Your demo appointment request has been saved. This is not a confirmed real appointment."
    }), 201


# --------------------------------------------------
# GET ALL APPOINTMENTS
# --------------------------------------------------

@app.get("/api/appointments")
def list_appointments():

    # Demo-only endpoint. Add authentication before real deployment.

    with connect() as conn:

        rows = conn.execute(
            "SELECT * FROM appointments ORDER BY created_at DESC"
        ).fetchall()

    return jsonify([dict(row) for row in rows])


# --------------------------------------------------
# UPDATE APPOINTMENT STATUS
# --------------------------------------------------

@app.patch("/api/appointments/<int:appointment_id>")
def update_appointment(appointment_id):

    data = request.get_json(silent=True) or {}

    status = data.get("status")

    allowed_statuses = [
        "New",
        "Contacted",
        "Confirmed",
        "Cancelled"
    ]

    if status not in allowed_statuses:

        return jsonify({
            "error": "Invalid status"
        }), 400

    with connect() as conn:

        cur = conn.execute(
            "UPDATE appointments SET status=? WHERE id=?",
            (status, appointment_id)
        )

        if cur.rowcount == 0:

            return jsonify({
                "error": "Appointment not found"
            }), 404

    return jsonify({
        "ok": True,
        "status": status
    })


# --------------------------------------------------
# DELETE APPOINTMENT
# --------------------------------------------------

@app.delete("/api/appointments/<int:appointment_id>")
def delete_appointment(appointment_id):

    try:

        with connect() as conn:

            cur = conn.execute(
                "DELETE FROM appointments WHERE id = ?",
                (appointment_id,)
            )

            if cur.rowcount == 0:

                return jsonify({
                    "error": "Appointment not found"
                }), 404

        return jsonify({
            "ok": True,
            "message": "Appointment deleted successfully"
        }), 200

    except Exception:

        app.logger.exception("Appointment deletion failed")

        return jsonify({
            "error": "Could not delete appointment."
        }), 500


# --------------------------------------------------
# CREATE LEAD
# --------------------------------------------------

@app.post("/api/leads")
def create_lead():

    data = request.get_json(silent=True) or {}

    name = str(data.get("name", "")).strip()
    email = str(data.get("email", "")).strip()

    if not name or not email:

        return jsonify({
            "error": "Name and email are required"
        }), 400

    message = str(data.get("message", "")).strip()

    with connect() as conn:

        cur = conn.execute(
            '''
            INSERT INTO leads
            (name, email, message, created_at)
            VALUES (?, ?, ?, ?)
            ''',
            (
                name,
                email,
                message,
                datetime.utcnow().isoformat(timespec="seconds")
            )
        )

        lead_id = cur.lastrowid

    return jsonify({
        "ok": True,
        "id": lead_id,
        "message": "Lead saved successfully."
    }), 201


# --------------------------------------------------
# GET ALL LEADS
# --------------------------------------------------

@app.get("/api/leads")
def list_leads():

    # Demo-only endpoint. Add authentication before real deployment.

    with connect() as conn:

        rows = conn.execute(
            "SELECT * FROM leads ORDER BY created_at DESC"
        ).fetchall()

    return jsonify([dict(row) for row in rows])


# --------------------------------------------------
# DELETE LEAD
# --------------------------------------------------

@app.delete("/api/leads/<int:lead_id>")
def delete_lead(lead_id):

    try:
        with connect() as conn:
            cur = conn.execute(
                "DELETE FROM leads WHERE id = ?",
                (lead_id,)
            )

            if cur.rowcount == 0:
                return jsonify({
                    "error": "Lead not found"
                }), 404

        return jsonify({
            "ok": True,
            "message": "Lead deleted successfully"
        }), 200

    except Exception:
        app.logger.exception("Lead deletion failed")

        return jsonify({
            "error": "Could not delete lead."
        }), 500


# --------------------------------------------------
# RUN FLASK SERVER
# --------------------------------------------------

if __name__ == "__main__":

    init_db()

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )
