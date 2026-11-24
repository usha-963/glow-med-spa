
import { useEffect, useRef, useState } from "react";

import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  RotateCcw
} from "lucide-react";

const API =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

const SERVICES = [
  "Facial Treatments",
  "Skin Rejuvenation",
  "Beauty Consultation"
];

const STARTER_REPLIES = [
  "What services do you offer?",
  "How much does a facial cost?",
  "Book an appointment"
];

const initialMessage = {
  from: "bot",
  text: "Welcome to Glow Med Spa! ✨ I'm your virtual assistant. You can ask me about treatments, skincare services, pricing, consultations or appointments. How can I help you today?"
};

// ==========================================
// TYPEWRITER ANIMATION
// ==========================================

function TypewriterText({ text }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed("");

    let index = 0;

    const interval = setInterval(() => {
      index += 2;

      setDisplayed(text.slice(0, index));

      if (index >= text.length) {
        clearInterval(interval);
      }
    }, 18);

    return () => clearInterval(interval);
  }, [text]);

  return <>{displayed}</>;
}

// ==========================================
// NORMALIZE CUSTOMER MESSAGES
// ==========================================

function normalizeMessage(message) {
  return message
    .toLowerCase()
    .trim()
    .replace(/[.,!?;:]+/g, "")
    .replace(/\s+/g, " ");
}

// ==========================================
// SMALL TALK RECOGNITION
// ==========================================

function getSmallTalkReply(message) {
  const text = normalizeMessage(message);

  // Greetings
  const greetings = [
    "hi",
    "hii",
    "hiii",
    "hello",
    "hello there",
    "hey",
    "heyy",
    "heyyy",
    "hiya",
    "good morning",
    "good afternoon",
    "good evening",
    "good day",
    "hey there",
    "hi there"
  ];

  if (greetings.includes(text)) {
    return "Hello! 😊 Welcome to Glow Med Spa. What would you like to know about our services today?";
  }

  if (/^(how are you|how are u|how r u|how is it going)$/.test(text)) {
    return "I'm doing great, thank you for asking! ✨ I'm here to help you with Glow Med Spa services. How are you?";
  }

  // Thanks
  const thanks = [
    "thank you",
    "thank u",
    "thanks",
    "thanks a lot",
    "thank you so much",
    "thx",
    "tnx",
    "many thanks",
    "much appreciated",
    "appreciate it"
  ];

  if (thanks.includes(text)) {
    return "You're very welcome! 😊 Happy to help. Is there anything else you'd like to know?";
  }

  // Negative replies
  const negativeReplies = [
    "no",
    "nope",
    "nah",
    "not really",
    "nothing",
    "nothing else",
    "no thanks",
    "no thank you",
    "not now",
    "that's all",
    "thats all",
    "all good",
    "im good",
    "i am good"
  ];

  if (negativeReplies.includes(text)) {
    return "No problem! Thank you for visiting Glow Med Spa. Have a lovely day! ✨";
  }

  // Positive replies
  const positiveReplies = [
    "yes",
    "yeah",
    "yep",
    "yup",
    "sure",
    "okay",
    "ok",
    "okk",
    "alright",
    "all right",
    "got it",
    "understood",
    "sounds good",
    "perfect",
    "cool"
  ];

  if (positiveReplies.includes(text)) {
    return "Great! 😊 What would you like help with? You can ask me about our services, skincare treatments or appointments.";
  }

  // Farewell
  const farewells = [
    "bye",
    "goodbye",
    "see you",
    "see you later",
    "take care",
    "good night",
    "bye bye",
    "talk later"
  ];

  if (farewells.includes(text)) {
    return "Goodbye! ✨ Thank you for visiting Glow Med Spa. Take care and have a beautiful day!";
  }

  // Asking bot identity
  if (
    /^(who are you|what are you|are you a bot|are you a real person|are you human|are you an ai)$/.test(text)
  ) {
    return "I'm Glow Assistant, the virtual receptionist for Glow Med Spa! ✨ I can help answer questions about services, treatments, pricing and appointment requests.";
  }

  // Asking what the bot can do
  if (
    /^(what can you do|how can you help me|what do you know|help me|help)$/.test(text)
  ) {
    return "I can help you explore our facial treatments, skin rejuvenation services, beauty consultations, general pricing information and appointment requests. What would you like to explore?";
  }

  // Asking to repeat
  if (
    /^(repeat|repeat that|say again|say that again|can you repeat|can you repeat that|i didnt understand|i don't understand)$/.test(text)
  ) {
    return "Of course! 😊 Please tell me which part you'd like me to explain again, and I'll try to make it clearer.";
  }

  // Asking for more information
  if (
    /^(tell me more|more details|explain more|what else|anything else|go on|continue)$/.test(text)
  ) {
    return "Of course! I'd be happy to explain more. Are you interested in our services, facial treatments, skin rejuvenation or booking an appointment?";
  }

  // Asking whether the assistant is available
  if (
    /^(are you there|anyone there|are you available|can you hear me)$/.test(text)
  ) {
    return "Yes! I'm here and ready to help. 😊 What would you like to know?";
  }

  // Apologies
  if (
    /^(sorry|i am sorry|my apologies|oops)$/.test(text)
  ) {
    return "No worries at all! 😊 How can I help you?";
  }

  return null;
}

// ==========================================
// MAIN CHATBOT
// ==========================================

export default function Chatbot({ onBook }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([initialMessage]);

  const [bookingStep, setBookingStep] = useState(null);

  const [booking, setBooking] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    date: "",
    time: ""
  });

  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState(false);

  const messagesEndRef = useRef(null);

  // Scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages, open, typing]);

  function addBot(text) {
    setMessages((current) => [
      ...current,
      {
        from: "bot",
        text
      }
    ]);
  }

  function resetBooking() {
    setBooking({
      name: "",
      email: "",
      phone: "",
      service: "",
      date: "",
      time: ""
    });
  }

  // ==========================================
  // BOOKING START
  // ==========================================

  function startBooking() {
    resetBooking();

    setBookingStep("service");

    addBot(
      "Let's get your appointment request started. Which service are you interested in?"
    );

    if (onBook) {
      onBook();
    }
  }

  function cancelBooking() {
    setBookingStep(null);

    resetBooking();

    addBot(
      "No problem. Your appointment request was cancelled. You can ask me about treatments whenever you're ready."
    );
  }

  // ==========================================
  // FLASK ML API
  // ==========================================

  async function getMLReply(question) {
    const response = await fetch(`${API}/api/chatbot`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        message: question
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Chatbot request failed."
      );
    }

    return data;
  }

  async function askChatbot(question) {
    setTyping(true);

    try {
      const data = await getMLReply(question);

      addBot(data.reply);

    } catch (error) {
      console.error("Chatbot error:", error);

      addBot(
        error.message.includes("Failed to fetch")
          ? "I couldn't connect to the chatbot service. Please check that the Flask backend is running."
          : "Sorry, I couldn't process that question right now. Could you please try asking in another way?"
      );

    } finally {
      setTyping(false);
    }
  }

  // ==========================================
  // BOOKING SUBMISSION
  // ==========================================

  async function submitBooking(details) {
    setSending(true);

    try {
      const response = await fetch(
        `${API}/api/appointments`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            ...details,
            notes: "Requested through the website chatbot."
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "We couldn't save your request."
        );
      }

      setBookingStep(null);

      addBot(
        `Thank you, ${details.name}! ✨ Your appointment request has been saved (request #${data.id}). Our team needs to contact you to confirm availability. This is a demo, so no real appointment has been booked.`
      );

    } catch (error) {
      addBot(
        error.message.includes("Failed to fetch")
          ? "I couldn't connect to the booking service. Please make sure the Flask backend is running. Your details have not been submitted."
          : `Sorry, I couldn't save that request: ${error.message} Please try again.`
      );

      setBookingStep("retry");

    } finally {
      setSending(false);
    }
  }

  // ==========================================
  // CUSTOMER QUESTION DETECTION
  // ==========================================

  function isCustomerQuestion(value) {
    const text = value.trim().toLowerCase();

    const patterns = [
      /\?$/,
      /^(what|why|how|when|where|which|who)\b/,
      /^(can|could|would|should|do|does|did|is|are|will|may)\b/,
      /^(tell me|explain|i want to know|i would like to know)\b/
    ];

    return patterns.some((pattern) =>
      pattern.test(text)
    );
  }

  // ==========================================
  // BOOKING ANSWER PROCESSING
  // ==========================================

  async function processBookingAnswer(value) {
    const answer = value.trim();
    const lower = answer.toLowerCase();

    if (!answer) return;

    if (
      ["cancel", "stop booking", "never mind", "nevermind"].includes(lower) ||
      lower.startsWith("cancel ")
    ) {
      cancelBooking();
      return;
    }

    // SERVICE
    if (bookingStep === "service") {
      const aliases = [
        {
          service: "Facial Treatments",
          words: [
            "facial",
            "facials",
            "face treatment"
          ]
        },
        {
          service: "Skin Rejuvenation",
          words: [
            "skin",
            "rejuvenation",
            "skin treatment"
          ]
        },
        {
          service: "Beauty Consultation",
          words: [
            "consultation",
            "consult",
            "talk to specialist"
          ]
        }
      ];

      const service =
        SERVICES.find(
          (item) => item.toLowerCase() === lower
        ) ||
        aliases.find((item) =>
          item.words.some((word) =>
            lower.includes(word)
          )
        )?.service;

      if (!service) {
        addBot(
          "Please choose Facial Treatments, Skin Rejuvenation, or Beauty Consultation."
        );
        return;
      }

      setBooking((old) => ({
        ...old,
        service
      }));

      setBookingStep("name");

      addBot("Great choice! May I have your full name?");

      return;
    }

    // NAME
    if (bookingStep === "name") {
      if (answer.length < 2 || answer.includes("@")) {
        addBot("Please enter your full name.");
        return;
      }

      setBooking((old) => ({
        ...old,
        name: answer
      }));

      setBookingStep("email");

      addBot(
        "Thank you! What email address should the team use to contact you?"
      );

      return;
    }

    // EMAIL
    if (bookingStep === "email") {
      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(answer)) {
        addBot(
          "Please enter a valid email address, such as name@example.com."
        );
        return;
      }

      setBooking((old) => ({
        ...old,
        email: answer
      }));

      setBookingStep("phone");

      addBot(
        "What's the best phone number to reach you? Type 'skip' if you prefer not to share it."
      );

      return;
    }

    // PHONE
    if (bookingStep === "phone") {
      setBooking((old) => ({
        ...old,
        phone: lower === "skip" ? "" : answer
      }));

      setBookingStep("date");

      addBot(
        "What date would you prefer? Please use YYYY-MM-DD, for example 2026-12-05."
      );

      return;
    }

    // DATE
    if (bookingStep === "date") {
      if (
        !/^\d{4}-\d{2}-\d{2}$/.test(answer) ||
        Number.isNaN(
          Date.parse(`${answer}T00:00:00`)
        )
      ) {
        addBot(
          "Please enter the date in YYYY-MM-DD format."
        );
        return;
      }

      const chosen = new Date(
        `${answer}T00:00:00`
      );

      if (
        chosen.getFullYear() !== Number(answer.slice(0, 4)) ||
        chosen.getMonth() + 1 !== Number(answer.slice(5, 7)) ||
        chosen.getDate() !== Number(answer.slice(8, 10))
      ) {
        addBot(
          "That doesn't appear to be a valid calendar date. Please try again."
        );
        return;
      }

      const today = new Date();

      today.setHours(0, 0, 0, 0);

      if (chosen < today) {
        addBot(
          "That date is in the past. Please choose today or a future date."
        );
        return;
      }

      setBooking((old) => ({
        ...old,
        date: answer
      }));

      setBookingStep("time");

      addBot(
        "What time would you prefer? For example, 10:30 AM or 2:00 PM."
      );

      return;
    }

    // TIME
    if (bookingStep === "time") {
      const finalDetails = {
        ...booking,
        time: answer
      };

      setBooking(finalDetails);

      setBookingStep("submitting");

      addBot(
        "Thanks! I'm saving your appointment request now…"
      );

      await submitBooking(finalDetails);

      return;
    }

    // RETRY
    if (bookingStep === "retry") {
      if (
        lower.includes("retry") ||
        lower.includes("yes")
      ) {
        setBookingStep("time");

        addBot(
          "Let's try again. Please confirm your preferred time."
        );

      } else {
        setBookingStep(null);

        addBot(
          "Okay. You can try booking again whenever you're ready."
        );
      }
    }
  }

  // ==========================================
  // MAIN SEND FUNCTION
  // ==========================================

  async function send(text = input) {
    const value = text.trim();

    if (!value || sending || typing) return;

    setMessages((current) => [
      ...current,
      {
        from: "user",
        text: value
      }
    ]);

    setInput("");

    const lower = normalizeMessage(value);

    // Cancel booking
    if (
      bookingStep &&
      [
        "cancel",
        "cancel booking",
        "stop booking",
        "never mind",
        "nevermind"
      ].includes(lower)
    ) {
      cancelBooking();
      return;
    }

    // Questions during booking
    if (
      bookingStep &&
      isCustomerQuestion(value)
    ) {
      await askChatbot(value);
      return;
    }

    // Continue booking
    if (bookingStep) {
      await processBookingAnswer(value);
      return;
    }

    // Booking shortcuts
    if (
      [
        "book",
        "book an appointment",
        "appointment",
        "yes book an appointment",
        "start booking",
        "book now"
      ].includes(lower)
    ) {
      startBooking();
      return;
    }

    // Recognize small talk BEFORE using ML
    const smallTalkReply = getSmallTalkReply(value);

    if (smallTalkReply) {
      addBot(smallTalkReply);
      return;
    }

    // Everything else goes to the ML model
    await askChatbot(value);
  }

  // ==========================================
  // QUICK REPLIES
  // ==========================================

  const quickReplies =
    bookingStep === "service"
      ? SERVICES
      : bookingStep === "phone"
      ? ["Skip"]
      : bookingStep === "retry"
      ? ["Retry", "Cancel"]
      : bookingStep
      ? ["Cancel booking"]
      : STARTER_REPLIES;

  // ==========================================
  // UI
  // ==========================================

  return (
    <>
      {open && (
        <aside
          className="chat-window"
          aria-label="Glow Med Spa chat"
        >
          {/* HEADER */}

          <div className="chat-head">
            <div className="chat-avatar">
              <Sparkles size={19} />
            </div>

            <div className="chat-head-copy">
              <b>Glow Assistant</b>

              <span>
                <i className="chat-online-dot" />
                Virtual receptionist · Online
              </span>
            </div>

            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* CHAT MESSAGES */}

          <div
            className="chat-messages"
            aria-live="polite"
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`chat-bubble ${message.from}`}
              >
                {message.from === "bot" ? (
                  <TypewriterText text={message.text} />
                ) : (
                  message.text
                )}
              </div>
            ))}

            {typing && (
              <div className="chat-bubble bot chat-typing">
                Thinking
                <span className="typing-dots">...</span>
              </div>
            )}

            {sending && (
              <div className="chat-bubble bot chat-typing">
                Saving your request…
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* SUGGESTED QUESTIONS */}

          <div
            className="quick-replies"
            aria-label="Suggested questions"
          >
            {quickReplies.map((reply) => (
              <button
                key={reply}
                type="button"
                disabled={sending || typing}
                onClick={() => send(reply)}
              >
                {reply}
              </button>
            ))}
          </div>

          {/* MESSAGE INPUT */}

          <form
            className="chat-input"
            onSubmit={(event) => {
              event.preventDefault();
              send();
            }}
          >
            <input
              value={input}
              onChange={(event) =>
                setInput(event.target.value)
              }
              placeholder={
                bookingStep
                  ? "Ask a question or type your answer..."
                  : "Ask us anything..."
              }
              aria-label="Type a message"
              disabled={
                sending ||
                typing ||
                bookingStep === "submitting"
              }
            />

            <button
              type="submit"
              aria-label="Send message"
              disabled={
                !input.trim() ||
                sending ||
                typing
              }
            >
              <Send size={17} />
            </button>
          </form>

          {/* FOOTER BUTTONS */}

          <div className="chat-footer-actions">
            <button
              className="chat-book"
              onClick={startBooking}
              disabled={
                Boolean(bookingStep) ||
                sending ||
                typing
              }
            >
              Request an appointment
            </button>

            <button
              className="chat-reset"
              title="Restart conversation"
              onClick={() => {
                setMessages([initialMessage]);
                setBookingStep(null);
                resetBooking();
                setInput("");
              }}
            >
              <RotateCcw size={14} />
            </button>
          </div>

          {/* DISCLAIMER */}

          <p className="chat-disclaimer">
            Free automated demo · No paid AI API ·
            Not medical advice · Requests require clinic confirmation
          </p>
        </aside>
      )}

      {/* CHAT LAUNCHER */}

      <button
        className="chat-launcher"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? <X /> : <MessageCircle />}

        {!open && (
          <span>Chat with us</span>
        )}
      </button>
    </>
  );
}
