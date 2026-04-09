const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");

const SALT_ROUNDS = 10;

const users = [
    {
        id: nanoid(8),
        email: "admin@example.com",
        first_name: "Admin",
        last_name: "User",
        password: bcrypt.hashSync("password123", SALT_ROUNDS),
        role: "admin",
        blocked: false,
    },
    {
        id: nanoid(8),
        email: "seller@example.com",
        first_name: "Seller",
        last_name: "User",
        password: bcrypt.hashSync("password123", SALT_ROUNDS),
        role: "seller",
        blocked: false,
    },
    {
        id: nanoid(8),
        email: "user@example.com",
        first_name: "Regular",
        last_name: "User",
        password: bcrypt.hashSync("password123", SALT_ROUNDS),
        role: "user",
        blocked: false,
    },
];

const products = [
    {
        id: nanoid(8),
        title: "Кресло офисное",
        category: "Мебель",
        description: "Удобное кресло для офиса с регулировкой высоты",
        price: 4500,
    },
    {
        id: nanoid(8),
        title: "Монитор 27 дюймов",
        category: "Электроника",
        description: "IPS монитор с высоким разрешением",
        price: 12500,
    },
];

const refreshTokens = new Set();

module.exports = {
    users,
    products,
    refreshTokens,
};
