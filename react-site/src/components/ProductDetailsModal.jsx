import React from "react";

export default function ProductDetailsModal({
    open,
    loading,
    product,
    onClose,
}) {
    if (!open) {
        return null;
    }

    return (
        <div className="backdrop" onMouseDown={onClose}>
            <div
                className="modal"
                onMouseDown={(event) => event.stopPropagation()}
                role="dialog"
                aria-modal="true"
            >
                <div className="modal__header">
                    <div className="modal__title">Детали товара</div>
                    <button
                        className="iconBtn"
                        onClick={onClose}
                        aria-label="Закрыть"
                    >
                        ✕
                    </button>
                </div>

                <div className="form">
                    {loading ? (
                        <div className="empty">Загрузка...</div>
                    ) : product ? (
                        <div className="detailsGrid">
                            <div className="detailsLabel">ID</div>
                            <div>#{product.id}</div>

                            <div className="detailsLabel">Название</div>
                            <div>{product.title}</div>

                            <div className="detailsLabel">Категория</div>
                            <div>{product.category}</div>

                            <div className="detailsLabel">Описание</div>
                            <div>{product.description}</div>

                            <div className="detailsLabel">Цена</div>
                            <div>{product.price} ₽</div>
                        </div>
                    ) : (
                        <div className="empty">Товар не найден</div>
                    )}

                    <div className="modal__footer">
                        <button type="button" className="btn" onClick={onClose}>
                            Закрыть
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
