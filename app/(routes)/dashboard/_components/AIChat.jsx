import React, { useState } from "react";

function AIChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    try {
      const res = await fetch("/api/ai-advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "ai", content: data?.response || "Yanıt alınamadı." }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "ai", content: "Bir hata oluştu." }]);
    }
    setInput("");
    setLoading(false);
  };

  return (
    <div className="w-full max-w-xl mx-auto p-4 bg-white rounded-xl shadow-lg border border-red-100">
      <div className="mb-4 h-72 overflow-y-auto p-4 bg-red-50 rounded-xl flex flex-col gap-2">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[70%] px-4 py-2 rounded-2xl shadow text-sm break-words
                ${msg.role === "user"
                  ? "bg-red-800 text-white rounded-br-none"
                  : "bg-purple-100 text-purple-800 rounded-bl-none border border-purple-200"}
              `}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && <div className="text-gray-400">Yanıt bekleniyor...</div>}
      </div>
      <div className="flex gap-2 mt-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Sorunu yaz..."
          className="flex-1 p-3 border-2 border-red-200 rounded-xl focus:outline-none focus:border-red-800"
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          className="bg-red-800 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold shadow"
          disabled={loading}
        >
          Gönder
        </button>
      </div>
    </div>
  );
}

export default AIChat;
