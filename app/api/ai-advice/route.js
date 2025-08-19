import OpenAI from "openai";

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful financial assistant. Answer in Turkish.",
        },
        { role: "user", content: prompt },
      ],
    });
    const response = completion.choices[0]?.message?.content ?? "";
    return new Response(JSON.stringify({ response }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: "AI error" }), { status: 500 });
  }
}
