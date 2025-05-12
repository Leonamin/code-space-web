
import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";

interface MarkdownViewerProps {
    content: string;
    className?: string;
    truncate?: boolean;
    maxLength?: number;
}

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ 
    content, 
    className = "",
    truncate = false,
    maxLength = 150
}) => {
    // If content is empty, return null
    if (!content) return null;
    
    // Truncate content if needed
    const displayContent = truncate && content.length > maxLength 
        ? `${content.substring(0, maxLength)}...` 
        : content;
    
    return (
        <div className={`prose prose-sm sm:prose lg:prose-lg max-w-none 
            prose-headings:text-primary 
            prose-headings:font-semibold 
            prose-h1:text-2xl 
            prose-h2:text-xl 
            prose-h3:text-lg
            prose-a:text-accent 
            prose-strong:text-primary/90
            prose-code:bg-secondary/70 
            prose-code:p-0.5 
            prose-code:rounded 
            prose-pre:bg-secondary/30 
            prose-pre:rounded-md 
            prose-img:rounded-md 
            ${className}`}>
            <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
                {displayContent}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownViewer;
