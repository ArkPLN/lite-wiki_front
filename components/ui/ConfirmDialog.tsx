import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'info' | 'success' | 'error';
  requireInput?: boolean;
  inputLabel?: string;
  inputPlaceholder?: string;
  inputValue?: string;
  onInputChange?: (value: string) => void;
  maxLength?: number;
}

const typeStyles = {
  warning: {
    icon: <AlertTriangle className="text-yellow-500" size={24} />,
    confirmButtonColor: 'warning' as const,
  },
  info: {
    icon: <Info className="text-blue-500" size={24} />,
    confirmButtonColor: 'primary' as const,
  },
  success: {
    icon: <CheckCircle className="text-green-500" size={24} />,
    confirmButtonColor: 'success' as const,
  },
  error: {
    icon: <XCircle className="text-red-500" size={24} />,
    confirmButtonColor: 'error' as const,
  },
};

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = '确认',
  cancelText = '取消',
  type = 'info',
  requireInput = false,
  inputLabel = '输入',
  inputPlaceholder = '',
  inputValue = '',
  onInputChange,
  maxLength,
}) => {
  const [input, setInput] = useState(inputValue);

  React.useEffect(() => {
    setInput(inputValue);
  }, [inputValue]);

  const handleConfirm = () => {
    if (requireInput && input.trim() === '') {
      return;
    }
    onConfirm();
    onClose();
  };

  const handleClose = () => {
    setInput(inputValue);
    onClose();
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (maxLength && value.length > maxLength) {
      return;
    }
    setInput(value);
    onInputChange?.(value);
  };

  const styleConfig = typeStyles[type];

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        },
      }}
    >
      <DialogTitle className="flex items-center gap-3 pb-2">
        {styleConfig.icon}
        <span className="text-lg font-semibold text-gray-800">{title}</span>
      </DialogTitle>
      
      <DialogContent className="pb-4">
        <DialogContentText className="text-gray-600 text-base leading-relaxed mb-4">
          {message}
        </DialogContentText>
        
        {requireInput && (
          <TextField
            autoFocus
            fullWidth
            label={inputLabel}
            placeholder={inputPlaceholder}
            value={input}
            onChange={handleInputChange}
            variant="outlined"
            size="medium"
            multiline={inputLabel.includes('备注') || inputLabel.includes('说明')}
            rows={inputLabel.includes('备注') || inputLabel.includes('说明') ? 3 : 1}
            inputProps={{
              maxLength: maxLength,
            }}
            helperText={
              maxLength ? `${input.length}/${maxLength}` : undefined
            }
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1.5,
              },
            }}
          />
        )}
      </DialogContent>
      
      <DialogActions className="px-6 pb-4">
        <Button
          onClick={handleClose}
          variant="outlined"
          size="medium"
          sx={{
            borderRadius: 1.5,
            textTransform: 'none',
            fontWeight: 500,
            px: 3,
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color={styleConfig.confirmButtonColor}
          size="medium"
          disabled={requireInput && input.trim() === ''}
          sx={{
            borderRadius: 1.5,
            textTransform: 'none',
            fontWeight: 500,
            px: 3,
            ml: 1,
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};