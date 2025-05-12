
import React from "react";

interface LogoProps {
  size?: string;
}

const Logo: React.FC<LogoProps> = ({ size = "24" }) => {
  return <img src="/logo.png" alt="logo" width={size} />;
};

export default Logo;
