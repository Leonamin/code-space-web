import React, { useRef, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
interface CodeEditorProps {
  code: string;
  language: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, language, onChange, readOnly = false }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 동적 높이 조절
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [code]);

  // 읽기 전용 - Syntax Highlighting
  if (readOnly) {
    return (
      <div className="rounded-md border overflow-hidden">
        <div className="bg-secondary px-4 py-2 text-sm font-medium">{language}</div>
        <SyntaxHighlighter language={language.toLowerCase()} style={oneLight} customStyle={{ margin: 0, padding: '1rem' }}>
          {code}
        </SyntaxHighlighter>
      </div>
    );
  }

  // 편집 가능 - Textarea
  return (
    <div className="rounded-md border overflow-hidden">
      <div className="bg-secondary px-4 py-2 text-sm font-medium">{language}</div>
      <textarea
        ref={textareaRef}
        value={code}
        onChange={(e) => onChange && onChange(e.target.value)}
        className="w-full p-4 font-mono text-sm focus:outline-none bg-white"
        placeholder={`Enter your ${language} code here...`}
        spellCheck="false"
      />
    </div>
  );
};

export default CodeEditor;
