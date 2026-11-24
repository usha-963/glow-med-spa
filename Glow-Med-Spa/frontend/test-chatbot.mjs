import assert from "node:assert/strict";
import { getAssistantReply } from "./src/components/chatKnowledge.js";

const cases = [
  ["Hi there", "greeting"],
  ["What treatments do you offer?", "services"],
  ["Can you tell me about a facial for dry skin?", "facial"],
  ["How much does a facial cost?", "pricing"],
  ["Are you open on Saturdays?", "hours"],
  ["Do you have weekend appointments?", "hours"],
  ["Where is your clinic located?", "location"],
  ["Can I reschedule my appointment?", "reschedule"],
  ["I have sensitive skin, what do you recommend?", "safety"],
  ["Do you offer Botox?", "botox_fillers_laser"],
  ["What happens during a consultation?", "consultation"],
  ["Can I book a facial?", "booking"]
];

for (const [question, expectedIntent] of cases) {
  const result = getAssistantReply(question);
  assert.equal(result.intent, expectedIntent, `Unexpected intent for: ${question}`);
  assert.ok(result.text.length > 20, `Missing answer for: ${question}`);
}

const followUp = getAssistantReply("Tell me more", "facial");
assert.equal(followUp.intent, "facial");
assert.ok(followUp.text.toLowerCase().includes("before a facial"));

console.log(`Chatbot knowledge tests passed (${cases.length + 1} checks).`);
