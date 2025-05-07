
import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api, CodeSpace } from "@/services/api";
import CodeSpaceCard from "@/components/CodeSpaceCard";
import FloatingActionButton from "@/components/FloatingActionButton";
import InfiniteScroll from "@/components/InfiniteScroll";
import { toast } from "sonner";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [codeSpaces, setCodeSpaces] = useState<CodeSpace[]>([]);
  const [hasMore, setHasMore] = useState(true);

  // Query to fetch code spaces
  const { isLoading, refetch } = useQuery({
    queryKey: ["codeSpaces", page],
    queryFn: () => api.getCodeSpaces(page),
    onSuccess: (newData) => {
      if (newData.length === 0) {
        setHasMore(false);
      } else {
        setCodeSpaces((prev) => [...prev, ...newData]);
      }
    },
    onError: () => {
      toast.error("Failed to load code spaces");
    },
  });

  const loadMore = useCallback(() => {
    setPage((prevPage) => prevPage + 1);
  }, []);

  const handleCreateCodeSpace = () => {
    navigate("/spaces/create");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-primary">
        Welcome to CodeSphere
      </h1>
      
      <div className="mb-4">
        <p className="text-center text-gray-600 max-w-2xl mx-auto">
          Discover and share code snippets with the community. Create your own CodeSpace
          or explore what others are working on.
        </p>
      </div>

      <InfiniteScroll
        loadMore={loadMore}
        hasMore={hasMore}
        loading={isLoading}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {codeSpaces.map((codeSpace) => (
          <CodeSpaceCard key={codeSpace.id} codeSpace={codeSpace} />
        ))}
      </InfiniteScroll>

      {codeSpaces.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center p-8">
          <p className="text-gray-500 mb-4">No CodeSpaces found</p>
          <p className="text-gray-500">Create your first CodeSpace to get started!</p>
        </div>
      )}

      <FloatingActionButton
        icon={<Plus size={24} />}
        onClick={handleCreateCodeSpace}
        label="Create"
      />
    </div>
  );
};

export default Home;
