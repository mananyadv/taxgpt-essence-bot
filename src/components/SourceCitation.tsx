
import { useState } from 'react';
import { Source } from '@/types/chat';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

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
        <span>Sources {`(${sources.length})`}</span>
        {expanded ? (
          <ChevronUp size={14} className="text-gray-400" />
        ) : (
          <ChevronDown size={14} className="text-gray-400" />
        )}
      </Button>

      {expanded && (
        <div className="mt-2 space-y-3 text-sm animate-fade-in">
          {sources.map((source) => (
            <div 
              key={source.id} 
              className="p-3 rounded-md bg-gray-50 border border-gray-100"
            >
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-medium text-gray-800">{source.title}</h4>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                  #{source.id}
                </span>
              </div>
              <p className="text-gray-600 text-xs leading-relaxed mb-2">{source.content}</p>
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SourceCitation;
