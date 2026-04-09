import React, { useEffect, useState } from "react";
export default function ProductModal({
    open,
    mode,
    initialProduct,
    onClose,
    onSubmit,
}) {
    const [productTitle, setProductTitle] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");

    useEffect(() => {
        if (!open) return;
        setProductTitle(initialProduct?.title ?? "");
        setCategory(initialProduct?.category ?? "");
        setDescription(initialProduct?.description ?? "");
        setPrice(
            initialProduct?.price != null ? String(initialProduct.price) : "",
        );
    }, [open, initialProduct]);

    if (!open) return null;

    const modalTitle =
        mode === "edit" ? "Редактирование товара" : "Создание товара";

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmedTitle = productTitle.trim();
        const trimmedCategory = category.trim();
        const trimmedDesc = description.trim();
        const parsedPrice = Number(price);
        if (!trimmedTitle) {
            alert("Введите название товара");
            return;
        }
        if (!trimmedCategory) {
            alert("Введите категорию");
            return;
        }
        if (!trimmedDesc) {
            alert("Введите описание");
            return;
        }
        if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
            alert("Введите корректную цену");
            return;
        }

        onSubmit({
            id: initialProduct?.id,
            title: trimmedTitle,
            category: trimmedCategory,
            description: trimmedDesc,
            price: parsedPrice,
        });
    };

    return (
        <div className="backdrop" onMouseDown={onClose}>
            <div
                className="modal"
                onMouseDown={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
            >
                <div className="modal__header">
                    <div className="modal__title">{modalTitle}</div>
                    <button
                        className="iconBtn"
                        onClick={onClose}
                        aria-label="Закрыть"
                    >
                        ✕
                    </button>
                </div>
                <form className="form" onSubmit={handleSubmit}>
                    <label className="label">
                        Название товара
                        <input
                            className="input"
                            value={productTitle}
                            onChange={(e) => setProductTitle(e.target.value)}
                            placeholder="Например, Кресло офисное"
                            autoFocus
                        />
                    </label>
                    <label className="label">
                        Категория
                        <input
                            className="input"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            placeholder="Например, Мебель"
                        />
                    </label>
                    <label className="label">
                        Описание
                        <textarea
                            className="input"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Опишите товар"
                            rows="3"
                            style={{ resize: "vertical" }}
                        />
                    </label>
                    <label className="label">
                        Цена (₽)
                        <input
                            className="input"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Например, 4500"
                            inputMode="numeric"
                        />
                    </label>
                    <div className="modal__footer">
                        <button type="button" className="btn" onClick={onClose}>
                            Отмена
                        </button>
                        <button type="submit" className="btn btn--primary">
                            {mode === "edit" ? "Сохранить" : "Создать"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
