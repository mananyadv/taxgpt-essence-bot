
import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message } from '../types/chat';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import { generateTaxResponse } from '../services/gemini';
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, RefreshCcw, Zap, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content: 'Hello, I\'m TaxBot, your tax assistant. How can I help you with your tax questions today?',
  timestamp: new Date(),
  sources: []
};

const EXAMPLE_QUESTIONS = [
  "What are the standard tax deductions for 2023?",
  "How do I calculate capital gains tax?",
  "What's the difference between tax credits and deductions?",
  "When is the tax filing deadline for 2024?"
];

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [loadingDots, setLoadingDots] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingDots(prev => prev.length < 3 ? prev + '.' : '');
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const addUserMessage = (content: string) => {
    const newMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
    if (!conversationStarted) {
      setConversationStarted(true);
    }
    return newMessage;
  };

  const addAssistantMessage = (loadingId?: string) => {
    const newMessage: Message = {
      id: loadingId || uuidv4(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isLoading: true
    };
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
    return newMessage;
  };

  const updateAssistantMessage = (id: string, content: string, sources: any[] = []) => {
    setMessages(prevMessages => 
      prevMessages.map(msg => 
        msg.id === id 
          ? { ...msg, content, sources, isLoading: false } 
          : msg
      )
    );
  };

  const handleSendMessage = async (content: string) => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      setIsTyping(true);
      
      // Add user message
      addUserMessage(content);
      
      // Add loading message for assistant
      const assistantMsgId = uuidv4();
      addAssistantMessage(assistantMsgId);
      
      // Generate response using Gemini API
      const response = await generateTaxResponse(
        // Only include previous messages for context, excluding the loading message
        messages.filter(msg => !msg.isLoading)
      );
      
      // Update assistant message with response
      updateAssistantMessage(assistantMsgId, response.content, response.sources);
    } catch (error) {
      console.error('Error sending message:', error);
      
      toast({
        title: "Error",
        description: "Sorry, I couldn't process your request. Please try again.",
        variant: "destructive",
      });
      
      // Remove the loading message if there's an error
      setMessages(prevMessages => 
        prevMessages.filter(msg => !msg.isLoading)
      );
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleExampleClick = (question: string) => {
    handleSendMessage(question);
  };

  const clearChat = () => {
    setMessages([WELCOME_MESSAGE]);
    setConversationStarted(false);
    toast({
      title: "Chat cleared",
      description: "Your conversation has been reset.",
    });
  };

  const regenerateLastResponse = async () => {
    if (isLoading) return;
    
    // Find the last user message
    const lastUserMessageIndex = [...messages].reverse().findIndex(m => m.role === 'user');
    
    if (lastUserMessageIndex >= 0) {
      const lastUserMessage = [...messages].reverse()[lastUserMessageIndex];
      
      // Remove all messages after the last user message
      const messagesToKeep = messages.slice(0, messages.length - lastUserMessageIndex);
      setMessages(messagesToKeep);
      
      // Resend the last user message
      await handleSendMessage(lastUserMessage.content);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between px-4 pt-2">
        <AnimatePresence>
          {isTyping && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs text-siemens-primary flex items-center gap-1"
            >
              <Zap size={12} className="animate-pulse" />
              <span>TaxBot is thinking{loadingDots}</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="flex gap-2">
          {messages.length > 2 && (
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={regenerateLastResponse}
                disabled={isLoading}
                className="text-xs text-gray-500 hover:text-siemens-primary flex items-center gap-1"
              >
                <RefreshCcw size={14} className={isLoading ? "animate-spin" : ""} />
                <span>Regenerate</span>
              </Button>
            </motion.div>
          )}
          
          {messages.length > 1 && (
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={clearChat}
                className="text-xs text-gray-500 hover:text-red-500 flex items-center gap-1"
              >
                <Trash2 size={14} />
                <span>Clear chat</span>
              </Button>
            </motion.div>
          )}
        </div>
      </div>
      
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
      >
        <div className="py-4 px-2 md:px-4">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </div>
      </div>
      
      {!conversationStarted && (
        <motion.div 
          className="px-4 pb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.p 
            className="text-sm text-center text-gray-500 mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Try asking about:
          </motion.p>
          <div className="flex flex-wrap gap-2 justify-center">
            {EXAMPLE_QUESTIONS.map((question, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 4px 12px rgba(0, 143, 213, 0.15)" 
                }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExampleClick(question)}
                  className="text-xs bg-white hover:bg-siemens-primary/10 border-siemens-primary/30 text-siemens-primary hover:text-siemens-tertiary transition-all duration-300"
                >
                  {question}
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
      
      <div className="p-4 border-t border-gray-100 bg-gradient-to-b from-transparent to-white">
        <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        <div className="flex items-center justify-center gap-1 text-xs text-center text-gray-400 mt-2">
          <HelpCircle size={12} />
          <p>TaxBot provides tax information but should not be considered formal tax advice.</p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
