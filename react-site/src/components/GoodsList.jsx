import React from "react";
import ProductItem from "./ProductItem";
export default function GoodsList({
    products,
    onView,
    onEdit,
    onDelete,
    canEdit,
    canDelete,
}) {
    if (!products.length) {
        return <div className="empty">Товаров пока нет</div>;
    }
    return (
        <div className="list">
            {products.map((p) => (
                <ProductItem
                    key={p.id}
                    product={p}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    canEdit={canEdit}
                    canDelete={canDelete}
                />
            ))}
        </div>
    );
}
