
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { api, CodeSpace } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { DeleteDialog } from "./codePiece/DeleteDialog";
import { CardActions } from "./codeSpace/CardActions";
import MarkdownViewer from "./MarkdownViewer";

interface CodeSpaceCardProps {
  codeSpace: CodeSpace;
  onDeleted?: () => void;
}

const CodeSpaceCard: React.FC<CodeSpaceCardProps> = ({
  codeSpace,
  onDeleted,
}) => {
  const navigate = useNavigate();
  const { id, name, description, owner_name } = codeSpace;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleClick = () => {
    navigate(`/spaces/${id}`);
  };

  // Format date into readable string
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/spaces/${id}/edit`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async (password: string) => {
    try {
      await api.deleteCodeSpace(id, password);
      toast.success("코드스페이스가 삭제되었습니다");
      setShowDeleteDialog(false);
      if (onDeleted) onDeleted();
    } catch (error) {
      toast.error("삭제에 실패했습니다. 비밀번호를 확인해주세요.");
    }
  };

  return (
    <>
      <Card
        className="h-full cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] bg-white animate-scale-in"
        onClick={handleClick}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
          <CardTitle className="text-lg font-bold text-primary">{name}</CardTitle>
          <CardActions
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardHeader>
        <CardContent className="pb-2">
          {description ? (
            <div className="line-clamp-3">
              <MarkdownViewer 
                content={description} 
                truncate={true} 
                maxLength={100}
                className="prose-sm text-gray-600"
              />
            </div>
          ) : (
            <p className="text-sm text-gray-600">No description provided</p>
          )}
        </CardContent>
        <CardFooter className="flex justify-between pt-0 text-xs text-gray-500">
          <span>By {owner_name}</span>
          <span>{formatDate(codeSpace.created_at)}</span>
        </CardFooter>
      </Card>

      <DeleteDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
        title="코드스페이스 삭제 확인"
        description={`'${name}' 코드스페이스를 삭제하려면 비밀번호를 입력해주세요.\n코드스페이스를 삭제하면 하위 코드피스에 접근할 수 없습니다!`}
      />
    </>
  );
};

export default CodeSpaceCard;
