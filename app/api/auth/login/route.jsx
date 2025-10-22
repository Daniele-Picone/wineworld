import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req) {
  const { email, password } = await req.json();

  const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  const user = users[0];

  if (!user) {
    return NextResponse.json({ error: "Utente non trovato" }, { status: 404 });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return NextResponse.json({ error: "Password errata" }, { status: 401 });
  }

  // Assicurati che ci sia il campo role
  const userResponse = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role || "user", // default a "user"
  };

  // Puoi anche generare un token JWT se vuoi
  const token = "token-placeholder";

  return NextResponse.json({ user: userResponse, token });
}
