import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaPen, FaSignInAlt, FaSignOutAlt, FaPaperPlane } from "react-icons/fa";

const Index = () => {
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");

  useEffect(() => {
    // Load user from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Load chats from localStorage
    const storedChats = localStorage.getItem("chats");
    if (storedChats) {
      setChats(JSON.parse(storedChats));
    }
  }, []);

  useEffect(() => {
    // Save user to localStorage
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    // Save chats to localStorage
    localStorage.setItem("chats", JSON.stringify(chats));
  }, [chats]);

  const handleLogin = () => {
    const username = prompt("Enter your username:");
    if (username) {
      setUser({ username });
    }
  };

  const handleLogout = () => {
    setUser(null);
    setActiveChat(null);
    setMessages([]);
  };

  const handleCreateChat = () => {
    const chatName = prompt("Enter a name for the new chat:");
    if (chatName) {
      const newChat = {
        id: Date.now(),
        name: chatName,
        model: "claude-3-opus",
        systemPrompt: "You are a helpful, intelligent assistant.",
      };
      setChats([...chats, newChat]);
      setActiveChat(newChat.id);
      setMessages([]);
    }
  };

  const handleRenameChat = () => {
    const chatName = prompt("Enter a new name for the chat:");
    if (chatName) {
      const updatedChats = chats.map((chat) => {
        if (chat.id === activeChat) {
          return { ...chat, name: chatName };
        }
        return chat;
      });
      setChats(updatedChats);
    }
  };

  const handleDeleteChat = () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this chat?");
    if (confirmDelete) {
      const updatedChats = chats.filter((chat) => chat.id !== activeChat);
      setChats(updatedChats);
      setActiveChat(null);
      setMessages([]);
    }
  };

  const handleSelectChat = (chatId) => {
    setActiveChat(chatId);
    const selectedChat = chats.find((chat) => chat.id === chatId);
    setMessages(selectedChat.messages || []);
    setCustomPrompt(selectedChat.systemPrompt);
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() !== "") {
      const newMessage = {
        id: Date.now(),
        content: inputMessage,
        sender: "user",
      };
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      setInputMessage("");

      // Simulate AI response after 1 second
      setTimeout(() => {
        const aiMessage = {
          id: Date.now(),
          content: `AI response to: ${newMessage.content}`,
          sender: "ai",
        };
        setMessages([...updatedMessages, aiMessage]);
      }, 1000);

      // Update the chat with the new messages
      const updatedChats = chats.map((chat) => {
        if (chat.id === activeChat) {
          return { ...chat, messages: updatedMessages };
        }
        return chat;
      });
      setChats(updatedChats);
    }
  };

  const handleEditMessage = (messageId, newContent) => {
    const updatedMessages = messages.map((message) => {
      if (message.id === messageId) {
        return { ...message, content: newContent };
      }
      return message;
    });
    setMessages(updatedMessages);

    // Update the chat with the edited messages
    const updatedChats = chats.map((chat) => {
      if (chat.id === activeChat) {
        return { ...chat, messages: updatedMessages };
      }
      return chat;
    });
    setChats(updatedChats);
  };

  const handleDeleteMessage = (messageId) => {
    const updatedMessages = messages.filter((message) => message.id !== messageId);
    setMessages(updatedMessages);

    // Update the chat with the deleted message
    const updatedChats = chats.map((chat) => {
      if (chat.id === activeChat) {
        return { ...chat, messages: updatedMessages };
      }
      return chat;
    });
    setChats(updatedChats);
  };

  const handleModelChange = (model) => {
    const updatedChats = chats.map((chat) => {
      if (chat.id === activeChat) {
        return { ...chat, model };
      }
      return chat;
    });
    setChats(updatedChats);
  };

  const handleCustomPromptChange = (prompt) => {
    setCustomPrompt(prompt);

    // Update the chat with the new custom prompt
    const updatedChats = chats.map((chat) => {
      if (chat.id === activeChat) {
        return { ...chat, systemPrompt: prompt };
      }
      return chat;
    });
    setChats(updatedChats);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-100 p-4">
        <h2 className="text-2xl font-bold mb-4">Free+Open</h2>
        {user ? (
          <div>
            <p className="mb-4">Welcome, {user.username}!</p>
            <button className="bg-red-500 text-white px-4 py-2 rounded mb-4" onClick={handleLogout}>
              <FaSignOutAlt className="inline-block mr-2" />
              Logout
            </button>
          </div>
        ) : (
          <button className="bg-blue-500 text-white px-4 py-2 rounded mb-4" onClick={handleLogin}>
            <FaSignInAlt className="inline-block mr-2" />
            Login
          </button>
        )}
        {user && (
          <div>
            <button className="bg-green-500 text-white px-4 py-2 rounded mb-4" onClick={handleCreateChat}>
              <FaPlus className="inline-block mr-2" />
              New Chat
            </button>
            <ul>
              {chats.map((chat) => (
                <li key={chat.id} className={`cursor-pointer mb-2 ${activeChat === chat.id ? "bg-blue-200" : ""}`} onClick={() => handleSelectChat(chat.id)}>
                  {chat.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Chat area */}
      <div className="flex-1 p-4">
        {activeChat ? (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{chats.find((chat) => chat.id === activeChat).name}</h3>
              <div>
                <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2" onClick={handleRenameChat}>
                  <FaPen className="inline-block mr-2" />
                  Rename
                </button>
                <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={handleDeleteChat}>
                  <FaTrash className="inline-block mr-2" />
                  Delete
                </button>
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="model-select" className="block mb-2">
                Select Model:
              </label>
              <select id="model-select" className="w-full p-2 border border-gray-300 rounded" value={chats.find((chat) => chat.id === activeChat).model} onChange={(e) => handleModelChange(e.target.value)}>
                <option value="claude-3-opus">Claude-3-Opus</option>
                <option value="gpt-4-2024-04-09">GPT-4-2024-04-09</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="custom-prompt" className="block mb-2">
                Custom System Prompt:
              </label>
              <textarea id="custom-prompt" className="w-full p-2 border border-gray-300 rounded" value={customPrompt} onChange={(e) => handleCustomPromptChange(e.target.value)}></textarea>
            </div>
            <div className="h-64 overflow-y-auto mb-4">
              {messages.map((message) => (
                <div key={message.id} className="mb-2">
                  <p className={`${message.sender === "user" ? "text-right" : "text-left"}`}>{message.content}</p>
                  {message.sender === "user" && (
                    <div className="text-right">
                      <button
                        className="text-blue-500 mr-2"
                        onClick={() => {
                          const newContent = prompt("Edit message:", message.content);
                          if (newContent) {
                            handleEditMessage(message.id, newContent);
                          }
                        }}
                      >
                        Edit
                      </button>
                      <button className="text-red-500" onClick={() => handleDeleteMessage(message.id)}>
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex">
              <input type="text" className="flex-1 p-2 border border-gray-300 rounded-l" placeholder="Type your message..." value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} />
              <button className="bg-blue-500 text-white px-4 rounded-r" onClick={handleSendMessage}>
                <FaPaperPlane />
              </button>
            </div>
          </div>
        ) : (
          <p>Select a chat to start messaging.</p>
        )}
      </div>
    </div>
  );
};

export default Index;
