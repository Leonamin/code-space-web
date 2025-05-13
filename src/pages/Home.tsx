import React from "react";
import { useNavigate } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { api, CodeSpace } from "@/services/api";
import CodeSpaceCard from "@/components/CodeSpaceCard";
import FloatingActionButton from "@/components/FloatingActionButton";
import InfiniteScroll from "@/components/InfiniteScroll";
import { toast } from "sonner";
import Logo from '@/components/Logo'

const Home: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        refetch,
    } = useInfiniteQuery({
        queryKey: ["codeSpaces"],
        queryFn: ({ pageParam = 0 }) => api.getCodeSpaces(pageParam as number),
        getNextPageParam: (lastPage, allPages) =>
            lastPage.length === 0 ? undefined : allPages.length,
        initialPageParam: 0,
        meta: {
            onSettled: (_, error) => {
                if (error) {
                    toast.error(t('common.errors.loadFailed'));
                }
            },
        },
    });

    const codeSpaces: CodeSpace[] = data?.pages.flat() ?? [];

    const handleCreateCodeSpace = () => {
        navigate("/spaces/create");
    };

    const handleCodeSpaceDeleted = () => {
        refetch();
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <InfiniteScroll
                loadMore={fetchNextPage}
                hasMore={hasNextPage ?? false}
                loading={isFetchingNextPage}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
                {codeSpaces.map((codeSpace) => (
                    <CodeSpaceCard
                        key={codeSpace.id}
                        codeSpace={codeSpace}
                        onDeleted={handleCodeSpaceDeleted}
                    />
                ))}
            </InfiniteScroll>

            {codeSpaces.length === 0 && !isLoading && (
                <div className="flex flex-col items-center justify-center">
                    <div className="flex justify-center mb-8">
                        <Logo size="128" />
                    </div>
                    <div className="flex flex-col items-center justify-center p-8">
                        <p className="text-gray-500 mb-4">{t('codeSpace.empty.title')}</p>
                        <p className="text-gray-500">{t('codeSpace.empty.subtitle')}</p>
                    </div>
                </div>
            )}

            <FloatingActionButton
                icon={<Plus size={24} />}
                onClick={handleCreateCodeSpace}
                label={t('common.create')}
            />
        </div>
    );
};

export default Home;
