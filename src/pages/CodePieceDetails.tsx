import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import CodeEditor from "@/components/CodeEditor";
import { ChevronLeft, Edit, Trash } from "lucide-react";
import { toast } from "sonner";
import { DeleteDialog } from "@/components/codePiece/DeleteDialog";

const CodePieceDetails: React.FC = () => {
    const navigate = useNavigate();
    const { pieceId } = useParams<{ pieceId: string }>();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const { data: codePiece, isLoading } = useQuery({
        queryKey: ["codePiece", pieceId],
        queryFn: () => api.getCodePieceDetail(Number(pieceId)),
        meta: {
            onSettled: (_, error) => {
                if (error) {
                    toast.error("코드 피스 불러오기 실패!");
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
            toast.success("코드 피스가 삭제되었습니다");
            setShowDeleteDialog(false);
            handleBack();
        } catch (error) {
            toast.error("삭제에 실패했습니다. 비밀번호를 확인해주세요.");
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
                <h1 className="text-2xl font-bold mb-4 text-primary">Code Piece Not Found</h1>
                <Button onClick={handleBack} className="flex items-center gap-2">
                    <ChevronLeft size={16} /> 뒤로가기
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
                    <ChevronLeft size={16} /> 뒤로가기
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
                                <Trash size={16} /> 삭제하기
                            </Button>
                            <Button
                                onClick={handleEdit}
                                className="flex items-center gap-2"
                            >
                                <Edit size={16} /> 수정하기
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mb-4">
                        <div className="bg-secondary/50 px-3 py-1 rounded-md text-sm">
                            <span className="font-medium">언어:</span> {codePiece.language}
                        </div>
                        <div className="bg-secondary/50 px-3 py-1 rounded-md text-sm">
                            <span className="font-medium">작성자:</span> {codePiece.owner_name}
                        </div>
                        <div className="bg-secondary/50 px-3 py-1 rounded-md text-sm">
                            <span className="font-medium">시간:</span> {formatDate(codePiece.created_at)}
                        </div>
                    </div>

                    {codePiece.description && (
                        <div className="mb-6">
                            <h2 className="text-lg font-medium mb-2">설명</h2>
                            <p className="text-gray-700">{codePiece.description}</p>
                        </div>
                    )}

                    <div>
                        <h2 className="text-lg font-medium mb-2">코드</h2>
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
                pieceName={codePiece.name}
            />
        </>
    );
};

export default CodePieceDetails;
