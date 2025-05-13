import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';

const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'ko' ? 'en' : 'ko';
        i18n.changeLanguage(newLang);
    };

    return (
        <Button
            onClick={toggleLanguage}
            variant="ghost"
            className="fixed bottom-4 right-4"
        >
            {i18n.language === 'ko' ? 'English' : '한국어'}
        </Button>
    );
};

export default LanguageSwitcher; 