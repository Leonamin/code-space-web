
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeSpace } from "@/services/api";
import { useNavigate } from "react-router-dom";

interface CodeSpaceCardProps {
  codeSpace: CodeSpace;
}

const CodeSpaceCard: React.FC<CodeSpaceCardProps> = ({ codeSpace }) => {
  const navigate = useNavigate();
  const { id, name, description, owner_name } = codeSpace;

  const handleClick = () => {
    navigate(`/spaces/${id}`);
  };

  // Format date into readable string
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  return (
    <Card
      className="h-full cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] bg-white animate-scale-in"
      onClick={handleClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold text-primary">{name}</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="line-clamp-3 text-sm text-gray-600">
          {description || "No description provided"}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between pt-0 text-xs text-gray-500">
        <span>By {owner_name}</span>
        <span>{formatDate(codeSpace.created_at)}</span>
      </CardFooter>
    </Card>
  );
};

export default CodeSpaceCard;
