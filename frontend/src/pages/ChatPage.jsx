import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { showSuccess, showError } from '../utils/alerts';
import { Send, Mic, MicOff, AlertCircle, Bot, User, Stethoscope, ImagePlus, X } from 'lucide-react';
import Loader from '../components/Loader';
import { motion } from 'framer-motion';
import TypewriterText from '../components/TypewriterText';

const ChatPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const chatIdParam = searchParams.get('id');
  
  const [chatId, setChatId] = useState(chatIdParam || null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [initialLoad, setInitialLoad] = useState(!!chatIdParam);
  const [imagePreview, setImagePreview] = useState(null);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Initialize Speech Recognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  useEffect(() => {
    if (recognition) {
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev + ' ' + transcript);
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        showError('Voice input failed', 'Could not recognize speech.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    }
  }, [recognition]);

  useEffect(() => {
    if (chatIdParam) {
      loadChat(chatIdParam);
    } else {
      setMessages([{
        role: 'assistant',
        content: 'Hello! I am MediMind AI. How can I assist you with your health today?',
        isNew: true
      }]);
    }
  }, [chatIdParam]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, imagePreview]);

  const loadChat = async (id) => {
    try {
      const { data } = await api.get(`/chat/${id}`);
      // Mark loaded messages as false for `isNew` so they don't typewriter animate again
      const historyMessages = data.messages.filter(m => m.role !== 'system').map(m => ({...m, isNew: false}));
      setMessages(historyMessages);
    } catch (error) {
      showError('Failed to load chat', error.message);
    } finally {
      setInitialLoad(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const startVoiceInput = () => {
    if (!recognition) {
      return showError('Not supported', 'Voice input is not supported in this browser.');
    }
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
      showSuccess('Listening...', 'Please speak now');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        return showError('Invalid File', 'Please upload a valid image file.');
      }
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const removeImagePreview = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() && !imagePreview) return;

    let userMsg = input.trim();
    let hasImage = false;

    if (imagePreview) {
      hasImage = true;
      userMsg = userMsg ? userMsg : "Please analyze this medical scan.";
    }

    setInput('');
    const displayMsg = hasImage ? `[Uploaded Medical Scan]\n${userMsg}` : userMsg;
    setMessages(prev => [...prev, { role: 'user', content: displayMsg, imageUrl: imagePreview, isNew: true }]);
    setImagePreview(null);
    setIsLoading(true);

    try {
      // Mock logic: if image is attached, append special text so the AI knows to mock an analysis
      const apiSendMsg = hasImage 
        ? `I am uploading a mock medical scan image as part of our platform demonstration. The user asked: "${userMsg}". Please pretend to see a typical medical scan (e.g., X-ray or MRI) and explain in detail what doctors generally analyze in such scans, what abnormalities they look for, and then state clearly that this is a simulated response and they should consult a real radiologist.`
        : userMsg;

      const { data } = await api.post('/chat', { message: apiSendMsg, chatId });
      if (!chatId) {
        setChatId(data.chatId);
        setSearchParams({ id: data.chatId });
      }
      setMessages(prev => [...prev, { role: 'assistant', content: data.response, isNew: true }]);
    } catch (error) {
       showError('Failed to send message', error.response?.data?.message || error.message);
       setMessages(prev => prev.slice(0, -1)); // Remove optimistc update
    } finally {
      setIsLoading(false);
    }
  };

  if (initialLoad) return <Loader fullScreen />;

  const messageVariants = {
    hidden: (isUser) => ({ 
      opacity: 0, 
      x: isUser ? 50 : -50,
      scale: 0.95
    }),
    visible: { 
      opacity: 1, 
      x: 0,
      scale: 1,
      transition: { type: 'spring', damping: 20, stiffness: 100 }
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-64px)] flex flex-col font-sans">
      {/* Disclaimer */}
      <div className="bg-white/10 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 dark:border-white/5 rounded-2xl p-4 mb-6 flex items-start gap-4 flex-shrink-0 shadow-sm">
        <AlertCircle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
          <strong className="text-textMain dark:text-white uppercase tracking-wider text-xs mr-2">Medical Disclaimer</strong>
          I am an AI assistant. The information provided is for educational purposes only and does not substitute professional medical advice.
        </p>
      </div>

      {/* Chat Area */}
      <div className="glass-card flex-1 flex flex-col p-0 overflow-hidden shadow-2xl">
        <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border-b border-white/20 dark:border-white/5 p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-gradient-to-br from-primary to-accent rounded-xl shadow-lg shadow-primary/20">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl text-textMain dark:text-white tracking-tight">MediMind Consultation</h2>
              <p className="text-xs font-semibold text-primary uppercase tracking-widest flex items-center gap-2 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse inline-block"></span> Secure Session
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-8 md:px-12 space-y-10 bg-white/20 dark:bg-black/10 backdrop-blur-sm relative">
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <motion.div 
                key={index} 
                custom={isUser}
                initial="hidden"
                animate="visible"
                variants={messageVariants}
                className="group"
              >
                <div className={`flex w-full mx-auto gap-4 md:gap-6 items-end ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-sm transition-transform group-hover:scale-105 ${
                    isUser ? 'bg-slate-200 dark:bg-slate-800 text-slate-600' : 'bg-black text-white dark:bg-white dark:text-black'
                  }`}>
                    {isUser ? <User className="w-4 h-4 md:w-5 md:h-5" /> : <Bot className="w-4 h-4 md:w-5 md:h-5" />}
                  </div>
                  
                  {/* Content Bubbles */}
                  <div className={`flex-1 flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest mb-1 text-slate-400 px-1">
                      {isUser ? 'You' : 'MediMind AI'}
                    </h3>
                    <div className={`px-5 py-3.5 rounded-2xl max-w-[85%] text-[15px] md:text-base leading-relaxed tracking-wide shadow-sm ${
                      isUser 
                        ? 'bg-[#1A1A1A] text-white rounded-tr-sm dark:bg-[#E8E2D9] dark:text-[#0F0F0F]' 
                        : 'bg-[#EFE8DD] text-[#0F0F0F] rounded-tl-sm dark:bg-[#1A1A1A] dark:text-white'
                    }`}>
                      {msg.imageUrl && (
                        <img src={msg.imageUrl} alt="Uploaded Scan" className="max-w-xs md:max-w-sm rounded-xl mb-4 shadow-lg border border-black/10" />
                      )}
                      
                      <div className={`prose max-w-none ${isUser ? 'prose-invert dark:prose-slate' : 'prose-slate dark:prose-invert'}`}>
                         {(!isUser && msg.isNew) 
                           ? <TypewriterText text={msg.content} onComplete={() => scrollToBottom()} /> 
                           : msg.content
                         }
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
          
          {isLoading && (
             <motion.div 
               initial="hidden" 
               animate="visible" 
               custom={false} 
               variants={messageVariants} 
               className="flex w-full mx-auto gap-4 md:gap-6 items-end flex-row"
             >
               <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-sm bg-black text-white dark:bg-white dark:text-black opacity-70">
                 <Bot className="w-4 h-4 md:w-5 md:h-5" />
               </div>
               <div className="flex-1 flex flex-col items-start mt-1 md:mt-2">
                 <h3 className="text-[10px] font-bold uppercase tracking-widest mb-1 text-slate-400 px-1">
                   MediMind AI
                 </h3>
                 <div className="px-5 py-3.5 rounded-2xl max-w-[85%] shadow-sm bg-[#EFE8DD] text-[#0F0F0F] rounded-tl-sm dark:bg-[#1A1A1A] dark:text-white flex items-center gap-2">
                    <motion.span animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2.5 h-2.5 bg-[#1A1A1A] dark:bg-white rounded-full"></motion.span>
                    <motion.span animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2.5 h-2.5 bg-[#3A3A3A] dark:bg-gray-300 rounded-full"></motion.span>
                    <motion.span animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2.5 h-2.5 bg-[#4B4B4B] dark:bg-gray-400 rounded-full"></motion.span>
                 </div>
               </div>
             </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Image Preview Area */}
        {imagePreview && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 relative flex items-center"
          >
            <div className="relative inline-block">
              <img src={imagePreview} alt="Preview" className="h-16 w-16 object-cover rounded-lg border border-slate-300 shadow-sm" />
              <button 
                type="button" 
                onClick={removeImagePreview}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600 transition-colors"
                title="Remove image"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <span className="ml-3 text-sm text-gray-500">Scan selected for analysis</span>
          </motion.div>
        )}

        {/* Input Area */}
        <div className="p-4 md:p-6 bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl border-t border-white/20 dark:border-white/5 relative z-10">
          <form onSubmit={handleSend} className="flex gap-2 max-w-4xl mx-auto items-center">
            <input 
              type="file" 
              ref={fileInputRef} 
              accept="image/*" 
              className="hidden" 
              onChange={handleImageUpload} 
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Upload Scan"
              className="p-3.5 rounded-2xl transition-all duration-300 bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 border border-transparent shadow-sm text-slate-500 hover:text-primary hover:shadow-md"
            >
              <ImagePlus className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={startVoiceInput}
              title="Voice Input"
              className={`p-3.5 rounded-2xl transition-all duration-300 shadow-sm ${
                isListening 
                  ? 'bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20' 
                  : 'bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 border-transparent text-slate-500 hover:text-primary hover:shadow-md'
              }`}
            >
              <div className={isListening ? 'relative' : ''}>
                {isListening && <span className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping"></span>}
                {isListening ? <MicOff className="w-6 h-6 relative z-10" /> : <Mic className="w-6 h-6 relative z-10" />}
              </div>
            </button>
            
            <div className="flex-1 relative">
              <input
                type="text"
                className="w-full px-5 py-4 rounded-2xl bg-white/60 dark:bg-black/20 border border-slate-200 dark:border-slate-700/50 focus:bg-white dark:focus:bg-slate-900/80 shadow-inner focus:shadow-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 text-textMain dark:text-gray-100 placeholder-slate-400 outline-none"
                placeholder="Type your medical query here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || (!input.trim() && !imagePreview)}
              className="bg-gradient-to-tr from-primary to-accent hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 active:scale-95 text-white p-4 rounded-2xl transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center border-none"
            >
              <Send className="w-6 h-6" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
