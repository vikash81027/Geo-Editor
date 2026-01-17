import React, { useEffect } from 'react';
import type {ToastState} from '../../types';

interface ToastProps {
    toast: ToastState;
    onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
    useEffect(() => {
        if (toast.visible) {
            const timer = setTimeout(onClose, 3000);
            return () => clearTimeout(timer);
        }
    }, [toast.visible, onClose]);

    if (!toast.visible) return null;

    const bgColors = {
        error: '#d32f2f',
        success: '#2e7d32',
        info: '#0288d1'
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '12px 24px',
            borderRadius: '4px',
            color: '#fff',
            zIndex: 9999,
            backgroundColor: bgColors[toast.type],
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
            fontWeight: 'bold',
            animation: 'fadeIn 0.3s ease-in-out'
        }}>
            {toast.message}
        </div>
    );
};

export default Toast;