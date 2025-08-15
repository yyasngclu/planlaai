import OpenAI from "openai";

export async function POST(req) {
  try {
    const { totalBudget, totalIncome, totalSpend } = await req.json();

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful financial assistant." },
        {
          role: "user",
          content: `Given:
- Total Budget: ${totalBudget}
- Total Income: ${totalIncome}
- Expenses: ${totalSpend}
Give 3–4 short, practical tips in Turkish.`,
        },
      ],
    });

    const advice = completion.choices[0]?.message?.content ?? "";
    return new Response(JSON.stringify({ advice }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: "AI error" }), { status: 500 });
  }
}