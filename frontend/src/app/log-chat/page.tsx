"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { Send } from "lucide-react";
import { useState, useRef } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState<
    { sender: "user" | "bot"; text: string }[]
  >([
    {
      sender: "bot",
      text: "👋 Hello! How can I help you?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [logFilename, setLogFilename] = useState(""); // You can set a default log file name here
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !logFilename.trim()) return;

    const userMsg = input;
    setMessages((msgs) => [...msgs, { sender: "user", text: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/log/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: userMsg,
          log_filename: logFilename,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to get response from server");
      }

      const data = await res.json();
      const answer =
        Array.isArray(data.answers) && data.answers.length > 0
          ? data.answers.join("\n\n")
          : data.answers || "No answer found.";

      setMessages((msgs) => [
        ...msgs,
        { sender: "bot", text: answer },
      ]);
    } catch (err: any) {
      setMessages((msgs) => [
        ...msgs,
        { sender: "bot", text: "❌ Sorry, something went wrong." },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[60vh] w-[70vw] mx-auto bg-gradient-to-br from-emerald-50 to-white rounded-2xl shadow-xl overflow-hidden">
        {/* Log file input */}
        <div className="p-3 bg-white border-b border-gray-200 flex items-center gap-3">
          <input
            type="text"
            placeholder="Enter log file name (e.g. mylog.log)"
            className="border border-gray-300 rounded px-3 py-1 flex-1"
            value={logFilename}
            onChange={(e) => setLogFilename(e.target.value)}
          />
        </div>
        {/* Chat Messages Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={
                msg.sender === "bot"
                  ? "flex"
                  : "flex justify-end"
              }
            >
              <div
                className={
                  msg.sender === "bot"
                    ? "bg-white shadow-md text-gray-800 px-4 py-2 rounded-2xl rounded-bl-none max-w-sm"
                    : "bg-emerald-600 text-white px-4 py-2 rounded-2xl rounded-br-none max-w-sm shadow-md"
                }
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex">
              <div className="bg-white shadow-md text-gray-800 px-4 py-2 rounded-2xl rounded-bl-none max-w-sm opacity-70">
                <span className="animate-pulse">Thinking...</span>
              </div>
            </div>
          )}
        </div>
        {/* Chat Input Form */}
        <form
          className="border-t border-gray-200 p-3 bg-white flex items-center gap-3 shadow-inner"
          onSubmit={handleSend}
        >
          <input
            ref={inputRef}
            type="text"
            name="message"
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
            required
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-full shadow-md transition transform hover:scale-105"
            disabled={loading}
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
