const jwt = require("jsonwebtoken");
const { users } = require("../data/store");

const ACCESS_TOKEN_SECRET =
    process.env.ACCESS_TOKEN_SECRET || "dev-access-secret-change-me";

function authenticateAccessToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Требуется access token" });
    }

    const token = authHeader.slice("Bearer ".length);

    try {
        const payload = jwt.verify(token, ACCESS_TOKEN_SECRET);
        const user = users.find(
            (currentUser) => currentUser.id === payload.sub,
        );

        if (!user || user.blocked) {
            return res.status(401).json({ error: "Пользователь недоступен" });
        }

        req.user = {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role,
        };
        return next();
    } catch (error) {
        return res.status(401).json({ error: "Недействительный access token" });
    }
}

function requireRoles(allowedRoles) {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: "Доступ запрещен" });
        }

        return next();
    };
}

module.exports = {
    authenticateAccessToken,
    requireRoles,
    ACCESS_TOKEN_SECRET,
};
