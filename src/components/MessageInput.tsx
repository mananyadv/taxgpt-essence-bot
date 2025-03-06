
import { useState, FormEvent, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendIcon } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const MessageInput = ({ onSendMessage, isLoading }: MessageInputProps) => {
  const [message, setMessage] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Auto-focus the textarea when component mounts
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
      
      // Refocus the textarea after sending
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 10);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  return (
    <form 
      onSubmit={handleSubmit}
      className="flex items-end gap-2 bg-white/50 backdrop-blur-sm border border-gray-100 rounded-xl p-3 shadow-sm transition-all duration-300 focus-within:border-siemens-primary focus-within:shadow-md animate-slide-up"
    >
      <Textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask about tax information..."
        className="min-h-[44px] max-h-[120px] resize-none bg-transparent border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 px-2"
        disabled={isLoading}
      />
      <Button 
        type="submit" 
        size="icon"
        disabled={isLoading || !message.trim()}
        className={`h-10 w-10 rounded-full shrink-0 transition-all duration-200 ${
          !message.trim() || isLoading 
            ? 'bg-gray-200 text-gray-400' 
            : 'bg-siemens-primary hover:bg-siemens-tertiary'
        }`}
      >
        <SendIcon size={18} className={`transition-transform duration-200 ${isLoading ? 'animate-pulse-light' : ''}`} />
      </Button>
    </form>
  );
};

export default MessageInput;
