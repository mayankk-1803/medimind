import Groq from "groq-sdk";
import Chat from "../models/Chat.js";

let groq = null;

// @desc    Process chat message
// @route   POST /api/chat
// @access  Private
export const processChat = async (req, res) => {
  const { message, chatId } = req.body;

  if (!groq && process.env.GROQ_API_KEY) {
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }

  if (!groq) {
    return res.status(500).json({ message: "Groq API key is not configured on the server." });
  }

  try {
    let chat;
    if (chatId) {
      chat = await Chat.findOne({ _id: chatId, user: req.user._id });
      if (!chat) return res.status(404).json({ message: "Chat not found" });
    } else {
      chat = new Chat({ user: req.user._id, messages: [] });
    }

    const systemPrompt = {
      role: "system",
      content: "You are MediMind AI, a helpful, professional, and knowledgeable intelligent medical assistant platform. You provide clear, concise medical information and guidance. Always include a disclaimer that you are an AI and your advice does not replace professional medical consultation."
    };

    // Prepare history for Groq
    const history = chat.messages.map(m => ({ role: m.role, content: m.content }));
    const newMessage = { role: "user", content: message };
    
    const groqMessages = [systemPrompt, ...history, newMessage];

    const chatCompletion = await groq.chat.completions.create({
      messages: groqMessages,
      model: "llama-3.1-8b-instant",
    });

    const aiResponse = chatCompletion.choices[0]?.message?.content || "I am unable to process your request at the moment.";

    // Save to DB
    chat.messages.push(newMessage);
    chat.messages.push({ role: "assistant", content: aiResponse });
    await chat.save();

    res.status(200).json({
      chatId: chat._id,
      response: aiResponse
    });

  } catch (error) {
    console.error("Groq Error:", error);
    res.status(500).json({ message: "Error communicating with AI assistant" });
  }
};

// @desc    Get user chats
// @route   GET /api/chat
// @access  Private
export const getUserChats = async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user._id }).sort({ updatedAt: -1 }).select("-messages");
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get specific chat
// @route   GET /api/chat/:id
// @access  Private
export const getChatById = async (req, res) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id, user: req.user._id });
    if (!chat) return res.status(404).json({ message: "Chat not found" });
    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
