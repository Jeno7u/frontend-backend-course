const express = require("express");
const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");
const jwt = require("jsonwebtoken");
const {
    authenticateAccessToken,
    ACCESS_TOKEN_SECRET,
} = require("../middleware/auth");
const { users, refreshTokens } = require("../data/store");

const router = express.Router();
const SALT_ROUNDS = 10;
const REFRESH_TOKEN_SECRET =
    process.env.REFRESH_TOKEN_SECRET || "dev-refresh-secret-change-me";
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || "15m";
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";

function normalizeEmail(email) {
    return String(email || "")
        .trim()
        .toLowerCase();
}

function buildUserPublicProfile(user) {
    return {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        blocked: Boolean(user.blocked),
    };
}

function generateTokens(user) {
    const payload = {
        sub: user.id,
        email: user.email,
        role: user.role,
    };

    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });

    const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });

    return { accessToken, refreshToken };
}

function getRefreshTokenFromHeaders(req) {
    const fromAuth = req.headers.authorization;
    if (fromAuth && fromAuth.startsWith("Bearer ")) {
        return fromAuth.slice("Bearer ".length);
    }

    return req.headers["x-refresh-token"];
}

router.post("/register", async (req, res) => {
    const { email, first_name, last_name, password } = req.body || {};

    if (!email || !first_name || !last_name || !password) {
        return res.status(400).json({
            error: "Поля email, first_name, last_name и password обязательны",
        });
    }

    const normalizedEmail = normalizeEmail(email);
    const existingUser = users.find((u) => u.email === normalizedEmail);

    if (existingUser) {
        return res.status(409).json({ error: "Пользователь уже существует" });
    }

    const passwordHash = await bcrypt.hash(String(password), SALT_ROUNDS);

    const user = {
        id: nanoid(8),
        email: normalizedEmail,
        first_name: String(first_name).trim(),
        last_name: String(last_name).trim(),
        password: passwordHash,
        role: "user",
        blocked: false,
    };

    users.push(user);

    return res.status(201).json(buildUserPublicProfile(user));
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body || {};

    if (!email || !password) {
        return res
            .status(400)
            .json({ error: "Поля email и password обязательны" });
    }

    const normalizedEmail = normalizeEmail(email);
    const user = users.find((u) => u.email === normalizedEmail);

    if (!user) {
        return res.status(401).json({ error: "Неверный email или password" });
    }

    if (user.blocked) {
        return res.status(403).json({ error: "Пользователь заблокирован" });
    }

    const isPasswordValid = await bcrypt.compare(
        String(password),
        user.password,
    );
    if (!isPasswordValid) {
        return res.status(401).json({ error: "Неверный email или password" });
    }

    const { accessToken, refreshToken } = generateTokens(user);
    refreshTokens.add(refreshToken);

    return res.json({ accessToken, refreshToken });
});

router.post("/refresh", (req, res) => {
    const refreshToken = getRefreshTokenFromHeaders(req);

    if (!refreshToken) {
        return res.status(400).json({
            error: "Передайте refresh token в заголовке Authorization: Bearer <token> или x-refresh-token",
        });
    }

    if (!refreshTokens.has(refreshToken)) {
        return res
            .status(401)
            .json({ error: "Недействительный refresh token" });
    }

    try {
        const payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
        const user = users.find(
            (currentUser) => currentUser.id === payload.sub,
        );

        if (!user || user.blocked) {
            return res.status(401).json({ error: "Пользователь не найден" });
        }

        refreshTokens.delete(refreshToken);
        const tokens = generateTokens(user);
        refreshTokens.add(tokens.refreshToken);

        return res.json(tokens);
    } catch (error) {
        refreshTokens.delete(refreshToken);
        return res
            .status(401)
            .json({ error: "Недействительный refresh token" });
    }
});

router.get("/me", authenticateAccessToken, (req, res) => {
    return res.json(req.user);
});

module.exports = router;
