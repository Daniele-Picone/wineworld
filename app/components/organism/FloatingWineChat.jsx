"use client";

import { useState, useEffect, useRef } from "react";
import WineChat from "./Wewino"; // il tuo organism
import"./Floatingwinechat.css";

export default function FloatingWineChat() {
  const [open, setOpen] = useState(false);
  const chatRef = useRef(null); // riferimento al contenitore della chat

  // Effetto per il click fuori
  useEffect(() => {
    function handleClickOutside(event) {
      if (chatRef.current && !chatRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat visibile solo se open */}
      {open && (
        <div ref={chatRef} className="mb-3">
          <WineChat />
        </div>
      )}

      {/* Bottone toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="wewinoButton"
      >
        <img src="/wewino.png" alt="Immagine Vigna" /> 
      </button>
    </div>
  );
}