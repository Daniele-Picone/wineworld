import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { message } = await req.json();

    const prompt = `
Sei un sommelier italiano esperto.
L'utente sta mangiando: "${message}".
Suggerisci un vino perfetto da abbinare spiegane i motivi, puoi consigliarne anche più di uno ma non più di tre, spiega i motivi per cui è/sono perfetti per il piatto , non dilungarti troppo massimo 2 righe per vino.
l'utente vuole un abbinamento perfetto, quindi non essere banale, cerca di consigliare vini interessanti e particolari, non limitarti ai soliti nomi famosi, fai un giusto bilanciamento non concentrarti troppo ne sui più famosi che meno.
In più se l'utente di stilerà un menu completo es(antipasto, primo, secondo, dolce),il menu completo non è obbligatorio in questa forma da quattro portate ma può variare ma in base ai piatti e le portate che ti indica l'utente , suggerisci un vino per ogni portata e spiega i motivi per cui sono perfetti per ogni piatto, in questo caso specifico i vini da consigliare per ogni piatto le scendi a due ma ben precisati in massimo 2 righe, se l'utente non specifica un menu completo puoi ricordargli che nel eventualità lo preferisce stiliamo anche anche abbinamento per menu completo .
L'utente potrà chiedere alternartive o variazioni sui vini consigliati, sempre mandenendo lo stesso formato di risposta, sempre in massimo 3 righe.
Una cosa Molto importante mai fare i nomi di cantine o produttori, limitati alla denominazione del vino che va messa per ogni vino dall'itg al docg.

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
