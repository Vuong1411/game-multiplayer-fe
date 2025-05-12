import React from 'react';
import { Box, Typography, Card } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { Answer } from '../../../types/question';

type AnswerSymbol = '▲' | '◆' | '●' | '■';

interface AnswerCardProps {
  answer: Answer;
  index: number;
  onSelect?: (answer: Answer) => void;
  selected?: boolean;
  showCorrectness?: boolean;
}

/**
 * AnswerCard - Component hiển thị đáp án dạng card
 */
const AnswerCard: React.FC<AnswerCardProps> = ({
  answer,
  index,
  onSelect,
  selected = false,
  showCorrectness = true,
}) => {
  
  // Xác định màu sắc và ký hiệu dựa vào index
  const getSymbolAndColor = (): {symbol: AnswerSymbol, color: string} => {
    switch (index % 4) {
      case 0:
        return { symbol: '▲', color: '#e91e63' }; // Red - Triangle - Đỏ
      case 1:
        return { symbol: '◆', color: '#1976d2' }; // Blue - Diamond - Xanh
      case 2:
        return { symbol: '●', color: '#e6a100' }; // Gold - Circle - Vàng
      case 3:
        return { symbol: '■', color: '#388e3c' }; // Green - Square - Xanh lá
      default:
        return { symbol: '●', color: '#1976d2' }; // Default
    }
  };

  const { symbol, color } = getSymbolAndColor();

  const handleClick = () => {
    if (onSelect) {
      onSelect(answer);
    }
  };

  return (
    <Card
      onClick={handleClick}
      elevation={selected ? 3 : 1}
      sx={{ 
        backgroundColor: color,
        color: 'white',
        borderRadius: 2,
        position: 'relative',
        height: 60,
        display: 'flex',
        alignItems: 'center',
        px: 2,
        cursor: onSelect ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        '&:hover': {
          opacity: onSelect ? 0.9 : 1,
          transform: onSelect ? 'scale(1.02)' : 'none',
        },
        border: selected ? '2px solid white' : 'none',
        mb: 1
      }}
    >
      {/* Symbol Circle */}
      <Box 
        sx={{ 
          width: 32,
          height: 32,
          borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.2)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mr: 2
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
          {symbol}
        </Typography>
      </Box>
      
      {/* Answer text */}
      <Typography 
        variant="body1" 
        sx={{ 
          flexGrow: 1,
          fontWeight: selected ? 'bold' : 'normal',
          textShadow: selected ? '0 0 2px rgba(0,0,0,0.3)' : 'none'
        }}
      >
        {answer.content}
      </Typography>
      
      {/* Correct/Selected indicator */}
      {(showCorrectness && answer.is_correct) && (
        <Box 
          sx={{ 
            width: 32,
            height: 32,
            borderRadius: '50%',
            backgroundColor: '#4caf50',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            right: 16
          }}
        >
          <CheckCircleIcon sx={{ color: 'white', fontSize: 20 }} />
        </Box>
      )}
      
      {/* Selected indicator when not showing correctness */}
      {(!showCorrectness && selected) && (
        <Box 
          sx={{ 
            width: 32,
            height: 32,
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.3)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            right: 16
          }}
        >
          <RadioButtonUncheckedIcon sx={{ color: 'white', fontSize: 20 }} />
        </Box>
      )}
    </Card>
  );
};

export default AnswerCard;