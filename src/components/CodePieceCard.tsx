
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CodePieceSummary } from "@/services/api";
import { cn } from "@/lib/utils";
import { api } from "@/services/api";
import { toast } from "sonner";
import { CardActions } from "./codePiece/CardActions";
import { DeleteDialog } from "./codePiece/DeleteDialog";
import { useNavigate } from "react-router-dom";

interface CodePieceCardProps {
  codePiece: CodePieceSummary;
  isSelected?: boolean;
  onSelect?: (id: number) => void;
  onViewDetails?: (id: number) => void;
  onDeleted?: () => void;
}

const CodePieceCard: React.FC<CodePieceCardProps> = ({
  codePiece,
  isSelected = false,
  onSelect,
  onViewDetails,
  onDeleted,
}) => {
  const { id, name, description, language, owner_name } = codePiece;
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/pieces/${id}/edit`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async (password: string) => {
    try {
      await api.deleteCodePiece(id, password);
      toast.success("코드 피스가 삭제되었습니다");
      setShowDeleteDialog(false);
      if (onDeleted) onDeleted();
    } catch (error) {
      toast.error("삭제에 실패했습니다. 비밀번호를 확인해주세요.");
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
    <>
      <Card
        className={cn(
          "h-full cursor-pointer transition-all hover:shadow-lg animate-scale-in",
          isSelected ? "bg-secondary border-primary border-2" : "bg-white"
        )}
        onClick={handleClick}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
          <CardTitle className="text-lg font-bold text-primary">{name}</CardTitle>
          <CardActions 
            onViewDetails={handleViewDetails}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
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

      <DeleteDialog 
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
        pieceName={name}
      />
    </>
  );
};

export default CodePieceCard;
