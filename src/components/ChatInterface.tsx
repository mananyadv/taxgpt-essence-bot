
import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message } from '../types/chat';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import { generateTaxResponse } from '../services/gemini';
import { useToast } from "@/components/ui/use-toast";

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content: 'Hello, I\'m TaxBot, your tax assistant. How can I help you with your tax questions today?',
  timestamp: new Date(),
  sources: []
};

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const addUserMessage = (content: string) => {
    const newMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
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
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="h-full flex flex-col">
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
      
      <div className="p-4 border-t border-gray-100 bg-gradient-to-b from-transparent to-white">
        <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        <p className="text-xs text-center text-gray-400 mt-2">
          TaxBot provides tax information but should not be considered formal tax advice.
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
