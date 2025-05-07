
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
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
  const [codePieces, setCodePieces] = useState<CodePieceDetail[]>([]);
  const [loadingCount, setLoadingCount] = useState(0);
  const [activeTab, setActiveTab] = useState("0");
  const [descriptionDialogOpen, setDescriptionDialogOpen] = useState(false);
  const [selectedPieceForDescription, setSelectedPieceForDescription] = useState<CodePieceDetail | null>(null);

  // Parse the pieceIds parameter
  useEffect(() => {
    if (pieceIds) {
      const ids = pieceIds.split(",").map(Number).filter(id => !isNaN(id));
      setPieceIdArray(ids);
      setLoadingCount(ids.length);
    }
  }, [pieceIds]);

  // Fetch each code piece
  const queries = pieceIdArray.map((id) => 
    useQuery({
      queryKey: ["compareCodePiece", id],
      queryFn: () => api.getCodePieceDetail(id),
      onSuccess: (data) => {
        setCodePieces((prev) => {
          const exists = prev.some((p) => p.id === data.id);
          if (!exists) {
            return [...prev, data];
          }
          return prev;
        });
        setLoadingCount((prev) => Math.max(0, prev - 1));
      },
      onError: () => {
        toast.error(`Failed to load code piece ${id}`);
        setLoadingCount((prev) => Math.max(0, prev - 1));
      },
    })
  );

  // Navigate back to the CodeSpace page
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

  // Sort the code pieces by ID to ensure consistent ordering
  const sortedCodePieces = [...codePieces].sort((a, b) => a.id - b.id);

  // Determine the layout based on the number of pieces
  const getLayout = () => {
    // For mobile, we just use tabs
    if (isMobile) {
      return "tabs";
    }

    // For desktop, use grid layout
    switch (sortedCodePieces.length) {
      case 2:
        return "two-column";
      case 3:
        return "three-column";
      case 4:
        return "four-quad";
      default:
        return "tabs"; // Fallback to tabs for other cases
    }
  };

  const layout = getLayout();

  // Render loading state
  if (loadingCount > 0) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Render error state if no pieces were found
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

  // Render the comparison view
  return (
    <div className="container mx-auto px-4 py-8">
      <Button onClick={handleBack} variant="ghost" className="flex items-center gap-2 mb-4">
        <ChevronLeft size={16} /> Go Back
      </Button>

      <h1 className="text-2xl font-bold mb-6 text-primary">Compare Code Pieces</h1>

      {/* Mobile view uses tabs */}
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
              <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium">{piece.name}</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShowDescription(piece)}
                    className="flex items-center gap-1"
                  >
                    <Info size={16} />
                    <span>Details</span>
                  </Button>
                </div>
                <p className="text-sm mb-2">
                  <span className="font-medium">Author:</span> {piece.owner_name}
                </p>
                <p className="text-sm mb-4">
                  <span className="font-medium">Language:</span> {piece.language}
                </p>
                <CodeEditor code={piece.code} language={piece.language} readOnly />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}

      {/* Desktop view uses grid layout */}
      {layout === "two-column" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedCodePieces.map((piece) => (
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
                  <span>Details</span>
                </Button>
              </div>
              <p className="text-sm mb-2">
                <span className="font-medium">Author:</span> {piece.owner_name}
              </p>
              <p className="text-sm mb-4">
                <span className="font-medium">Language:</span> {piece.language}
              </p>
              <CodeEditor code={piece.code} language={piece.language} readOnly />
            </div>
          ))}
        </div>
      )}

      {layout === "three-column" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {sortedCodePieces.map((piece) => (
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
                  <span>Details</span>
                </Button>
              </div>
              <p className="text-sm mb-2">
                <span className="font-medium">Author:</span> {piece.owner_name}
              </p>
              <p className="text-sm mb-4">
                <span className="font-medium">Language:</span> {piece.language}
              </p>
              <CodeEditor code={piece.code} language={piece.language} readOnly />
            </div>
          ))}
        </div>
      )}

      {layout === "four-quad" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {sortedCodePieces.map((piece) => (
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
                  <span>Details</span>
                </Button>
              </div>
              <p className="text-sm mb-2">
                <span className="font-medium">Author:</span> {piece.owner_name}
              </p>
              <p className="text-sm mb-4">
                <span className="font-medium">Language:</span> {piece.language}
              </p>
              <CodeEditor code={piece.code} language={piece.language} readOnly />
            </div>
          ))}
        </div>
      )}

      {/* Description Dialog */}
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
              <span className="font-medium">Author:</span> {selectedPieceForDescription?.owner_name}
            </div>
            <div className="text-sm mb-2">
              <span className="font-medium">Language:</span> {selectedPieceForDescription?.language}
            </div>
            <div className="text-sm">
              <span className="font-medium">Created:</span>{" "}
              {new Date(selectedPieceForDescription?.created_at || "").toLocaleString()}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ComparePieces;
