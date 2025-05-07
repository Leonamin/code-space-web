
import React, { useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Plus, Code } from "lucide-react";
import { api, CodeSpace, CodePieceSummary } from "@/services/api";
import CodePieceCard from "@/components/CodePieceCard";
import FloatingActionButton from "@/components/FloatingActionButton";
import InfiniteScroll from "@/components/InfiniteScroll";
import { toast } from "sonner";

const CodeSpaceDetails: React.FC = () => {
  const navigate = useNavigate();
  const { spaceId } = useParams<{ spaceId: string }>();
  const [page, setPage] = useState(0);
  const [codePieces, setCodePieces] = useState<CodePieceSummary[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [selectedPieces, setSelectedPieces] = useState<number[]>([]);

  // Fetch CodeSpace details
  const { data: codeSpaceDetails } = useQuery({
    queryKey: ["codeSpace", spaceId],
    queryFn: () => {
      // Normally we'd fetch the CodeSpace details by ID, but the API doesn't support it
      // Instead, we'll show a basic UI and rely on the CodePiece list
      return Promise.resolve({} as CodeSpace);
    },
  });

  // Fetch CodePieces
  const { isLoading, refetch } = useQuery({
    queryKey: ["codePieces", spaceId, page],
    queryFn: () => api.getCodePieces(Number(spaceId), page),
    onSuccess: (newData) => {
      if (newData.length === 0) {
        setHasMore(false);
      } else {
        setCodePieces((prev) => [...prev, ...newData]);
      }
    },
    onError: () => {
      toast.error("Failed to load code pieces");
    },
    enabled: !!spaceId,
  });

  const loadMore = useCallback(() => {
    setPage((prevPage) => prevPage + 1);
  }, []);

  const handleSelect = (id: number) => {
    setSelectedPieces((prev) => {
      const isSelected = prev.includes(id);
      if (isSelected) {
        return prev.filter((pieceId) => pieceId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleViewDetails = (id: number) => {
    navigate(`/pieces/${id}`);
  };

  const handleCreateCodePiece = () => {
    navigate(`/spaces/${spaceId}/pieces/create`);
  };

  const handleCompare = () => {
    const pieceIds = selectedPieces.join(",");
    navigate(`/pieces/compare/${pieceIds}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          {codeSpaceDetails?.name || "CodeSpace"}
        </h1>
        <p className="text-gray-600">
          {codeSpaceDetails?.description || "Browse and manage code pieces in this space"}
        </p>
        {codeSpaceDetails?.owner_name && (
          <p className="text-sm text-gray-500 mt-2">Created by {codeSpaceDetails.owner_name}</p>
        )}
      </div>

      <InfiniteScroll
        loadMore={loadMore}
        hasMore={hasMore}
        loading={isLoading}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {codePieces.map((codePiece) => (
          <CodePieceCard
            key={codePiece.id}
            codePiece={codePiece}
            isSelected={selectedPieces.includes(codePiece.id)}
            onSelect={handleSelect}
            onViewDetails={handleViewDetails}
          />
        ))}
      </InfiniteScroll>

      {codePieces.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center p-8">
          <p className="text-gray-500 mb-4">No code pieces found</p>
          <p className="text-gray-500">Create your first code piece to get started!</p>
        </div>
      )}

      {selectedPieces.length > 0 ? (
        <FloatingActionButton
          icon={<Code size={24} />}
          onClick={handleCompare}
          label={`Compare (${selectedPieces.length})`}
          position="bottom-center"
          variant="accent"
        />
      ) : (
        <FloatingActionButton
          icon={<Plus size={24} />}
          onClick={handleCreateCodePiece}
          label="Create"
        />
      )}
    </div>
  );
};

export default CodeSpaceDetails;
