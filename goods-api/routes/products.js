const express = require("express");
const { nanoid } = require("nanoid");
const { authenticateAccessToken, requireRoles } = require("../middleware/auth");
const store = require("../data/store");
const { products } = store;

const router = express.Router();

function findProductById(id) {
    return products.find((product) => product.id === id);
}

function normalizeProductPayload(payload) {
    return {
        title: String(payload.title || "").trim(),
        category: String(payload.category || "").trim(),
        description: String(payload.description || "").trim(),
        price: Number(payload.price),
    };
}

function validateProductFields(product) {
    if (!product.title || !product.category || !product.description) {
        return "Поля title, category и description обязательны";
    }

    if (!Number.isFinite(product.price) || product.price < 0) {
        return "Поле price должно быть неотрицательным числом";
    }

    return null;
}

router.post(
    "/",
    authenticateAccessToken,
    requireRoles(["seller", "admin"]),
    (req, res) => {
        const productData = normalizeProductPayload(req.body || {});
        const error = validateProductFields(productData);

        if (error) {
            return res.status(400).json({ error });
        }

        const product = {
            id: nanoid(8),
            ...productData,
        };

        products.push(product);
        return res.status(201).json(product);
    },
);

router.get(
    "/",
    authenticateAccessToken,
    requireRoles(["user", "seller", "admin"]),
    (req, res) => {
        return res.json(products);
    },
);

router.get(
    "/:id",
    authenticateAccessToken,
    requireRoles(["user", "seller", "admin"]),
    (req, res) => {
        const product = findProductById(req.params.id);

        if (!product) {
            return res.status(404).json({ error: "Товар не найден" });
        }

        return res.json(product);
    },
);

router.put(
    "/:id",
    authenticateAccessToken,
    requireRoles(["seller", "admin"]),
    (req, res) => {
        const existingProduct = findProductById(req.params.id);

        if (!existingProduct) {
            return res.status(404).json({ error: "Товар не найден" });
        }

        const updatedData = normalizeProductPayload(req.body || {});
        const error = validateProductFields(updatedData);

        if (error) {
            return res.status(400).json({ error });
        }

        existingProduct.title = updatedData.title;
        existingProduct.category = updatedData.category;
        existingProduct.description = updatedData.description;
        existingProduct.price = updatedData.price;

        return res.json(existingProduct);
    },
);

router.delete(
    "/:id",
    authenticateAccessToken,
    requireRoles(["admin"]),
    (req, res) => {
        const productExists = products.some(
            (product) => product.id === req.params.id,
        );

        if (!productExists) {
            return res.status(404).json({ error: "Товар не найден" });
        }

        const index = products.findIndex(
            (product) => product.id === req.params.id,
        );
        products.splice(index, 1);
        return res.status(204).send();
    },
);

module.exports = router;
