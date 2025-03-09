import { getAiResponse } from "@/api/supabase";
import { useCallback, useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";

interface Message {
    id: number;
    text: string;
    sender: "bot" | "user";
}

export function AiChatBot({ helpMessage }: { helpMessage: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: "Hi! How can I help you today?",
            sender: "bot",
        },
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const sendMessage = useCallback(async () => {
        if (!inputValue) return;

        setMessages((prev) => [
            ...prev,
            {
                id: prev.length + 1,
                text: inputValue,
                sender: "user",
            },
        ]);
        setInputValue("");
        setIsLoading(true);

        getAiResponse(inputValue).then((response) => {
            setMessages((prev) => [
                ...prev,
                {
                    id: prev.length + 1,
                    text: response.message,
                    sender: "bot",
                },
            ]);
            setIsLoading(false);
        });
    }, [inputValue]);

    useEffect(() => {
        if (helpMessage) {
            setIsOpen(true);
            setInputValue(helpMessage);
        }
    }, [helpMessage]);

    useEffect(() => {
        if (helpMessage === inputValue) {
            sendMessage();
        }
    }, [inputValue, helpMessage, sendMessage]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    return (
        <div style={styles.chatbotContainer}>
            <button style={styles.chatToggle} onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? "✕" : "💬"}
            </button>

            {isOpen && (
                <div style={styles.chatWindow}>
                    <div style={styles.chatHeader}>
                        <h3 style={styles.headerTitle}>AI Assistant</h3>
                    </div>

                    <div style={styles.chatMessages}>
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                style={{
                                    ...styles.message,
                                    ...(message.sender === "bot"
                                        ? styles.botMessage
                                        : styles.userMessage),
                                }}
                            >
                                <Markdown>{message.text}</Markdown>
                            </div>
                        ))}
                        {isLoading && (
                            <div style={{ ...styles.message, ...styles.botMessage }}>
                                Typing...
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div style={styles.chatInput}>
                        <input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            style={styles.input}
                            type="text"
                            placeholder="Type your message..."
                        />
                        <button onClick={sendMessage} style={styles.sendButton}>
                            Send
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    chatbotContainer: {
        position: "fixed" as const,
        bottom: "16px",
        right: "16px",
        zIndex: 1000,
    },
    chatToggle: {
        background: "hsl(154.9deg 59.5% 55% / 1)", // Primary color
        color: "#fff",
        border: "none",
        borderRadius: "50%",
        width: "56px",
        height: "56px",
        fontSize: "24px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        outline: "none",
        boxShadow: "0 4px 12px rgba(124, 58, 237, 0.3)",
    },
    chatWindow: {
        width: "380px",
        height: "600px",
        background: "#fff",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
        borderRadius: "16px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column" as const,
        position: "fixed" as const,
        bottom: 80,
        right: 24,
    },
    chatHeader: {
        background: "hsl(154.9deg 59.5% 55% / 1)",
        padding: "20px",
        color: "#fff",
    },
    headerTitle: {
        margin: 0,
        fontSize: "18px",
        fontWeight: 600,
    },
    chatMessages: {
        flex: 1,
        padding: "20px",
        overflowY: "auto" as const,
        background: "#F9FAFB",
    },
    message: {
        maxWidth: "90%",
        padding: "12px 16px",
        borderRadius: "12px",
        marginBottom: "12px",
        fontSize: "14px",
        lineHeight: "1.5",
        width: "fit-content",
    },
    botMessage: {
        background: "hsl(154.9deg 59.5% 55% / 1)",
        color: "#fff",
        borderBottomLeftRadius: "4px",
        marginRight: "auto",
    },
    userMessage: {
        background: "#F3F4F6",
        color: "#1F2937",
        borderBottomRightRadius: "4px",
        marginLeft: "auto",
    },
    chatInput: {
        display: "flex",
        gap: "8px",
        padding: "16px",
        background: "#fff",
        borderTop: "1px solid #E5E7EB",
    },
    input: {
        flex: 1,
        padding: "12px 16px",
        border: "1px solid #E5E7EB",
        borderRadius: "8px",
        outline: "none",
        fontSize: "14px",
        transition: "border-color 0.2s ease",
    },
    sendButton: {
        background: "hsl(154.9deg 59.5% 55% / 1)",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        padding: "0 20px",
        fontSize: "14px",
        fontWeight: 500,
        cursor: "pointer",
        transition: "background 0.2s ease",
    },
};
