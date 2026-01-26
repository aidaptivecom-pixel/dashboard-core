"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, Send, Mic, Maximize2, Loader2 } from "lucide-react";
import { mockChatMessages, ChatMessage } from "@/lib/mock-data";

export function AIMiniChat() {
    const [messages, setMessages] = useState<ChatMessage[]>(mockChatMessages);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const sendMessage = () => {
        if (!input.trim()) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: "user",
            content: input,
            timestamp: new Date(),
        };

        setMessages([...messages, userMessage]);
        setInput("");
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            const aiMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content:
                    "I understand. Let me help you prioritize that. Would you like me to reschedule your less urgent tasks?",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiMessage]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className="glass-card-purple p-5">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple/10">
                        <Bot className="h-4 w-4 text-purple" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm">Claude AI</h3>
                        <p className="text-[10px] text-muted-foreground">Your focus assistant</p>
                    </div>
                </div>
                <button className="p-1.5 hover:bg-accent rounded-lg transition-colors">
                    <Maximize2 className="h-4 w-4 text-muted-foreground" />
                </button>
            </div>

            {/* Messages */}
            <div className="space-y-3 mb-4 max-h-40 overflow-y-auto custom-scrollbar">
                {messages.slice(-3).map((message) => (
                    <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`max-w-[85%] p-3 rounded-2xl text-sm ${message.role === "user"
                                    ? "bg-primary text-primary-foreground rounded-br-md"
                                    : "bg-muted rounded-bl-md"
                                }`}
                        >
                            {message.content}
                        </div>
                    </motion.div>
                ))}

                {isTyping && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2 text-muted-foreground"
                    >
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-xs">Claude is thinking...</span>
                    </motion.div>
                )}
            </div>

            {/* Input */}
            <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-muted">
                    <input
                        type="text"
                        placeholder="Ask Claude..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground"
                    />
                    <button className="p-1 hover:bg-accent rounded-lg transition-colors">
                        <Mic className="h-4 w-4 text-muted-foreground" />
                    </button>
                </div>
                <button
                    onClick={sendMessage}
                    className="p-2.5 rounded-xl bg-purple text-white hover:bg-purple-dark transition-colors"
                >
                    <Send className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
