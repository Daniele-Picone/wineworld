"use client";

import { useState, useEffect, useRef } from "react";
import WineChat from "./Wewino";
import "./Floatingwinechat.css";

export default function FloatingWineChat() {
  const [open, setOpen] = useState(false);
  const chatRef = useRef(null);
  const buttonRef = useRef(null);

  // Listener per click/touch fuori
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        chatRef.current &&
        !chatRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat visibile solo se open, con animazione */}
      <div
        ref={chatRef}
        className={`mb-3 floating-chat ${open ? "open" : ""}`}
      >
        {open && <WineChat />}
      </div>

      {/* Bottone toggle */}
      <button
        ref={buttonRef}
        onClick={() => setOpen((prev) => !prev)}
        className="wewinoButton"
      >
        <img src="/wewino.png" alt="Immagine Vigna" />
      </button>
    </div>
  );
}