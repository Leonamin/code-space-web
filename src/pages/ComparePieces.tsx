import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import { api, CodePieceDetail } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CodeEditor from "@/components/CodeEditor";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronLeft, Info } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ComparePieces: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { pieceIds } = useParams<{ pieceIds: string }>();
  const [pieceIdArray, setPieceIdArray] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState("0");
  const [descriptionDialogOpen, setDescriptionDialogOpen] = useState(false);
  const [selectedPieceForDescription, setSelectedPieceForDescription] = useState<CodePieceDetail | null>(null);

  // 파라미터에서 pieceIds를 숫자 배열로 파싱
  useEffect(() => {
    if (pieceIds) {
      const ids = pieceIds.split(",").map(Number).filter(id => !isNaN(id));
      setPieceIdArray(ids);
    }
  }, [pieceIds]);

  // 각 코드 조각을 가져오는 useQueries
  const queries = useQueries({
    queries: pieceIdArray.map((id) => ({
      queryKey: ["compareCodePiece", id],
      queryFn: () => api.getCodePieceDetail(id),
      onError: () => toast.error(`Failed to load code piece ${id}`),
      enabled: pieceIdArray.length > 0,
    })),
  });

  // 로딩 여부 및 성공한 데이터 필터링
  const isLoading = queries.some((q) => q.isLoading);
  const codePieces = queries
      .map((q) => q.data)
      .filter((data): data is CodePieceDetail => !!data);

  const handleBack = () => {
    if (codePieces.length > 0) {
      navigate(`/spaces/${codePieces[0].space_id}`);
    } else {
      navigate(-1);
    }
  };

  const handleShowDescription = (piece: CodePieceDetail) => {
    setSelectedPieceForDescription(piece);
    setDescriptionDialogOpen(true);
  };

  const sortedCodePieces = [...codePieces].sort((a, b) => a.id - b.id);

  const getLayout = () => {
    if (isMobile) return "tabs";
    switch (sortedCodePieces.length) {
      case 2: return "two-column";
      case 3: return "three-column";
      case 4: return "four-quad";
      default: return "tabs";
    }
  };

  const layout = getLayout();

  if (isLoading) {
    return (
        <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );
  }

  if (sortedCodePieces.length === 0) {
    return (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-4 text-primary">No Code Pieces Found</h1>
          <Button onClick={() => navigate("/")} className="flex items-center gap-2">
            <ChevronLeft size={16} /> Go Home
          </Button>
        </div>
    );
  }

  const renderCard = (piece: CodePieceDetail) => (
      <div key={piece.id} className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">{piece.name}</h2>
          <Button
              variant="ghost"
              size="sm"
              onClick={() => handleShowDescription(piece)}
              className="flex items-center gap-1"
          >
            <Info size={16} />
            <span>자세히</span>
          </Button>
        </div>
        <p className="text-sm mb-2">
          <span className="font-medium">작성자:</span> {piece.owner_name}
        </p>
        <p className="text-sm mb-4">
          <span className="font-medium">언어:</span> {piece.language}
        </p>
        <CodeEditor code={piece.code} language={piece.language} readOnly />
      </div>
  );

  return (
      <div className="container mx-auto px-4 py-8">
        <Button onClick={handleBack} variant="ghost" className="flex items-center gap-2 mb-4">
          <ChevronLeft size={16} /> 뒤로가기
        </Button>

        <h1 className="text-2xl font-bold mb-6 text-primary">코드 비교</h1>

        {layout === "tabs" && (
            <Tabs defaultValue="0" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4 w-full justify-start overflow-auto">
                {sortedCodePieces.map((piece, index) => (
                    <TabsTrigger key={piece.id} value={index.toString()}>
                      {piece.name}
                    </TabsTrigger>
                ))}
              </TabsList>
              {sortedCodePieces.map((piece, index) => (
                  <TabsContent key={piece.id} value={index.toString()}>
                    {renderCard(piece)}
                  </TabsContent>
              ))}
            </Tabs>
        )}

        {layout === "two-column" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sortedCodePieces.map(renderCard)}
            </div>
        )}

        {layout === "three-column" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {sortedCodePieces.map(renderCard)}
            </div>
        )}

        {layout === "four-quad" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {sortedCodePieces.map(renderCard)}
            </div>
        )}

        <Dialog open={descriptionDialogOpen} onOpenChange={setDescriptionDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedPieceForDescription?.name}</DialogTitle>
              <DialogDescription>
                {selectedPieceForDescription?.description || "No description provided."}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <div className="text-sm mb-2">
                <span className="font-medium">작성자:</span> {selectedPieceForDescription?.owner_name}
              </div>
              <div className="text-sm mb-2">
                <span className="font-medium">언어:</span> {selectedPieceForDescription?.language}
              </div>
              <div className="text-sm">
                <span className="font-medium">시간:</span>{" "}
                {new Date(selectedPieceForDescription?.created_at || "").toLocaleString()}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
  );
};

export default ComparePieces;
