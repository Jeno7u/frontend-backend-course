const express = require("express");
const store = require("../data/store");
const { authenticateAccessToken, requireRoles } = require("../middleware/auth");

const router = express.Router();

function publicUser(user) {
    return {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        blocked: Boolean(user.blocked),
    };
}

function normalizeEmail(email) {
    return String(email || "")
        .trim()
        .toLowerCase();
}

function isAllowedRole(role) {
    return ["user", "seller", "admin"].includes(role);
}

router.use(authenticateAccessToken, requireRoles(["admin"]));

router.get("/", (req, res) => {
    return res.json(store.users.map(publicUser));
});

router.get("/:id", (req, res) => {
    const user = store.users.find(
        (currentUser) => currentUser.id === req.params.id,
    );

    if (!user) {
        return res.status(404).json({ error: "Пользователь не найден" });
    }

    return res.json(publicUser(user));
});

router.put("/:id", (req, res) => {
    const user = store.users.find(
        (currentUser) => currentUser.id === req.params.id,
    );

    if (!user) {
        return res.status(404).json({ error: "Пользователь не найден" });
    }

    const { email, first_name, last_name, role, blocked } = req.body || {};

    if (email !== undefined) {
        const normalizedEmail = normalizeEmail(email);
        const emailTaken = store.users.some(
            (currentUser) =>
                currentUser.id !== user.id &&
                currentUser.email === normalizedEmail,
        );

        if (emailTaken) {
            return res
                .status(409)
                .json({ error: "Пользователь с таким email уже существует" });
        }

        user.email = normalizedEmail;
    }

    if (first_name !== undefined) {
        user.first_name = String(first_name).trim();
    }

    if (last_name !== undefined) {
        user.last_name = String(last_name).trim();
    }

    if (role !== undefined) {
        const normalizedRole = String(role).trim();

        if (!isAllowedRole(normalizedRole)) {
            return res.status(400).json({ error: "Недопустимая роль" });
        }

        user.role = normalizedRole;
    }

    if (blocked !== undefined) {
        user.blocked = Boolean(blocked);
    }

    return res.json(publicUser(user));
});

router.delete("/:id", (req, res) => {
    const user = store.users.find(
        (currentUser) => currentUser.id === req.params.id,
    );

    if (!user) {
        return res.status(404).json({ error: "Пользователь не найден" });
    }

    user.blocked = true;
    return res.status(204).send();
});

module.exports = router;
