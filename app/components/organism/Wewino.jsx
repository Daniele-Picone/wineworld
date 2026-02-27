"use client";

import { useState } from "react";
import "./Wewino.css";
export default function WineChat() {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([
  { sender: "bot", text: "Benvenuto! 🍷 Sono WeWino e sono il tuo assistente per gli abbinamenti di vino. Il mio obiettivo è aiutarti a scegliere il vino più adatto ai tuoi piatti, proponendo combinazioni precise e suggerimenti pratici per valorizzare ogni portata. Dicci cosa stai per gustare e iniziamo a individuare l’abbinamento ideale." }
]);

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    // Messaggio utente
    const userMsg = { sender: "user", text: userInput };
    setMessages((prev) => [...prev, userMsg]);

    // Reset input
    setUserInput("");

    // Chiamata backend → Google Gemini
    const res = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userInput }),
    });

    const data = await res.json();

    // Messaggio bot
    const botMsg = { sender: "bot", text: data.reply };
    setMessages((prev) => [...prev, botMsg]);
  };

  return (
    <div className="Wewino">
      <h2 className="wewino-title"> WeWino <img className="wewinopng" src="/wewino.png" alt="Logo WeWino" /> </h2>

      <div className="chatarea">
        {messages.map((m, i) => (
          <div
            key={i}
            className={
              m.sender === "user"
                ? "user-message"
                : "bot-message"
            }
          >
            {m.text}
          </div>
        ))}
      </div>

      <div className="sendarea">
        <input
          className="sendinput"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Cosa stai mangiando?"
        />
        <button
          className="sendbutton"
          onClick={sendMessage}
        >
          Invia
        </button>
      </div>
    </div>
  );
}
