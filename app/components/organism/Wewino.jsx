"use client";

import { useState } from "react";
import "./Wewino.css";
export default function WineChat() {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([
  { sender: "bot", text: `Benvenuto! 🍷
     Sono WeWino, il tuo assistente esperto per gli abbinamenti cibo-vino, basato su tecnologia Google AI.
  Il mio obiettivo è aiutarti a scovare l'etichetta perfetta, dalle denominazioni più celebri alle perle enologiche più rare.
   Che tu stia preparando un piatto singolo o un intero menu degustazione, sono qui per guidarti.
   Importante:
🛡️ 1. Evita dati personali: i messaggi sono elaborati da terze parti.
🔞 2. Servizio riservato ai maggiori di 18 anni.
🍷 3. Bevi responsabilmente. 
   
   Cosa hai nel piatto oggi? Scrivimi la tua portata e iniziamo!` }
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
          placeholder="Cosa mangerai?"
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
