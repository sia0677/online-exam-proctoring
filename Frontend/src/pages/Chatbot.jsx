import { useState } from "react";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      text: "Hello 👋 I am your Exam Assistant. How can I help you?",
      sender: "bot",
    },
  ]);

  const [input, setInput] = useState("");

  const getBotReply = (message) => {
    const msg = message.toLowerCase();

    if (msg.includes("exam")) {
      return "Your exam will auto-submit when the timer ends.";
    }

    if (msg.includes("fullscreen")) {
      return "Please stay in fullscreen mode during the exam.";
    }

    if (msg.includes("result")) {
      return "Results will be generated instantly after submission.";
    }

    if (msg.includes("time")) {
      return "Each exam has a specific time limit.";
    }

    if (msg.includes("tab")) {
      return "Tab switching is monitored during the exam.";
    }

    return "I can help with exams, results, fullscreen mode, and proctoring.";
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = {
      text: input,
      sender: "user",
    };

    const botMessage = {
      text: getBotReply(input),
      sender: "bot",
    };

    setMessages((prev) => [...prev, userMessage, botMessage]);

    setInput("");
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "350px",
        background: "#0f172a",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 0 20px rgba(0,0,0,0.5)",
        zIndex: 999,
      }}
    >
      <div
        style={{
          background: "#2563eb",
          padding: "15px",
          color: "white",
          fontWeight: "bold",
          fontSize: "18px",
        }}
      >
        AI Exam Assistant
      </div>

      <div
        style={{
          height: "350px",
          overflowY: "auto",
          padding: "15px",
          background: "#1e293b",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent:
                msg.sender === "user"
                  ? "flex-end"
                  : "flex-start",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                background:
                  msg.sender === "user"
                    ? "#3b82f6"
                    : "#334155",
                color: "white",
                padding: "10px 15px",
                borderRadius: "15px",
                maxWidth: "80%",
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          padding: "10px",
          background: "#0f172a",
        }}
      >
        <input
          type="text"
          placeholder="Ask something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "10px",
            border: "none",
            outline: "none",
            marginRight: "10px",
          }}
        />

        <button
          onClick={sendMessage}
          style={{
            background: "#2563eb",
            color: "white",
            border: "none",
            padding: "12px 15px",
            borderRadius: "10px",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}