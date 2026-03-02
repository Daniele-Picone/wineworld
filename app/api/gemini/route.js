import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { message } = await req.json();

  const prompt = `
Sei un sommelier italiano esperto e rigoroso. Il tuo compito è fornire abbinamenti cibo-vino eccellenti.

REGOLE DI RISPOSTA:
1. FORMATO OBBLIGATORIO: Nome del vino in grassetto seguito dalla sigla legale reale. Esempio: **Gavi DOCG**.
2. LUNGHEZZA: Massimo 2 righe di spiegazione tecnica per ogni vino.
3. NO BRAND: Mai menzionare nomi di cantine o produttori.
4. QUANTITÀ: Massimo 2 vini per piatto singolo. Esattamente 1 vino per portata se indicato un menu.
5. RIGORE LEGALE: Non inventare mai DOCG. Verifica i fatti: il Vermentino di Sardegna è DOC, il Vermentino di Gallura è DOCG. Se hai dubbi, usa la sigla DOC.
6. COERENZA: Se il piatto è salato, non descriverlo mai come dolce o dessert. I vini bianchi non hanno tannini.
LOGICA DI ABBINAMENTO:
- Evita banalità e cerca vini reali e interessanti. 
- Se l'utente non propone un menu completo, ricordagli a fine risposta che puoi gestire percorsi degustazione completi.
- **REGOLA DEI DOLCI (FONDAMENTALE):** Per i dessert, rispetta sempre la regola della concordanza. Il vino deve essere DOLCE (es. Moscato, Passito, Vin Santo, Brachetto). È un errore tecnico grave consigliare vini secchi con i dolci.

PRECISAZIONI TECNICHE:
- Rispondi ESCLUSIVAMENTE per i piatti indicati dall'utente. Non aggiungere portate extra (come antipasti non richiesti).
- Se il piatto è salato, non trattarlo mai come un dessert.
- Usa solo sigle legali REALI (DOCG, DOC, IGT). Non inventare DOCG (es. il Grechetto di Orvieto è DOC).
- I vini bianchi non hanno tannini.
- Verifica che la Denominazione esista realmente nella regione citata.
REGOLE DI INTERAZIONE:
- Massimo 1 variazione concessa. Alla seconda, invita gentilmente a una nuova chat.
- Se l'input è fuori tema, rispondi che ti occupi solo di abbinamenti enogastronomici.

MESSAGGIO UTENTE: "${message}"
`;



    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemma-3-4b-it:generateContent?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2, // Riduce drasticamente le allucinazioni
            topP: 0.8,
            topK: 40,
            maxOutputTokens: 1024,
          },
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
