
import React from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { AlertTriangle, Info, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const calloutTypes = {
  info: {
    icon: Info,
    className: 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800',
    iconClassName: 'text-blue-600 dark:text-blue-400',
    emoji: '💡'
  },
  warning: {
    icon: AlertTriangle,
    className: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800',
    iconClassName: 'text-yellow-600 dark:text-yellow-400',
    emoji: '⚠️'
  },
  success: {
    icon: CheckCircle,
    className: 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800',
    iconClassName: 'text-green-600 dark:text-green-400',
    emoji: '✅'
  },
  error: {
    icon: XCircle,
    className: 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800',
    iconClassName: 'text-red-600 dark:text-red-400',
    emoji: '❌'
  },
  note: {
    icon: AlertCircle,
    className: 'bg-gray-50 border-gray-200 dark:bg-gray-950 dark:border-gray-800',
    iconClassName: 'text-gray-600 dark:text-gray-400',
    emoji: '📝'
  }
};

interface CalloutComponentProps {
  node: {
    attrs: {
      type: keyof typeof calloutTypes;
      emoji?: string;
    };
  };
  updateAttributes: (attrs: any) => void;
  selected: boolean;
}

const CalloutComponent: React.FC<CalloutComponentProps> = ({ node, updateAttributes, selected }) => {
  const type = node.attrs.type || 'info';
  const calloutConfig = calloutTypes[type] || calloutTypes.info;
  const emoji = node.attrs.emoji || calloutConfig.emoji;

  return (
    <NodeViewWrapper className={`callout-wrapper ${selected ? 'ProseMirror-selectednode' : ''}`}>
      <div className={`callout border-l-4 p-4 my-4 rounded-r-lg ${calloutConfig.className}`}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-0.5">
            <span className="text-lg">{emoji}</span>
          </div>
          <div className="flex-1 min-w-0">
            <NodeViewContent className="callout-content prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0" />
          </div>
        </div>
      </div>
    </NodeViewWrapper>
  );
};

export default CalloutComponent;
