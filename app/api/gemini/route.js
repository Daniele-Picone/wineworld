import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { message } = await req.json();

    const prompt = `
Sei un sommelier italiano esperto.
L'utente sta mangiando: "${message}".
Suggerisci un vino perfetto in massimo due frasi.
    `;

    const MODEL = "gemini-2.5-flash";

    const response = await fetch(
      ` https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();

    console.log("GEMINI RAW RESPONSE:", JSON.stringify(data, null, 2));

    if (data.error) {
      return NextResponse.json({ reply: "Errore dal modello: " + data.error.message });
    }

    let reply = data?.candidates?.[0]?.content?.parts
      ?.map((p) => p.text)
      .join(" ")
      .trim();

    if (!reply) reply = data?.candidates?.[0]?.output_text;

    if (!reply) reply = "Non ho trovato un abbinamento.";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("SERVER ERROR:", err);
    return NextResponse.json({ reply: "Errore nel server." });
  }
}
