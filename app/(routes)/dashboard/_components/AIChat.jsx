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
    <div className="w-full max-w-xl mx-auto p-4 bg-white rounded shadow">
      <div className="mb-4 h-64 overflow-y-auto border p-2 bg-gray-50 rounded">
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-2 text-sm ${msg.role === "user" ? "text-blue-700" : "text-purple-700"}`}>
            <strong>{msg.role === "user" ? "Sen:" : "AI:"}</strong> {msg.content}
          </div>
        ))}
        {loading && <div className="text-gray-400">Yanıt bekleniyor...</div>}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Sorunu yaz..."
          className="flex-1 p-2 border rounded"
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          className="bg-purple-700 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          Gönder
        </button>
      </div>
    </div>
  );
}

export default AIChat;
