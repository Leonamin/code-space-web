import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import CodeEditor from "@/components/CodeEditor";
import { ChevronLeft, Edit, Trash } from "lucide-react";
import { toast } from "sonner";
import { DeleteDialog } from "@/components/codePiece/DeleteDialog";

const CodePieceDetails: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { pieceId } = useParams<{ pieceId: string }>();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const { data: codePiece, isLoading } = useQuery({
        queryKey: ["codePiece", pieceId],
        queryFn: () => api.getCodePieceDetail(Number(pieceId)),
        meta: {
            onSettled: (_, error) => {
                if (error) {
                    toast.error(t('codePiece.errors.loadFailed'));
                }
            },
        },
    });

    // Navigate back to the CodeSpace page
    const handleBack = () => {
        if (codePiece && codePiece.space_id) {
            navigate(`/spaces/${codePiece.space_id}`);
        } else {
            navigate(-1);
        }
    };

    const handleEdit = () => {
        navigate(`/pieces/${pieceId}/edit`);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowDeleteDialog(true);
    };

    const handleDeleteConfirm = async (password: string) => {
        try {
            await api.deleteCodePiece(Number(pieceId), password);
            toast.success(t('codePiece.success.deleted'));
            setShowDeleteDialog(false);
            handleBack();
        } catch (error) {
            toast.error(t('codePiece.errors.deleteFailed'));
        }
    };

    const formatDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            return new Intl.DateTimeFormat('en-US', {
                year: 'numeric', month: 'long', day: 'numeric',
                hour: '2-digit', minute: '2-digit'
            }).format(date);
        } catch {
            return dateStr;
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!codePiece) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-4 text-primary">{t('codePiece.notFound')}</h1>
                <Button onClick={handleBack} className="flex items-center gap-2">
                    <ChevronLeft size={16} /> {t('codePiece.back')}
                </Button>
            </div>
        );
    }

    return (
        <>
            <div className="container mx-auto px-4 py-8">
                <Button
                    onClick={handleBack}
                    variant="ghost"
                    className="flex items-center gap-2 mb-4"
                >
                    <ChevronLeft size={16} /> {t('codePiece.back')}
                </Button>

                <div className="bg-white rounded-lg shadow-md p-6 animate-fade-in mb-8">
                    <div className="flex justify-between items-start">
                        <h1 className="text-2xl font-bold mb-2 text-primary">{codePiece.name}</h1>
                        <div className="flex items-center gap-2">
                            <Button
                                onClick={handleDelete}
                                className="flex items-center gap-2"
                                variant="destructive"
                            >
                                <Trash size={16} /> {t('common.delete')}
                            </Button>
                            <Button
                                onClick={handleEdit}
                                className="flex items-center gap-2"
                            >
                                <Edit size={16} /> {t('common.edit')}
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mb-4">
                        <div className="bg-secondary/50 px-3 py-1 rounded-md text-sm">
                            <span className="font-medium">{t('codePiece.language')}:</span> {codePiece.language}
                        </div>
                        <div className="bg-secondary/50 px-3 py-1 rounded-md text-sm">
                            <span className="font-medium">{t('codePiece.author')}:</span> {codePiece.owner_name}
                        </div>
                        <div className="bg-secondary/50 px-3 py-1 rounded-md text-sm">
                            <span className="font-medium">{t('codePiece.time')}:</span> {formatDate(codePiece.created_at)}
                        </div>
                    </div>

                    {codePiece.description && (
                        <div className="mb-6">
                            <h2 className="text-lg font-medium mb-2">{t('codePiece.description')}</h2>
                            <p className="text-gray-700">{codePiece.description}</p>
                        </div>
                    )}

                    <div>
                        <h2 className="text-lg font-medium mb-2">{t('codePiece.code')}</h2>
                        <CodeEditor
                            code={codePiece.code}
                            language={codePiece.language}
                            readOnly
                        />
                    </div>
                </div>
            </div>

            <DeleteDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={handleDeleteConfirm}
                title={t('codePiece.deleteConfirm.title')}
                description={t('codePiece.deleteConfirm.description', { name: codePiece.name })}
            />
        </>
    );
};

export default CodePieceDetails;
