import React from "react";
export default function ProductItem({
    product,
    onView,
    onEdit,
    onDelete,
    canEdit,
    canDelete,
}) {
    const handleKeyDown = (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onView(product.id);
        }
    };

    return (
        <div
            className="productRow productRow--clickable"
            onClick={() => onView(product.id)}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
        >
            <div className="productMain">
                <div className="productId">#{product.id}</div>
                <div className="productName">{product.title}</div>
                <div className="productCategory">{product.category}</div>
                <div style={{ opacity: 0.75, fontSize: "13px" }}>
                    {product.description}
                </div>
            </div>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: "600", color: "#6366f1" }}>
                        {product.price} ₽
                    </div>
                </div>
                <div className="productActions">
                    {canEdit ? (
                        <button
                            className="btn"
                            onClick={(event) => {
                                event.stopPropagation();
                                onEdit(product);
                            }}
                        >
                            Редактировать
                        </button>
                    ) : null}
                    {canDelete ? (
                        <button
                            className="btn btn--danger"
                            onClick={(event) => {
                                event.stopPropagation();
                                onDelete(product.id);
                            }}
                        >
                            Удалить
                        </button>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
