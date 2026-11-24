// Free, local FAQ matching for the Glow Med Spa demo.
// This does not call an AI provider, external API, or paid service.

const knowledge = [
  {
    intent: "greeting",
    phrases: ["hi", "hello", "hey", "good morning", "good afternoon", "good evening", "how are you"],
    keywords: ["hello", "hi", "hey", "greetings"],
    answer: "Hello and welcome to Glow Med Spa! ✨ I'm happy to help. You can ask me about our treatments, consultation process, appointment requests, prices, opening hours, or location.",
    more: "I can explain the three services shown on this demo website and help you send an appointment request. What would you like to explore?"
  },
  {
    intent: "services",
    phrases: ["what services do you offer", "what treatments do you have", "list your services", "tell me about your treatments", "what can i get done", "services available"],
    keywords: ["service", "services", "treatment", "treatments", "facial", "skin rejuvenation", "consultation"],
    answer: "Glow Med Spa's demo currently showcases three services:\n\n• Facial Treatments — personalized facial experiences designed to refresh the skin.\n• Skin Rejuvenation — skincare options focused on smoother, healthier-looking skin.\n• Beauty Consultation — a conversation about your skincare goals and possible options.\n\nA qualified professional should assess suitability before any real treatment.",
    more: "Facial Treatments focus on a facial-care experience; Skin Rejuvenation describes broader skincare options; and a Beauty Consultation is a chance to discuss your goals with a specialist. The exact treatments available at a real clinic would need to be confirmed by that clinic."
  },
  {
    intent: "facial",
    phrases: ["what is a facial", "tell me about facials", "facial treatment", "facial for dry skin", "facial for oily skin", "facial for acne", "deep cleansing facial"],
    keywords: ["facial", "cleanse", "cleansing", "dry skin", "oily skin", "acne"],
    answer: "Our demo describes Facial Treatments as personalized facial experiences designed to refresh your skin and enhance your natural glow. The right facial depends on your skin and goals, so please discuss any dryness, acne, sensitivity, allergies, or active skin condition with a qualified skincare professional before choosing a treatment.",
    more: "Before a facial, you can ask the clinic about the products used, expected downtime, preparation, aftercare, and whether the treatment is suitable for your skin. I can't assess your skin or recommend a specific procedure."
  },
  {
    intent: "rejuvenation",
    phrases: ["what is skin rejuvenation", "tell me about skin rejuvenation", "skin rejuvenation treatment", "smoother skin", "fine lines", "wrinkles"],
    keywords: ["rejuvenation", "fine line", "wrinkle", "texture", "smooth skin", "glow"],
    answer: "Skin Rejuvenation is presented on our demo as skincare options designed to support smoother, healthier-looking skin. The exact methods, expected results, risks, and recovery time depend on the treatment. A qualified clinician can explain which options, if any, are appropriate for you.",
    more: "It's worth asking the clinic which specific procedure they mean by skin rejuvenation, how many sessions may be suggested, what results are realistic, and what side effects or downtime to expect."
  },
  {
    intent: "consultation",
    phrases: ["what happens during consultation", "what happens during a consultation", "how does consultation work", "do i need consultation", "can i talk to specialist", "speak to someone", "talk to a professional"],
    keywords: ["consultation", "specialist", "professional", "clinician", "assessment"],
    answer: "A beauty consultation is an opportunity to discuss your skincare goals, questions, and preferences with the clinic team. For a real treatment, a qualified professional should review relevant health and skin information, explain options and risks, and answer your questions before you decide.",
    more: "You may want to prepare questions about treatment suitability, products, pricing, expected results, risks, downtime, and aftercare. You can use the appointment request option to ask the team to contact you."
  },
  {
    intent: "pricing",
    phrases: ["how much does it cost", "how much does a facial cost", "how much does facial treatment cost", "how much is a facial", "what are your prices", "send me price list", "do you have a price list", "how much do treatments cost", "what is the fee", "how much for a facial", "what is the facial price"],
    keywords: ["price", "pricing", "cost", "fee", "expensive", "payment", "pay", "price list", "discount"],
    answer: "Thanks for asking! Glow Med Spa is a portfolio demo and doesn't have an approved price list. I don't want to give you an inaccurate price. Please send an appointment enquiry and the clinic team can share current pricing.",
    more: "Prices for real med spa services can vary by provider, treatment type, location, and number of sessions. Ask for the full price, any consultation fee, and whether follow-up visits or aftercare products cost extra."
  },
  {
    intent: "hours",
    phrases: ["what time do you open", "what time do you close", "are you open today", "are you open on sunday", "are you open on saturday", "do you have weekend appointments", "are appointments available on weekends", "weekend hours", "opening hours"],
    keywords: ["hour", "hours", "open", "opening", "close", "closing", "saturday", "sunday", "weekend", "weekday", "today", "tomorrow"],
    answer: "The opening hours haven't been configured for this demo yet, so I can't confirm when the clinic is open. You can send your preferred date and time in an appointment request and the team can follow up.",
    more: "I don't have a live business-hours calendar connected. Please wait for the clinic team to confirm the requested time before making travel plans."
  },
  {
    intent: "location",
    phrases: ["where are you located", "what is your address", "how can i find you", "where is the clinic", "which city are you in", "do you have parking"],
    keywords: ["location", "address", "located", "directions", "map", "parking", "clinic", "where"],
    answer: "Glow Med Spa is currently a fictional portfolio demo, so a real clinic address, directions, and parking details have not been added. These should be replaced with the client's verified business information before launch.",
    more: "For the live client website, we can add the verified street address, map, parking information, and public-transport details once the clinic supplies them."
  },
  {
    intent: "booking",
    phrases: ["i want to book", "book an appointment", "make an appointment", "schedule a visit", "can i book", "appointment availability", "request an appointment", "reserve a time"],
    keywords: ["book", "booking", "appointment", "schedule", "reserve", "availability", "visit"],
    answer: "Of course! I can collect an appointment request for the clinic team. Use the ‘Request an appointment’ button below, or type ‘start booking’ and I'll guide you through it. Please note that a request is not a confirmed appointment.",
    more: "I'll ask which service you're interested in, your name and contact details, and your preferred date and time. The clinic team must confirm availability separately."
  },
  {
    intent: "reschedule",
    phrases: ["change my appointment", "reschedule my appointment", "move my booking", "cancel my appointment", "change the date", "change the time"],
    keywords: ["reschedule", "cancel", "change appointment", "move booking", "different date", "different time"],
    answer: "I can explain the process, but this demo isn't connected to a live appointment calendar. Please contact the clinic team directly with the name and date on your existing request so they can help change or cancel it.",
    more: "No appointment is confirmed by this demo, and I can't edit an existing booking automatically. The clinic team needs to verify the request."
  },
  {
    intent: "contact",
    phrases: ["can i speak to a human", "talk to a real person", "contact the clinic", "call me", "customer support", "speak with staff", "talk to receptionist"],
    keywords: ["human", "person", "staff", "receptionist", "contact", "phone", "call", "email", "support", "representative"],
    answer: "Certainly. This demo doesn't have live staff chat or a configured phone number yet. You can submit an appointment enquiry with your contact details and the clinic team can follow up once their contact information is connected.",
    more: "For a real client launch, we'll add the clinic's verified phone number, email address, and preferred contact hours here."
  },
  {
    intent: "safety",
    phrases: ["is it safe", "side effects", "i have sensitive skin", "i am pregnant", "i take medication", "skin reaction", "allergic reaction", "what treatment is best for me", "what do you recommend for my skin"],
    keywords: ["safe", "safety", "side effect", "risk", "sensitive", "allergy", "allergic", "pregnant", "medication", "medicine", "diagnose", "diagnosis", "recommend", "best for me", "reaction", "eczema", "rosacea", "infection"],
    answer: "I can share general service information, but I can't assess skin conditions, diagnose a concern, or recommend a medical or cosmetic procedure. Please discuss your skin history, allergies, medicines, pregnancy status, and any active condition with a qualified clinician before treatment. If you have a severe or sudden reaction, seek urgent medical care.",
    more: "Before proceeding, ask the clinician about contraindications, possible side effects, alternatives, expected downtime, and aftercare. You should never feel pressured to proceed with a treatment."
  },
  {
    intent: "botox_fillers_laser",
    phrases: ["do you offer botox", "do you do fillers", "do you offer laser hair removal", "do you do microneedling", "do you offer chemical peels"],
    keywords: ["botox", "botulinum", "filler", "fillers", "laser", "microneedling", "chemical peel", "peel", "injectable", "injection"],
    answer: "That specific service isn't listed in this Glow Med Spa demo, so I can't confirm whether the clinic offers it. Please ask the clinic team directly. Any injectable, laser, peel, or other medical-aesthetic procedure should be discussed with an appropriately qualified professional.",
    more: "Before choosing a procedure, verify the provider's qualifications, the exact product or device used, risks, alternatives, and aftercare."
  },
  {
    intent: "thanks",
    phrases: ["thank you", "thanks", "thats helpful", "that helps", "great thanks", "perfect"],
    keywords: ["thanks", "thank you", "appreciate"],
    answer: "You're very welcome! ✨ Is there anything else you'd like to know about Glow Med Spa?",
    more: "I'm here if you'd like to explore a treatment or send an appointment request."
  }
];

const STOP_WORDS = new Set(["the", "a", "an", "is", "are", "do", "does", "you", "your", "i", "we", "our", "to", "for", "of", "and", "or", "in", "on", "at", "it", "me", "my", "can", "could", "would", "please", "tell", "about", "what", "how", "with", "have", "there", "this", "that", "be", "from"]);

function normalize(value) {
  return value.toLowerCase().replace(/[^a-z0-9\s']/g, " ").replace(/\s+/g, " ").trim();
}

function scoreIntent(question, item) {
  const q = normalize(question);
  let score = 0;
  for (const phrase of item.phrases) {
    const p = normalize(phrase);
    if (q === p) score += 12;
    else if (q.includes(p)) score += Math.min(10, 5 + p.split(" ").length);
  }
  const words = q.split(" ").filter((word) => word.length > 2 && !STOP_WORDS.has(word));
  const unique = [...new Set(words)];
  for (const keyword of item.keywords) {
    const key = normalize(keyword);
    if (key.includes(" ")) {
      if (q.includes(key)) score += 4;
    } else if (unique.includes(key) || unique.some((word) => word.startsWith(key) || key.startsWith(word))) {
      score += 2;
    }
  }
  if (unique.length > 0) {
    const matched = item.keywords.filter((keyword) => {
      const key = normalize(keyword);
      return key.includes(" ") ? q.includes(key) : unique.some((word) => word === key || word.startsWith(key) || key.startsWith(word));
    }).length;
    score += Math.min(3, matched / unique.length * 5);
  }
  return score;
}

export function getAssistantReply(rawQuestion, previousIntent = null) {
  const question = normalize(rawQuestion);
  if (!question) return { intent: null, text: "Please type your question and I'll do my best to help." };

  if (/^(more|tell me more|explain more|go on|more details|can you explain|what else)$/.test(question) && previousIntent) {
    const previous = knowledge.find((item) => item.intent === previousIntent);
    if (previous) return { intent: previousIntent, text: previous.more || previous.answer };
  }

  if (/^(yes|yeah|yep|okay|ok|sure)$/.test(question) && previousIntent === "booking") {
    return { intent: "booking", text: "Great! Tap ‘Request an appointment’ below, or type ‘start booking’ and I'll collect your details." };
  }

  if (/^(start booking|book now|let.?s book|yes book|book it)$/.test(question)) {
    return { intent: "booking", text: "Let's get started! Tap ‘Request an appointment’ below and I'll guide you through the request." };
  }

  const ranked = knowledge
    .map((item) => ({ item, score: scoreIntent(question, item) }))
    .sort((a, b) => b.score - a.score);
  const best = ranked[0];
  const second = ranked[1];

  if (!best || best.score < 3 || (second && best.score - second.score < 0.75 && best.score < 7)) {
    return {
      intent: "unknown",
      text: "Thanks for asking! I don't have a reliable answer for that in this demo yet, and I don't want to guess. I can help with facial treatments, skin rejuvenation, consultations, appointment requests, pricing enquiries, opening hours, and location details. You can also ask me to connect you with the clinic team."
    };
  }

  return { intent: best.item.intent, text: best.item.answer };
}

export const suggestedQuestions = [
  "What treatments do you offer?",
  "How much does a facial cost?",
  "Can I book an appointment?"
];
