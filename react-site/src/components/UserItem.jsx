import React from "react";
export default function UserItem({ user: product, onEdit, onDelete }) {
    return (
        <div className="userRow">
            <div className="userMain">
                <div className="userId">#{product.id}</div>
                <div className="userName">{product.name}</div>
                <div className="userAge">{product.category}</div>
                <div style={{ opacity: 0.75, fontSize: "13px" }}>
                    {product.description}
                </div>
            </div>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: "600", color: "#6366f1" }}>
                        {product.price} ₽
                    </div>
                    <div style={{ fontSize: "12px", opacity: 0.7 }}>
                        Склад: {product.stock}
                    </div>
                </div>
                <div className="userActions">
                    <button className="btn" onClick={() => onEdit(product)}>
                        Редактировать
                    </button>
                    <button
                        className="btn btn--danger"
                        onClick={() => onDelete(product.id)}
                    >
                        Удалить
                    </button>
                </div>
            </div>
        </div>
    );
}
