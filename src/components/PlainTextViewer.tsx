import React from "react";

interface PlainTextViewerProps {
  content: string;
  maxLength?: number;
  maxLines?: number;
  className?: string;
}

function stripMarkdown(md: string): string {
  return md
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/`{1,3}[^`]*`{1,3}/g, "")
    .replace(/>\s?/g, "")
    .replace(/[*_~`]/g, "")
    .replace(/\|/g, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/---/g, "")
    .replace(/^\s+|\s+$/g, "");
}

const PlainTextViewer: React.FC<PlainTextViewerProps> = ({
  content,
  maxLength = 150,
  maxLines = 3,
  className = "",
}) => {
  if (!content) return null;

  // 마크다운 기호 제거
  let plain = stripMarkdown(content);

  // 최대 글자 수 제한
  if (plain.length > maxLength) {
    plain = plain.substring(0, maxLength) + "...";
  }

  // 최대 줄 수 제한
  const lines = plain.split("\n").slice(0, maxLines);
  const display = lines.join("\n");

  return (
    <div className={`whitespace-pre-line text-black ${className}`}>
      {display}
    </div>
  );
};

export default PlainTextViewer; 