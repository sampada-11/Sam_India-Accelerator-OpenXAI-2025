"use client";

import React, { useState, useRef, useEffect } from "react";

export default function VoiceTaskManager() {
  const [tasks, setTasks] = useState<string[]>([]);
  const [listening, setListening] = useState(false);
  const [input, setInput] = useState("");

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.lang = "en-US";

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[event.results.length - 1][0].transcript;
          handleCommand(transcript);
        };
      }
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  const handleCommand = (command: string) => {
    const lower = command.toLowerCase();

    if (lower.startsWith("add")) {
      const newTask = lower.replace("add", "").trim();
      if (newTask) setTasks((prev) => [...prev, newTask]);
    } else if (lower.startsWith("delete")) {
      const num = parseInt(lower.replace(/\D/g, ""));
      if (!isNaN(num) && num <= tasks.length) {
        setTasks((prev) => prev.filter((_, i) => i !== num - 1));
      }
    } else if (lower.startsWith("clear")) {
      setTasks([]);
    }
  };

  const addTask = () => {
    if (!input.trim()) return;
    setTasks([...tasks, input]);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 space-y-6">
        {/* Header */}
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">🎤 Voice Task Manager</h1>
          <button
            onClick={toggleListening}
            className={`px-4 py-2 rounded-xl font-medium shadow transition ${
              listening
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            {listening ? "Stop Listening" : "Start Voice"}
          </button>
        </header>

        {/* Input */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add a task..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            className="flex-1 px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none"
          />
          <button
            onClick={addTask}
            className="bg-indigo-600 text-white px-4 py-2 rounded-xl shadow hover:bg-indigo-700"
          >
            Add
          </button>
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <p className="text-center text-gray-500 italic">
              No tasks yet. Try saying <b>“add buy milk”</b>.
            </p>
          ) : (
            tasks.map((task, i) => (
              <div
                key={i}
                className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-xl shadow-sm"
              >
                <span className="text-gray-700">{i + 1}. {task}</span>
                <button
                  onClick={() => setTasks(tasks.filter((_, idx) => idx !== i))}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <footer className="text-sm text-gray-500 text-center pt-4 border-t">
          Commands: “add …”, “delete task 1”, “clear all”
        </footer>
      </div>
    </div>
  );
}
