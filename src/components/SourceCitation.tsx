
import { useState } from 'react';
import { Source } from '@/types/chat';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, ExternalLink, BookOpen, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SourceCitationProps {
  sources: Source[];
}

const SourceCitation = ({ sources }: SourceCitationProps) => {
  const [expanded, setExpanded] = useState(false);

  if (!sources || sources.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 border-t border-gray-100 pt-2 text-sm">
      <Button
        variant="ghost"
        size="sm"
        className="p-0 h-auto text-xs flex items-center gap-1 text-gray-500 hover:text-siemens-primary hover:bg-transparent"
        onClick={() => setExpanded(!expanded)}
      >
        <BookOpen size={14} className="text-siemens-primary" />
        <span>Sources {`(${sources.length})`}</span>
        {expanded ? (
          <ChevronUp size={14} className="text-gray-400" />
        ) : (
          <ChevronDown size={14} className="text-gray-400" />
        )}
      </Button>

      <AnimatePresence>
        {expanded && (
          <motion.div 
            className="mt-2 space-y-3 text-sm"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {sources.map((source, index) => (
              <motion.div 
                key={source.id} 
                className="p-3 rounded-md bg-gray-50 border border-gray-100 hover:border-siemens-primary hover:bg-gray-50/80 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium text-gray-800 flex items-center">
                    <FileText size={14} className="mr-1 text-siemens-primary" />
                    {source.title}
                  </h4>
                  <span className="text-xs text-siemens-primary bg-siemens-primary/10 px-2 py-0.5 rounded-full">
                    #{source.id}
                  </span>
                </div>
                <p className="text-gray-600 text-xs leading-relaxed mb-2 pl-5">{source.content}</p>
                {source.url && (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-siemens-primary hover:text-siemens-tertiary transition-colors ml-5"
                  >
                    <ExternalLink size={12} />
                    <span>View source</span>
                  </a>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SourceCitation;
