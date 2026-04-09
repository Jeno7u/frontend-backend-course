import { useEffect, useState } from "react";
import { api } from "./api";
import GoodsPage from "./pages/GoodsPage/GoodsPage";
import AuthPage from "./pages/AuthPage/AuthPage";

function App() {
    const [authMode, setAuthMode] = useState("login");
    const [user, setUser] = useState(null);
    const [bootLoading, setBootLoading] = useState(true);

    useEffect(() => {
        const restoreSession = async () => {
            if (!api.hasSession()) {
                setBootLoading(false);
                return;
            }

            try {
                const profile = await api.me();
                setUser(profile);
            } catch (error) {
                api.logout();
                setUser(null);
            } finally {
                setBootLoading(false);
            }
        };

        restoreSession();
    }, []);

    const handleLogin = async (credentials) => {
        await api.login(credentials);
        const profile = await api.me();
        setUser(profile);
    };

    const handleRegister = async (payload) => {
        await api.register(payload);
    };

    const handleLogout = () => {
        api.logout();
        setUser(null);
    };

    if (bootLoading) {
        return <div style={{ padding: "24px" }}>Проверка сессии...</div>;
    }

    return (
        <div className="App">
            {user ? (
                <GoodsPage user={user} onLogout={handleLogout} />
            ) : (
                <AuthPage
                    mode={authMode}
                    onModeChange={setAuthMode}
                    onLogin={handleLogin}
                    onRegister={handleRegister}
                />
            )}
        </div>
    );
}
export default App;
