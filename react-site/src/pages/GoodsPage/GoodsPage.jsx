import React, { useEffect, useState } from "react";
import "./GoodsPage.scss";
import GoodsList from "../../components/GoodsList";
import ProductModal from "../../components/ProductModal";
import ProductDetailsModal from "../../components/ProductDetailsModal";
import { api } from "../../api";
import AdminUsersPanel from "../AdminUsersPanel";

export default function GoodsPage({ user, onLogout }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("create");
    const [editingProduct, setEditingProduct] = useState(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [detailsProduct, setDetailsProduct] = useState(null);
    const canManageProducts = user.role === "seller" || user.role === "admin";
    const canDeleteProducts = user.role === "admin";
    const canManageUsers = user.role === "admin";
    const [activeSection, setActiveSection] = useState("products");

    useEffect(() => {
        loadProducts();
    }, []);

    useEffect(() => {
        if (!canManageUsers && activeSection === "users") {
            setActiveSection("products");
        }
    }, [canManageUsers, activeSection]);

    const handleApiError = (error, fallbackMessage) => {
        if (error?.response?.status === 401) {
            onLogout();
            return;
        }

        alert(error?.response?.data?.error || fallbackMessage);
    };

    const loadProducts = async () => {
        try {
            setLoading(true);
            const data = await api.getProducts();
            setProducts(data);
        } catch (err) {
            handleApiError(err, "Ошибка загрузки товаров");
        } finally {
            setLoading(false);
        }
    };

    const openCreate = () => {
        setModalMode("create");
        setEditingProduct(null);
        setModalOpen(true);
    };
    const openEdit = (product) => {
        setModalMode("edit");
        setEditingProduct(product);
        setModalOpen(true);
    };
    const closeModal = () => {
        setModalOpen(false);
        setEditingProduct(null);
    };

    const handleDelete = async (id) => {
        const ok = window.confirm("Удалить товар?");
        if (!ok) return;

        try {
            await api.deleteProduct(id);
            setProducts((prev) => prev.filter((p) => p.id !== id));

            if (detailsProduct?.id === id) {
                setDetailsProduct(null);
                setDetailsOpen(false);
            }
        } catch (err) {
            handleApiError(err, "Ошибка удаления товара");
        }
    };

    const handleSubmitModal = async (payload) => {
        try {
            if (modalMode === "create") {
                const newProduct = await api.createProduct(payload);
                setProducts((prev) => [...prev, newProduct]);
            } else {
                await api.updateProduct(payload.id, payload);
                await loadProducts();

                if (detailsProduct?.id === payload.id) {
                    const refreshed = await api.getProductById(payload.id);
                    setDetailsProduct(refreshed);
                }
            }

            closeModal();
        } catch (err) {
            handleApiError(err, "Ошибка сохранения товара");
        }
    };

    const handleOpenProductDetails = async (id) => {
        const normalizedId = String(id || "").trim();
        if (!normalizedId) {
            alert("Введите id товара");
            return;
        }

        try {
            setDetailsOpen(true);
            setDetailsLoading(true);
            setDetailsProduct(null);
            const product = await api.getProductById(normalizedId);
            setDetailsProduct(product);
        } catch (error) {
            setDetailsOpen(false);
            setDetailsProduct(null);
            handleApiError(error, "Не удалось получить товар");
        } finally {
            setDetailsLoading(false);
        }
    };

    const handleCloseProductDetails = () => {
        setDetailsOpen(false);
    };

    return (
        <div className="page">
            <header className="header">
                <div className="header__inner">
                    <div className="brand">Интернет-магазин</div>
                    <div className="header__right">
                        <span style={{ marginRight: "10px" }}>
                            {user.email}
                        </span>
                        <button className="btn" onClick={onLogout}>
                            Выйти
                        </button>
                    </div>
                </div>
            </header>
            <main className="main">
                <div className="container">
                    <div className="sectionNav">
                        <button
                            className={
                                activeSection === "products"
                                    ? "sectionBtn sectionBtn--active"
                                    : "sectionBtn"
                            }
                            onClick={() => setActiveSection("products")}
                        >
                            Товары
                        </button>
                        {canManageUsers ? (
                            <button
                                className={
                                    activeSection === "users"
                                        ? "sectionBtn sectionBtn--active"
                                        : "sectionBtn"
                                }
                                onClick={() => setActiveSection("users")}
                            >
                                Пользователи
                            </button>
                        ) : null}
                    </div>

                    {activeSection === "products" ? (
                        <>
                            <div className="toolbar">
                                <h1 className="title">Товары</h1>
                                {canManageProducts ? (
                                    <button
                                        className="btn btn--primary"
                                        onClick={openCreate}
                                    >
                                        + Добавить товар
                                    </button>
                                ) : null}
                            </div>

                            {loading ? (
                                <div className="empty">Загрузка...</div>
                            ) : (
                                <GoodsList
                                    products={products}
                                    onView={handleOpenProductDetails}
                                    onEdit={openEdit}
                                    onDelete={handleDelete}
                                    canEdit={canManageProducts}
                                    canDelete={canDeleteProducts}
                                />
                            )}
                        </>
                    ) : (
                        <>
                            <div className="toolbar">
                                <h1 className="title">Пользователи</h1>
                            </div>
                            <AdminUsersPanel
                                api={api}
                                onUnauthorized={onLogout}
                                showTitle={false}
                            />
                        </>
                    )}
                </div>
            </main>
            <footer className="footer">
                <div className="footer__inner">
                    © {new Date().getFullYear()} Интернет-магазин
                </div>
            </footer>
            <ProductModal
                open={modalOpen}
                mode={modalMode}
                initialProduct={editingProduct}
                onClose={closeModal}
                onSubmit={handleSubmitModal}
            />
            <ProductDetailsModal
                open={detailsOpen}
                loading={detailsLoading}
                product={detailsProduct}
                onClose={handleCloseProductDetails}
            />
        </div>
    );
}
