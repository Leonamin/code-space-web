import React from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import LanguageSwitcher from "./LanguageSwitcher";

const Header: React.FC = () => {
    return (
        <header className="bg-primary p-4 shadow-md">
            <div className="container mx-auto flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <Logo size="32" />
                    <span className="font-bold text-lg text-white">CodeSpace</span>
                </Link>
                <LanguageSwitcher />
            </div>
        </header>
    );
};

export default Header;
