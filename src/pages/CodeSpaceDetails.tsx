
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api, CodeSpace, CodePiece } from "@/services/api";
import { Plus, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import CodePieceCard from "@/components/CodePieceCard";
import { DeleteDialog } from "@/components/codePiece/DeleteDialog";
import { Separator } from "@/components/ui/separator";
import MarkdownViewer from "@/components/MarkdownViewer";

const CodeSpaceDetails: React.FC = () => {
  const { spaceId } = useParams<{ spaceId: string }>();
  const navigate = useNavigate();
  const [codeSpace, setCodeSpace] = useState<CodeSpace | null>(null);
  const [codePieces, setCodePieces] = useState<CodePiece[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Convert string spaceId to number
  const id = spaceId ? Number(spaceId) : 0;

  const fetchData = async () => {
    try {
      setLoading(true);
      // Use Number(spaceId) to ensure we're passing a number to the API
      const space = await api.getCodeSpaceById(id);
      setCodeSpace(space);
      const pieces = await api.getCodePiecesBySpaceId(id);
      setCodePieces(pieces);
    } catch (error) {
      toast.error("데이터를 불러오는데 실패했습니다.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (spaceId) {
      fetchData();
    }
  }, [spaceId]);

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async (password: string) => {
    try {
      // Use Number(spaceId) to ensure we're passing a number to the API
      await api.deleteCodeSpace(id, password);
      toast.success("코드스페이스가 삭제되었습니다.");
      setShowDeleteDialog(false);
      navigate("/");
    } catch (error) {
      toast.error("삭제에 실패했습니다. 비밀번호를 확인해주세요.");
    }
  };

  const handleEdit = () => {
    navigate(`/spaces/${spaceId}/edit`);
  };

  const handleCreatePiece = () => {
    navigate(`/spaces/${spaceId}/pieces/create`);
  };

  const handleBack = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">로딩 중...</div>
      </div>
    );
  }

  if (!codeSpace) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">코드스페이스를 찾을 수 없습니다.</div>
        <div className="flex justify-center mt-4">
          <Button onClick={handleBack}>돌아가기</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="sm" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          돌아가기
        </Button>
      </div>

      <Card className="mb-8 bg-white shadow-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold text-primary">
              {codeSpace.name}
            </CardTitle>
            <div className="space-x-2">
              <Button variant="outline" onClick={handleEdit}>
                수정하기
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                삭제하기
              </Button>
            </div>
          </div>
          <CardDescription className="text-gray-500">
            작성자: {codeSpace.owner_name} | 작성일:{" "}
            {new Date(codeSpace.created_at).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {codeSpace.description ? (
            <div className="markdown-content">
              <MarkdownViewer 
                content={codeSpace.description} 
                className="prose-sm sm:prose max-w-none" 
              />
            </div>
          ) : (
            <p className="text-gray-500 italic">설명이 없습니다.</p>
          )}
        </CardContent>
      </Card>

      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold">코드 조각 목록</h2>
        <Button onClick={handleCreatePiece}>
          <Plus className="h-4 w-4 mr-2" />
          코드 조각 추가
        </Button>
      </div>

      <Separator className="my-4" />

      {codePieces.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">아직 코드 조각이 없습니다. 새로운 코드 조각을 추가해보세요.</p>
          <Button className="mt-4" onClick={handleCreatePiece}>
            첫번째 코드 조각 추가하기
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {codePieces.map((piece) => (
            <CodePieceCard
              key={piece.id}
              codePiece={piece}
              onDeleted={fetchData}
              codeSpaceId={id}
            />
          ))}
        </div>
      )}

      <DeleteDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
        title="코드스페이스 삭제 확인"
        description={`'${codeSpace.name}' 코드스페이스를 삭제하려면 비밀번호를 입력해주세요.\n코드스페이스를 삭제하면 하위 코드피스에 접근할 수 없습니다!`}
      />
    </div>
  );
};

export default CodeSpaceDetails;
