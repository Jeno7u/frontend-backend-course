import React, { useEffect, useState } from "react";

export default function AdminUsersPanel({
    api,
    onUnauthorized,
    showTitle = true,
}) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [form, setForm] = useState({
        email: "",
        first_name: "",
        last_name: "",
        role: "user",
        blocked: false,
    });

    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await api.getUsers();
            setUsers(data);
        } catch (error) {
            if (error?.response?.status === 401) {
                onUnauthorized();
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const openEdit = (user) => {
        setSelectedUser(user);
        setForm({
            email: user.email || "",
            first_name: user.first_name || "",
            last_name: user.last_name || "",
            role: user.role || "user",
            blocked: Boolean(user.blocked),
        });
    };

    const closeEdit = () => {
        setSelectedUser(null);
    };

    const handleSave = async (event) => {
        event.preventDefault();

        try {
            await api.updateUser(selectedUser.id, form);
            closeEdit();
            await loadUsers();
        } catch (error) {
            if (error?.response?.status === 401) {
                onUnauthorized();
                return;
            }

            alert(
                error?.response?.data?.error ||
                    "Не удалось обновить пользователя",
            );
        }
    };

    const handleBlock = async (id) => {
        const confirmed = window.confirm("Заблокировать пользователя?");
        if (!confirmed) {
            return;
        }

        try {
            await api.deleteUser(id);
            await loadUsers();
        } catch (error) {
            if (error?.response?.status === 401) {
                onUnauthorized();
                return;
            }

            alert(
                error?.response?.data?.error ||
                    "Не удалось заблокировать пользователя",
            );
        }
    };

    return (
        <section className="adminPanel">
            {showTitle ? (
                <div className="toolbar" style={{ marginTop: "24px" }}>
                    <h2 className="title">Пользователи</h2>
                </div>
            ) : null}

            {loading ? (
                <div className="empty">Загрузка пользователей...</div>
            ) : (
                <div className="usersList">
                    {users.map((user) => (
                        <div className="userRow" key={user.id}>
                            <div className="userMain">
                                <div className="userId">#{user.id}</div>
                                <div className="userName">
                                    {user.first_name} {user.last_name}
                                </div>
                                <div className="userMeta">{user.email}</div>
                                <div className="userMeta">
                                    Роль: {user.role}
                                </div>
                                {user.blocked ? (
                                    <div className="userBlocked">
                                        Заблокирован
                                    </div>
                                ) : null}
                            </div>
                            <div className="userActions">
                                <button
                                    className="btn"
                                    onClick={() => openEdit(user)}
                                >
                                    Редактировать
                                </button>
                                <button
                                    className="btn btn--danger"
                                    onClick={() => handleBlock(user.id)}
                                    disabled={user.blocked}
                                >
                                    {user.blocked
                                        ? "Заблокирован"
                                        : "Заблокировать"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedUser ? (
                <div className="backdrop" onMouseDown={closeEdit}>
                    <div
                        className="modal"
                        onMouseDown={(event) => event.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                    >
                        <div className="modal__header">
                            <div className="modal__title">
                                Редактирование пользователя
                            </div>
                            <button
                                className="iconBtn"
                                onClick={closeEdit}
                                aria-label="Закрыть"
                            >
                                ✕
                            </button>
                        </div>
                        <form className="form" onSubmit={handleSave}>
                            <label className="label">
                                Email
                                <input
                                    className="input"
                                    value={form.email}
                                    onChange={(event) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            email: event.target.value,
                                        }))
                                    }
                                />
                            </label>
                            <label className="label">
                                First name
                                <input
                                    className="input"
                                    value={form.first_name}
                                    onChange={(event) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            first_name: event.target.value,
                                        }))
                                    }
                                />
                            </label>
                            <label className="label">
                                Last name
                                <input
                                    className="input"
                                    value={form.last_name}
                                    onChange={(event) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            last_name: event.target.value,
                                        }))
                                    }
                                />
                            </label>
                            <label className="label">
                                Role
                                <select
                                    className="input"
                                    value={form.role}
                                    onChange={(event) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            role: event.target.value,
                                        }))
                                    }
                                >
                                    <option value="user">user</option>
                                    <option value="seller">seller</option>
                                    <option value="admin">admin</option>
                                </select>
                            </label>
                            <label
                                className="label"
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={form.blocked}
                                    onChange={(event) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            blocked: event.target.checked,
                                        }))
                                    }
                                    style={{ marginRight: "8px" }}
                                />
                                Блокирован
                            </label>
                            <div className="modal__footer">
                                <button
                                    type="button"
                                    className="btn"
                                    onClick={closeEdit}
                                >
                                    Отмена
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn--primary"
                                >
                                    Сохранить
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : null}
        </section>
    );
}
