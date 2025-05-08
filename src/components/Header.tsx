
import React from "react";
import { Code } from "lucide-react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header className="bg-primary p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Code size={28} className="text-white" />
          <span className="text-xl font-bold text-white">CodeSpace</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
