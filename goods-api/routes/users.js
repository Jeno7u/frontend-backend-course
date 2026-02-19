const { nanoid } = require("nanoid");
const express = require("express");
const router = express.Router();

let products = [
    {
        id: nanoid(6),
        name: "Кресло офисное",
        category: "Мебель",
        description:
            "Удобное кресло для офиса с регулировкой высоты и наклона спинки",
        price: 4500,
        stock: 12,
    },
    {
        id: nanoid(6),
        name: "Стол письменный",
        category: "Мебель",
        description:
            "Современный письменный стол со встроенными ящиками для хранения",
        price: 6890,
        stock: 8,
    },
    {
        id: nanoid(6),
        name: "Монитор 27 дюймов",
        category: "Электроника",
        description:
            "IPS монитор с разрешением 2560x1440, идеален для работы и развлечений",
        price: 12500,
        stock: 15,
    },
    {
        id: nanoid(6),
        name: "Клавиатура механическая",
        category: "Электроника",
        description:
            "Механическая клавиатура с RGB подсветкой и горячей заменой переключателей",
        price: 5200,
        stock: 20,
    },
    {
        id: nanoid(6),
        name: "Мышка беспроводная",
        category: "Электроника",
        description: "Эргономичная беспроводная мышка с точным сенсором",
        price: 1800,
        stock: 30,
    },
    {
        id: nanoid(6),
        name: "USB-C кабель",
        category: "Аксессуары",
        description:
            "Прочный кабель USB-C длиной 2 метра для зарядки и передачи данных",
        price: 450,
        stock: 50,
    },
    {
        id: nanoid(6),
        name: "Подставка для монитора",
        category: "Аксессуары",
        description:
            "Регулируемая подставка для монитора с отделением для хранения",
        price: 2300,
        stock: 18,
    },
    {
        id: nanoid(6),
        name: "Ковер под стол",
        category: "Аксессуары",
        description:
            "Мягкий коврик для офисного стула, защищает пол от царапин",
        price: 3100,
        stock: 10,
    },
    {
        id: nanoid(6),
        name: "Лампа настольная LED",
        category: "Освещение",
        description:
            "Современная LED лампа с регулировкой яркости и цветовой температуры",
        price: 2800,
        stock: 14,
    },
    {
        id: nanoid(6),
        name: "Полка навесная",
        category: "Мебель",
        description:
            "Прочная навесная полка из натурального дерева, грузоподъемность 50 кг",
        price: 1200,
        stock: 25,
    },
    {
        id: nanoid(6),
        name: "Стул гостевой",
        category: "Мебель",
        description:
            "Компактный стул для гостей или дополнительного рабочего места",
        price: 2400,
        stock: 16,
    },
];

function findProductOr404(id, res) {
    const product = products.find((p) => p.id == id);
    if (!product) {
        res.status(404).json({ error: "Товар не найден" });
        return null;
    }
    return product;
}

router.get("/", (req, res) => {
    res.json(products);
});

router.get("/:id", (req, res) => {
    const product = findProductOr404(req.params.id, res);
    if (!product) return;
    res.json(product);
});

router.post("/", (req, res) => {
    const { name, category, description, price, stock } = req.body;
    const newProduct = {
        id: nanoid(6),
        name: name.trim(),
        category: category.trim(),
        description: description.trim(),
        price: Number(price),
        stock: Number(stock),
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

router.patch("/:id", (req, res) => {
    const product = findProductOr404(req.params.id, res);
    if (!product) return;

    if (
        req.body?.name === undefined &&
        req.body?.category === undefined &&
        req.body?.description === undefined &&
        req.body?.price === undefined &&
        req.body?.stock === undefined
    ) {
        return res.status(400).json({
            error: "Нечего обновлять",
        });
    }

    const { name, category, description, price, stock } = req.body;
    if (name !== undefined) product.name = name.trim();
    if (category !== undefined) product.category = category.trim();
    if (description !== undefined) product.description = description.trim();
    if (price !== undefined) product.price = Number(price);
    if (stock !== undefined) product.stock = Number(stock);
    res.json(product);
});

router.delete("/:id", (req, res) => {
    const exists = products.some((p) => p.id === req.params.id);
    if (!exists) return res.status(404).json({ error: "Товар не найден" });
    products = products.filter((p) => p.id !== req.params.id);
    res.status(204).send();
});

module.exports = router;
