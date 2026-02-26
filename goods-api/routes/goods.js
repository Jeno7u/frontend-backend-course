const {
    findProductById,
    deleteById,
    updateById,
} = require("../controllers/goods");
const express = require("express");
const router = express.Router();

let goods = [
    {
        id: 1,
        name: "Стул обычный",
        category: "Мебель",
        description: "Не, ну прикольный",
        price: 184,
        stock: 12,
    },
    {
        id: 2,
        name: "Стул маленький",
        category: "Мебель",
        description: "Не, ну прикольный",
        price: 318,
        stock: 13,
    },
    {
        id: 3,
        name: "Стул большой",
        category: "Мебель",
        description: "Не, ну сойдет",
        price: 205,
        stock: 8,
    },
];

router.get("/", (req, res) => {
    res.json(goods);
});

router.get("/:id", (req, res) => {
    const product = findProductById(req.params.id, goods);

    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: "Продукт не найден" });
    }
});

router.post("/", (req, res) => {
    const product = req.body;
    goods.push(product);

    res.status(201).json(product);
});

router.put("/:id", (req, res) => {
    updateById(req.params.id, goods, req.body);

    res.status(202).end();
});

router.delete("/:id", (req, res) => {
    deleteById(req.params.id, goods);

    res.status(204).end();
});

module.exports = router;
