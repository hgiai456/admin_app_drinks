// src/ModelComponent.jsx (sửa tên file cho đúng)
import React from 'react';
import '@styles/pages/_modal.scss';

const Modal = ({
    show,
    onClose,
    title,
    size = 'default',
    children,
    closeOnOverlay = true,
}) => {
    if (!show) return null;

    const handleOverlayClick = (e) => {
        if (closeOnOverlay && e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };

    React.useEffect(() => {
        if (show) {
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [show]);

    return (
        <div className='modal'>
            <div className='modal-overlay' onClick={handleOverlayClick}>
                <div
                    className={`modal-content modal-content--${size}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className='modal-header'>
                        <h3 className='modal-title'>{title}</h3>
                        <button
                            className='modal-close-btn'
                            onClick={onClose}
                            type='button'
                        >
                            ×
                        </button>
                    </div>

                    <div className='modal-body'>{children}</div>

                    {footer && <div className='modal-footer'>{footer}</div>}
                </div>
            </div>
        </div>
    );
};

export default Modal;
