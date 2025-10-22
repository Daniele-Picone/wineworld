import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req) {
  const { name, email, password } = await req.json();

  // controlla se esiste già
  const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  if (users.length > 0) {
    return NextResponse.json({ error: "Email già registrata" }, { status: 400 });
  }

  // cifra la password
  const hashed = await bcrypt.hash(password, 10);

  // salva nel db, aggiungendo il campo role (default: "user")
  const [result] = await db.query(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    [name, email, hashed, "user"]
  );

  // crea l’oggetto user da restituire
  const user = {
    id: result.insertId,
    name,
    email,
    role: "user", // default
  };

  // token placeholder (puoi sostituire con JWT)
  const token = "token-placeholder";

  return NextResponse.json({ user, token }, { status: 200 });
}
