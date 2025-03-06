
import { Message } from '@/types/chat';
import SourceCitation from './SourceCitation';
import { useEffect, useRef } from 'react';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const bubbleRef = useRef<HTMLDivElement>(null);
  const isUser = message.role === 'user';
  
  useEffect(() => {
    if (bubbleRef.current) {
      bubbleRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [message.content, message.isLoading]);

  return (
    <div 
      ref={bubbleRef}
      className={`group px-4 py-6 flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div 
        className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 ${
          isUser 
            ? 'bg-siemens-primary text-white' 
            : 'bg-white border border-gray-100 shadow-sm text-gray-800'
        } ${message.isLoading ? 'animate-pulse-light' : 'animate-fade-in'}`}
      >
        {message.isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 bg-gray-300 rounded-full animate-pulse"></div>
            <div className="h-2 w-2 bg-gray-300 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="h-2 w-2 bg-gray-300 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        ) : (
          <>
            <div className="whitespace-pre-wrap text-sm">{message.content}</div>
            {!isUser && message.sources && message.sources.length > 0 && (
              <SourceCitation sources={message.sources} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
