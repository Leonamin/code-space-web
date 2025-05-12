import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";

interface MarkdownViewerProps {
    content: string;
}

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content }) => {
    return (
        <div className="prose prose-sm sm:prose lg:prose-lg max-w-none">
            <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
                {content}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownViewer;
