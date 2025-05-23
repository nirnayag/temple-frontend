import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ButtonGroup } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <ButtonGroup
      variant="text"
      size="small"
      sx={{
        '& .MuiButton-root': {
          color: 'white',
          minWidth: '80px',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        },
        '& .MuiButton-root.Mui-selected': {
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
        },
      }}
    >
      <Button
        onClick={() => changeLanguage('en')}
        sx={{
          backgroundColor: i18n.language === 'en' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
        }}
        startIcon={<LanguageIcon />}
      >
        English
      </Button>
      <Button
        onClick={() => changeLanguage('mr')}
        sx={{
          backgroundColor: i18n.language === 'mr' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
        }}
      >
        मराठी
      </Button>
    </ButtonGroup>
  );
};

export default LanguageSwitcher; 