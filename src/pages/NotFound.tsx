import React from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

const NotFound: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFDF9]">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">{t('notFound.title')}</h1>
        <p className="text-xl text-gray-600 mb-4">
          {t('notFound.description')}
        </p>
        <p className="text-gray-500 mb-6">
          {t('notFound.path')} <code className="bg-secondary p-1 rounded">{location.pathname}</code> {t('notFound.notFound')}
        </p>
        <Button onClick={() => window.location.href = "/"} className="bg-accent hover:bg-accent/90">
          {t('notFound.returnHome')}
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
