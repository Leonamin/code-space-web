
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CodePieceSummary } from "@/services/api";
import { Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodePieceCardProps {
  codePiece: CodePieceSummary;
  isSelected?: boolean;
  onSelect?: (id: number) => void;
  onViewDetails?: (id: number) => void;
}

const CodePieceCard: React.FC<CodePieceCardProps> = ({
  codePiece,
  isSelected = false,
  onSelect,
  onViewDetails,
}) => {
  const { id, name, description, language, owner_name } = codePiece;

  const handleClick = () => {
    if (onSelect) {
      onSelect(id);
    }
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onViewDetails) {
      onViewDetails(id);
    }
  };

  // Language badge color based on language
  const getLanguageColor = (lang: string) => {
    const colors: Record<string, string> = {
      java: "bg-red-100 text-red-800",
      python: "bg-blue-100 text-blue-800",
      javascript: "bg-yellow-100 text-yellow-800",
      typescript: "bg-blue-100 text-blue-800",
      c: "bg-gray-100 text-gray-800",
      "c++": "bg-purple-100 text-purple-800",
      "c#": "bg-green-100 text-green-800",
      php: "bg-indigo-100 text-indigo-800",
      dart: "bg-cyan-100 text-cyan-800",
      swift: "bg-orange-100 text-orange-800",
      kotlin: "bg-purple-100 text-purple-800",
      ruby: "bg-red-100 text-red-800",
      go: "bg-blue-100 text-blue-800",
    };
    return colors[lang.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  return (
    <Card
      className={cn(
        "h-full cursor-pointer transition-all hover:shadow-lg animate-scale-in",
        isSelected ? "bg-secondary border-primary border-2" : "bg-white"
      )}
      onClick={handleClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
        <CardTitle className="text-lg font-bold text-primary">{name}</CardTitle>
        <button
          onClick={handleViewDetails}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100"
          aria-label="View details"
        >
          <Eye size={18} className="text-gray-600" />
        </button>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="line-clamp-2 text-sm text-gray-600 mb-2">
          {description || "No description provided"}
        </p>
        <div className="flex items-center mt-1">
          <span className={`text-xs px-2 py-1 rounded-full ${getLanguageColor(language)}`}>
            {language}
          </span>
        </div>
      </CardContent>
      <CardFooter className="pt-0 text-xs text-gray-500">
        <span>By {owner_name}</span>
      </CardFooter>
    </Card>
  );
};

export default CodePieceCard;
