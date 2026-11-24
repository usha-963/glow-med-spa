# Glow Med Spa — Nexora AI Portfolio Demo

A fictional Med Spa website built with React + Vite, Flask and SQLite. Includes a responsive landing page, service cards, a free local FAQ-matching chatbot, a consultation request form and a small demo API.

## Included features

- Responsive navigation with working section links and mobile menu
- Hero CTA and multiple consultation buttons
- Three service cards using the generated Glow Med Spa images
- Free text-question chatbot with flexible phrase matching, follow-up answers, suggested questions and a booking CTA
- No Gemini, OpenAI, or other paid AI API is used for chat replies
- Appointment request modal with required-field validation
- Flask API saves appointment requests to SQLite
- Demo endpoints to list and update appointment status
- Lead capture API endpoint
- No paid services or API keys required for local demo use

## Requirements

- Node.js 18 or newer
- Python 3.10 or newer

## 1. Start the backend

Open a terminal:

```bash
cd Glow-Med-Spa/backend
python -m venv venv
```

Activate the environment:

**Windows PowerShell**
```powershell
.\venv\Scripts\Activate.ps1
```

**macOS/Linux**
```bash
source venv/bin/activate
```

Install and run:

```bash
pip install -r requirements.txt
python app.py
```

The API runs at `http://127.0.0.1:5000`.

Check it in your browser:
`http://127.0.0.1:5000/api/health`

## 2. Start the frontend

Open a second terminal:

```bash
cd Glow-Med-Spa/frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal, usually `http://localhost:5173`.

## 3. Test the functions

1. Click navigation links to scroll to sections.
2. Click any “Book” button to open the consultation form.
3. Submit a demo appointment with a name, email, date and time.
4. The backend stores it in `backend/glow_med_spa.db`.
5. Open `http://127.0.0.1:5000/api/appointments` to view saved demo appointments.
6. Open the chatbot at the bottom-right and type questions in your own words (for example, “How much does a facial cost?”, “What happens during a consultation?”, or “Do you offer Botox?”), ask a follow-up such as “Tell me more”, or use the suggested questions. FAQ replies run locally in the browser; appointment saving still uses the Flask backend.
7. Optional: from the frontend folder, run `npm run test:chatbot` to test the local FAQ matching without installing any extra packages.

## Important demo limitations

- The chatbot uses local phrase/keyword matching, not a generative AI model. It has no per-message API fee, but it cannot reliably answer every novel question. Unknown questions receive a transparent fallback response.
- Appointment requests are stored as requests only. There is no live availability check, calendar sync, email/SMS delivery or automatic confirmation.
- The appointments/leads list endpoints have no authentication and are for local demonstration only. Do not deploy them publicly with real customer data.
- This is a fictional portfolio demo, not a real medical provider. Do not enter real patient data or sensitive health information.
- Before using this for a real clinic, add authentication, authorization, input hardening, privacy/security controls, consent, verified business details, and an actual calendar/email/SMS integration.

## Project structure

```text
Glow-Med-Spa/
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Chatbot.jsx
│   │   │   └── chatKnowledge.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── index.html
│   ├── package.json
│   ├── test-chatbot.mjs
│   └── vite.config.js
├── backend/
│   ├── app.py
│   └── requirements.txt
└── README.md
```

## Chatbot features

The website chatbot is a free local FAQ-matching virtual receptionist (no AI API key or external AI service required). Visitors can type questions in their own words. It matches phrases and keywords against a curated demo knowledge base, supports selected follow-up questions, and answers FAQs about services, pricing, opening hours, location, rescheduling and general safety. It does not generate unrestricted answers like a generative AI model, and it must not invent details that have not been configured. The guided flow collects service, name, email, optional phone, preferred date and preferred time, then sends the request to `POST /api/appointments` in the Flask backend. Requests are saved in the local SQLite database. The chat clearly tells visitors that requests are not confirmed real appointments.

To use chatbot appointment saving, start the Flask backend (`python app.py`) as well as the Vite frontend (`npm run dev`). If the backend is not running, the chatbot will explain that it could not submit the request.
