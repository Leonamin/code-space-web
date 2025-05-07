
import React from "react";

interface CodeEditorProps {
  code: string;
  language: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
}

// Simple code highlighting component (in real app, you'd use a library like Prism.js or CodeMirror)
const CodeEditor: React.FC<CodeEditorProps> = ({ code, language, onChange, readOnly = false }) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className="rounded-md border bg-secondary/20 overflow-hidden">
      <div className="bg-secondary px-4 py-2 text-sm font-medium flex items-center justify-between">
        <span>{language}</span>
      </div>
      <textarea
        value={code}
        onChange={handleChange}
        readOnly={readOnly}
        className={`w-full min-h-[200px] p-4 font-mono text-sm focus:outline-none ${
          readOnly ? "bg-gray-50" : "bg-white"
        }`}
        placeholder={`Enter your ${language} code here...`}
        spellCheck="false"
      />
    </div>
  );
};

export default CodeEditor;
