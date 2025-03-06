
import { Message } from '@/types/chat';
import SourceCitation from './SourceCitation';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const bubbleRef = useRef<HTMLDivElement>(null);
  const isUser = message.role === 'user';
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (bubbleRef.current) {
      bubbleRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Animate in after a short delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [message.content, message.isLoading]);

  const bubbleVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 500, 
        damping: 30,
        mass: 1
      }
    }
  };

  const loadingVariants = {
    start: {
      transition: {
        staggerChildren: 0.2
      }
    },
    end: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const loadingCircle = {
    start: {
      y: "0%"
    },
    end: {
      y: "100%"
    }
  };

  const loadingTransition = {
    duration: 0.5,
    yoyo: Infinity,
    ease: "easeInOut"
  };

  return (
    <div 
      ref={bubbleRef}
      className={`group px-4 py-3 flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <motion.div 
        className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 ${
          isUser 
            ? 'bg-siemens-primary text-white shadow-md hover:shadow-lg transition-shadow' 
            : 'bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-gray-800'
        }`}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        variants={bubbleVariants}
        whileHover={{ scale: 1.01 }}
      >
        {message.isLoading ? (
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock size={16} className="animate-pulse" />
              <span>TaxBot is thinking...</span>
            </div>
            <motion.div
              className="flex items-center space-x-2 mt-2"
              variants={loadingVariants}
              initial="start"
              animate="end"
            >
              {[0, 1, 2].map(index => (
                <motion.div
                  key={index}
                  className="h-2 w-2 bg-siemens-primary rounded-full"
                  variants={loadingCircle}
                  transition={{
                    ...loadingTransition,
                    delay: index * 0.15
                  }}
                />
              ))}
            </motion.div>
          </div>
        ) : (
          <>
            <div className="whitespace-pre-wrap text-sm">
              {message.content}
              {!isUser && !message.isLoading && (
                <div className="flex items-center mt-2 text-xs text-gray-400">
                  <CheckCircle size={12} className="mr-1" />
                  <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
                </div>
              )}
            </div>
            {!isUser && message.sources && message.sources.length > 0 && (
              <SourceCitation sources={message.sources} />
            )}
          </>
        )}
      </motion.div>
    </div>
  );
};

export default MessageBubble;
