
import React from "react";
import { Github, Mail } from "lucide-react";
import Logo from "./Logo";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#1A1F2C] text-white py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Logo size="32" />
            <span className="font-bold text-lg">CodeSpace</span>
          </div>
          
          <div className="flex items-center gap-6">
            <a 
              href="mailto:lsmn0280@gmail.com" 
              className="flex items-center gap-2 hover:text-primary transition-colors"
              aria-label="Email"
            >
              <Mail size={20} />
              <span className="hidden sm:inline">lsmn0280@gmail.com</span>
            </a>
            <a 
              href="https://github.com/Leonamin" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 hover:text-primary transition-colors"
              aria-label="GitHub"
            >
              <Github size={20} />
              <span className="hidden sm:inline">github.com/Leonamin</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
