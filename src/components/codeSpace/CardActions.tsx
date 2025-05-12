
import React, { useState } from "react";
import { MoreVertical, Trash2, Edit } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

interface CardActionsProps {
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}

export const CardActions: React.FC<CardActionsProps> = ({
  onEdit,
  onDelete
}) => {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [showMobileDrawer, setShowMobileDrawer] = useState(false);

  const handleOpenMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMobile) {
      setShowMobileDrawer(true);
    }
  };

  return (
    <>
      <div className="absolute top-2 right-2 flex items-center gap-1">
        {isMobile ? (
          <button
            onClick={handleOpenMenu}
            className="p-1 rounded-full hover:bg-gray-100"
            aria-label="More options"
          >
            <MoreVertical size={18} className="text-gray-600" />
          </button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <button
                className="p-1 rounded-full hover:bg-gray-100"
                aria-label="More options"
              >
                <MoreVertical size={18} className="text-gray-600" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem
                className="cursor-pointer flex items-center gap-2"
                onClick={onEdit}
              >
                <Edit size={16} />
                <span>수정</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-500 cursor-pointer flex items-center gap-2"
                onClick={onDelete}
              >
                <Trash2 size={16} />
                <span>삭제</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Mobile drawer */}
      <Drawer open={showMobileDrawer} onOpenChange={setShowMobileDrawer}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>옵션</DrawerTitle>
            <DrawerDescription>코드 스페이스 관리 옵션을 선택하세요</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 space-y-2">
            <Button
              className="w-full flex items-center justify-center gap-2"
              onClick={(e) => {
                setShowMobileDrawer(false);
                onEdit(e);
              }}
            >
              <Edit size={16} />
              <span>수정</span>
            </Button>
            <Button
              variant="destructive"
              className="w-full flex items-center justify-center gap-2"
              onClick={(e) => {
                setShowMobileDrawer(false);
                onDelete(e);
              }}
            >
              <Trash2 size={16} />
              <span>삭제</span>
            </Button>
          </div>
          <DrawerFooter>
            <Button variant="outline" onClick={() => setShowMobileDrawer(false)}>
              취소
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};
