import OpenAI from "openai";

// DİKKAT: API anahtarınızı frontend'de kullanmak güvenli değildir. Sadece test amaçlı kullanın!
const openai = new OpenAI({
  apiKey:
    "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",
  dangerouslyAllowBrowser: true,
});

const getFinancialAdvice = async (totalBudget, totalIncome, totalSpend) => {
  console.log(totalBudget, totalIncome, totalSpend);
  try {
    const userPrompt = `
      Based on the following financial data:
      - Total Budget: ${totalBudget} USD 
      - Expenses: ${totalSpend} USD 
      - Incomes: ${totalIncome} USD
      Provide detailed financial advice in 2 sentence to help the user manage their finances more effectively.
    `;

    // Send the prompt to the OpenAI API
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: userPrompt }],
    });

    // Process and return the response
    const advice = chatCompletion.choices[0].message.content;

    console.log(advice);
    return advice;
  } catch (error) {
    console.error("Error fetching financial advice:", error);
    return "Üzgünüm, şu anda finansal tavsiyeyi oluşturamadım. Lütfen daha sonra tekrar deneyin. 😔";
  }
};

export default getFinancialAdvice;
