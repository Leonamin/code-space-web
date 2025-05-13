import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { api, CodeSpace } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { DeleteDialog } from "./codePiece/DeleteDialog";
import { CardActions } from "./codeSpace/CardActions";
import PlainTextViewer from "./PlainTextViewer";

interface CodeSpaceCardProps {
  codeSpace: CodeSpace;
  onDeleted?: () => void;
}

const CodeSpaceCard: React.FC<CodeSpaceCardProps> = ({
  codeSpace,
  onDeleted,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
      toast.success(t('common.success.deleted'));
      setShowDeleteDialog(false);
      if (onDeleted) onDeleted();
    } catch (error) {
      toast.error(t('common.errors.deleteFailed'));
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
              <PlainTextViewer
                content={description}
                maxLength={100}
                maxLines={3}
                className="text-gray-600"
              />
            </div>
          ) : (
            <p className="text-sm text-gray-600">{t('common.noDescription')}</p>
          )}
        </CardContent>
        <CardFooter className="flex justify-between pt-0 text-xs text-gray-500">
          <span>{t('common.by', { author: owner_name })}</span>
          <span>{formatDate(codeSpace.created_at)}</span>
        </CardFooter>
      </Card>

      <DeleteDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
        title={t('codeSpace.deleteConfirm.title')}
        description={t('codeSpace.deleteConfirm.description', { name })}
      />
    </>
  );
};

export default CodeSpaceCard;
