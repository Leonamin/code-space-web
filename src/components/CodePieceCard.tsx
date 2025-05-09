
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CodePieceSummary } from "@/services/api";
import { Eye, MoreVertical, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/services/api";
import { toast } from "sonner";

interface CodePieceCardProps {
  codePiece: CodePieceSummary;
  isSelected?: boolean;
  onSelect?: (id: number) => void;
  onViewDetails?: (id: number) => void;
  onDeleted?: () => void;
}

const CodePieceCard: React.FC<CodePieceCardProps> = ({
  codePiece,
  isSelected = false,
  onSelect,
  onViewDetails,
  onDeleted,
}) => {
  const { id, name, description, language, owner_name } = codePiece;
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showMobileDrawer, setShowMobileDrawer] = useState(false);
  const [password, setPassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClick = () => {
    if (onSelect) {
      onSelect(id);
    }
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onViewDetails) {
      onViewDetails(id);
    }
  };

  const handleOpenMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMobile) {
      setShowMobileDrawer(true);
    }
  };

  const handleDelete = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setShowMobileDrawer(false);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!password.trim()) {
      toast.error("비밀번호를 입력해주세요");
      return;
    }

    setIsDeleting(true);
    try {
      await api.deleteCodePiece(id, password);
      toast.success("코드 피스가 삭제되었습니다");
      setShowDeleteDialog(false);
      setPassword("");
      if (onDeleted) onDeleted();
    } catch (error) {
      toast.error("삭제에 실패했습니다. 비밀번호를 확인해주세요.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Language badge color based on language
  const getLanguageColor = (lang: string) => {
    const colors: Record<string, string> = {
      java: "bg-red-100 text-red-800",
      python: "bg-blue-100 text-blue-800",
      javascript: "bg-yellow-100 text-yellow-800",
      typescript: "bg-blue-100 text-blue-800",
      c: "bg-gray-100 text-gray-800",
      "c++": "bg-purple-100 text-purple-800",
      "c#": "bg-green-100 text-green-800",
      php: "bg-indigo-100 text-indigo-800",
      dart: "bg-cyan-100 text-cyan-800",
      swift: "bg-orange-100 text-orange-800",
      kotlin: "bg-purple-100 text-purple-800",
      ruby: "bg-red-100 text-red-800",
      go: "bg-blue-100 text-blue-800",
    };
    return colors[lang.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  return (
    <>
      <Card
        className={cn(
          "h-full cursor-pointer transition-all hover:shadow-lg animate-scale-in",
          isSelected ? "bg-secondary border-primary border-2" : "bg-white"
        )}
        onClick={handleClick}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
          <CardTitle className="text-lg font-bold text-primary">{name}</CardTitle>
          <div className="absolute top-2 right-2 flex items-center gap-1">
            <button
              onClick={handleViewDetails}
              className="p-1 rounded-full hover:bg-gray-100"
              aria-label="View details"
            >
              <Eye size={18} className="text-gray-600" />
            </button>
            
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
                    className="text-red-500 cursor-pointer flex items-center gap-2" 
                    onClick={handleDelete}
                  >
                    <Trash2 size={16} />
                    <span>삭제</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <p className="line-clamp-2 text-sm text-gray-600 mb-2">
            {description || "No description provided"}
          </p>
          <div className="flex items-center mt-1">
            <span className={`text-xs px-2 py-1 rounded-full ${getLanguageColor(language)}`}>
              {language}
            </span>
          </div>
        </CardContent>
        <CardFooter className="pt-0 text-xs text-gray-500">
          <span>By {owner_name}</span>
        </CardFooter>
      </Card>

      {/* Mobile drawer */}
      <Drawer open={showMobileDrawer} onOpenChange={setShowMobileDrawer}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>옵션</DrawerTitle>
            <DrawerDescription>코드 피스 관리 옵션을 선택하세요</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 space-y-2">
            <Button 
              variant="destructive" 
              className="w-full flex items-center justify-center gap-2"
              onClick={handleDelete}
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

      {/* Password confirmation dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>코드 피스 삭제 확인</DialogTitle>
            <DialogDescription>
              '{name}' 코드 피스를 삭제하려면 비밀번호를 입력해주세요.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={isDeleting}>
              취소
            </Button>
            <Button onClick={handleDeleteConfirm} variant="destructive" disabled={isDeleting}>
              {isDeleting ? "삭제 중..." : "삭제"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CodePieceCard;
