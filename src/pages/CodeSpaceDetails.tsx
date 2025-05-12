import React, {useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import {Plus, Code} from "lucide-react";
import {api, CodePieceSummary, CodeSpace} from "@/services/api";
import CodePieceCard from "@/components/CodePieceCard";
import FloatingActionButton from "@/components/FloatingActionButton";
import InfiniteScroll from "@/components/InfiniteScroll";
import {toast} from "sonner";

const CodeSpaceDetails: React.FC = () => {
    const navigate = useNavigate();
    const {spaceId} = useParams<{ spaceId: string }>();
    const [selectedPieces, setSelectedPieces] = useState<number[]>([]);

    // Fetch CodeSpace details
    const {data: codeSpaceDetails} = useQuery({
        queryKey: ["codeSpace", spaceId],
        queryFn: async () => api.getCodeSpaceDetail(spaceId as number),
    });

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        refetch,
    } = useInfiniteQuery({
        queryKey: ["codePieces", spaceId],
        queryFn: ({pageParam = 0}) =>
            api.getCodePieces(Number(spaceId), pageParam as number),
        getNextPageParam: (lastPage, allPages) =>
            lastPage.length === 0 ? undefined : allPages.length,
        initialPageParam: 0,
        enabled: !!spaceId,
        meta: {
            onSettled: (_, error) => {
                if (error) {
                    toast.error("코드 피스 목록을 불러오는데 실패했습니다");
                }
            },
        },
    });

    const codePieces: CodePieceSummary[] = data?.pages.flat() ?? [];

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

    const handleCodePieceDeleted = () => {
        refetch();
        setSelectedPieces([]);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                {codeSpaceDetails?.name && <h1 className="text-3xl font-bold text-primary mb-2">
                    {codeSpaceDetails?.name}
                </h1>}
                {
                    codeSpaceDetails?.description &&
                    <p className="text-gray-600">
                        {codeSpaceDetails?.description}
                    </p>
                }
                {codeSpaceDetails?.owner_name && (
                    <p className="text-sm text-gray-500 mt-2">Created by {codeSpaceDetails.owner_name}</p>
                )}
            </div>

            <InfiniteScroll
                loadMore={fetchNextPage}
                hasMore={hasNextPage ?? false}
                loading={isFetchingNextPage}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
                {codePieces.map((codePiece) => (
                    <CodePieceCard
                        key={codePiece.id}
                        codePiece={codePiece}
                        isSelected={selectedPieces.includes(codePiece.id)}
                        onSelect={handleSelect}
                        onViewDetails={handleViewDetails}
                        onDeleted={handleCodePieceDeleted}
                    />
                ))}
            </InfiniteScroll>

            {
                codePieces.length === 0 && !isLoading && (
                    <div className="flex flex-col items-center justify-center p-8">
                        <p className="text-gray-500 mb-4">코드 피스가 없습니다.</p>
                        <p className="text-gray-500">첫번째 코드 피스를 만들어보세요!</p>
                    </div>
                )
            }

            {
                selectedPieces.length > 0 ? (
                    <FloatingActionButton
                        icon={<Code size={24}/>}
                        onClick={handleCompare}
                        label={`비교하기 (${selectedPieces.length})`}
                        position="bottom-center"
                        variant="accent"
                    />
                ) : (
                    <FloatingActionButton
                        icon={<Plus size={24}/>}
                        onClick={handleCreateCodePiece}
                        label="생성"
                    />
                )
            }
        </div>
    );
};

export default CodeSpaceDetails;
