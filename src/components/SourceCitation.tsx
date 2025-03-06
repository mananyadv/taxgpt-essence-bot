
import { useState } from 'react';
import { Source } from '@/types/chat';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, ExternalLink, BookOpen, FileText, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from "@/components/ui/use-toast";

interface SourceCitationProps {
  sources: Source[];
}

const SourceCitation = ({ sources }: SourceCitationProps) => {
  const [expanded, setExpanded] = useState(false);
  const [hoveredSource, setHoveredSource] = useState<string | null>(null);
  const { toast } = useToast();

  if (!sources || sources.length === 0) {
    return null;
  }

  const copySourceContent = (source: Source) => {
    navigator.clipboard.writeText(source.content);
    toast({
      title: "Copied to clipboard",
      description: "Source content has been copied to your clipboard.",
    });
  };

  return (
    <div className="mt-3 border-t border-gray-100 pt-2 text-sm">
      <Button
        variant="ghost"
        size="sm"
        className="p-0 h-auto text-xs flex items-center gap-1 text-gray-500 hover:text-siemens-primary hover:bg-transparent transition-all duration-300"
        onClick={() => setExpanded(!expanded)}
      >
        <BookOpen size={14} className="text-siemens-primary" />
        <span>Sources {`(${sources.length})`}</span>
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown size={14} className="text-gray-400" />
        </motion.div>
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
                className="p-3 rounded-md bg-gray-50 border border-gray-100 hover:border-siemens-primary hover:bg-gray-50/80 transition-all duration-300"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.01 }}
                onMouseEnter={() => setHoveredSource(source.id)}
                onMouseLeave={() => setHoveredSource(null)}
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
                <div className="flex pl-5 items-center gap-3">
                  {source.url && (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-siemens-primary hover:text-siemens-tertiary transition-colors"
                    >
                      <ExternalLink size={12} />
                      <span>View source</span>
                    </a>
                  )}
                  <AnimatePresence>
                    {(hoveredSource === source.id) && (
                      <motion.button
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -5 }}
                        className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-siemens-primary transition-colors"
                        onClick={() => copySourceContent(source)}
                      >
                        <Copy size={12} />
                        <span>Copy</span>
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SourceCitation;
