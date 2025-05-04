// src/components/feature/ConfirmModal.jsx
import React from 'react';
import { X, AlertTriangle, AlertCircle, Info } from 'lucide-react';

const ConfirmModal = ({
                          title,
                          message,
                          confirmText,
                          cancelText,
                          onConfirm,
                          onCancel,
                          variant = 'primary' // 'primary', 'danger', 'warning', 'info'
                      }) => {
    // Chọn icon phù hợp với loại modal
    const getIcon = () => {
        switch (variant) {
            case 'danger':
                return <AlertCircle className="modal-icon danger" />;
            case 'warning':
                return <AlertTriangle className="modal-icon warning" />;
            case 'info':
                return <Info className="modal-icon info" />;
            default:
                return <Info className="modal-icon primary" />;
        }
    };

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">{title}</h2>
                    <button className="modal-close" onClick={onCancel}>
                        <X size={20} />
                    </button>
                </div>
                <div className="modal-body">
                    <div className="modal-icon-container">
                        {getIcon()}
                    </div>
                    <p className="modal-message">{message}</p>
                </div>
                <div className="modal-footer">
                    <button className="button outline" onClick={onCancel}>
                        {cancelText || 'Hủy'}
                    </button>
                    <button
                        className={`button ${variant}`}
                        onClick={onConfirm}
                    >
                        {confirmText || 'Xác nhận'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;