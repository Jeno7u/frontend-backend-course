import React, { useState } from "react";
import "./AuthPage.css";

export default function AuthPage({ mode, onModeChange, onLogin, onRegister }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const isLogin = mode === "login";

    const resetError = () => setError("");

    const fillDemo = (demoEmail) => {
        setEmail(demoEmail);
        setPassword("password123");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        resetError();

        const normalizedEmail = email.trim().toLowerCase();
        const normalizedPassword = password.trim();

        if (!normalizedEmail || !normalizedPassword) {
            setError("Заполните email и password");
            return;
        }

        if (!isLogin && (!firstName.trim() || !lastName.trim())) {
            setError("Заполните first_name и last_name");
            return;
        }

        try {
            setLoading(true);
            if (isLogin) {
                await onLogin({
                    email: normalizedEmail,
                    password: normalizedPassword,
                });
            } else {
                await onRegister({
                    email: normalizedEmail,
                    first_name: firstName.trim(),
                    last_name: lastName.trim(),
                    password: normalizedPassword,
                });

                await onLogin({
                    email: normalizedEmail,
                    password: normalizedPassword,
                });
            }
        } catch (apiError) {
            setError(apiError?.response?.data?.error || "Ошибка запроса");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="authPage">
            <div className="authCard">
                <h1 className="authTitle">Goods API Client</h1>
                <p className="authSubtitle">
                    {isLogin
                        ? "Войдите, чтобы управлять товарами"
                        : "Создайте аккаунт для доступа к API"}
                </p>

                {isLogin ? (
                    <div className="authHint">
                        Демонстрационные аккаунты: admin@example.com,
                        seller@example.com, user@example.com. Пароль:
                        password123
                    </div>
                ) : null}

                {isLogin ? (
                    <div className="authQuick">
                        <button
                            type="button"
                            className="authQuickBtn"
                            onClick={() => fillDemo("user@example.com")}
                        >
                            User
                        </button>
                        <button
                            type="button"
                            className="authQuickBtn"
                            onClick={() => fillDemo("seller@example.com")}
                        >
                            Seller
                        </button>
                        <button
                            type="button"
                            className="authQuickBtn"
                            onClick={() => fillDemo("admin@example.com")}
                        >
                            Admin
                        </button>
                    </div>
                ) : null}

                <div className="authTabs">
                    <button
                        className={
                            isLogin ? "authTab authTab--active" : "authTab"
                        }
                        type="button"
                        onClick={() => {
                            resetError();
                            onModeChange("login");
                        }}
                    >
                        Вход
                    </button>
                    <button
                        className={
                            !isLogin ? "authTab authTab--active" : "authTab"
                        }
                        type="button"
                        onClick={() => {
                            resetError();
                            onModeChange("register");
                        }}
                    >
                        Регистрация
                    </button>
                </div>

                <form className="authForm" onSubmit={handleSubmit}>
                    <label className="authLabel">
                        Email
                        <input
                            className="authInput"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="user@example.com"
                            autoComplete="email"
                        />
                    </label>

                    {!isLogin ? (
                        <>
                            <label className="authLabel">
                                First name
                                <input
                                    className="authInput"
                                    value={firstName}
                                    onChange={(e) =>
                                        setFirstName(e.target.value)
                                    }
                                    placeholder="Ivan"
                                    autoComplete="given-name"
                                />
                            </label>

                            <label className="authLabel">
                                Last name
                                <input
                                    className="authInput"
                                    value={lastName}
                                    onChange={(e) =>
                                        setLastName(e.target.value)
                                    }
                                    placeholder="Petrov"
                                    autoComplete="family-name"
                                />
                            </label>
                        </>
                    ) : null}

                    <label className="authLabel">
                        Password
                        <input
                            className="authInput"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="password"
                            autoComplete={
                                isLogin ? "current-password" : "new-password"
                            }
                        />
                    </label>

                    {error ? <div className="authError">{error}</div> : null}

                    <button
                        className="authSubmit"
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Отправка..."
                            : isLogin
                              ? "Войти"
                              : "Зарегистрироваться"}
                    </button>
                </form>
            </div>
        </div>
    );
}
