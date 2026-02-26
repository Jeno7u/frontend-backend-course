const {
    findProductById,
    deleteById,
    updateById,
} = require("../controllers/goods");
const { nanoid } = require("nanoid");
const express = require("express");
const router = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *      Product:
 *          type: object
 *          required:
 *              - name
 *              - category
 *              - description
 *              - price
 *              - stock
 *          properties:
 *              id:
 *                  type: string
 *                  description: Автоматически сгенерированный уникальный ID товара
 *              name:
 *                  type: string
 *                  description: Название товара
 *              category:
 *                  type: string
 *                  description: Категория товара
 *              description:
 *                  type: string
 *                  description: Описание товара
 *              price:
 *                  type: int
 *                  description: Цена товара
 *              stock:
 *                  type: int
 *                  description: Кол-во товара на складе
 *          example:
 *              id: "#GsVonJ"
 *              name: "Стул обычный"
 *              category: "Мебель"
 *              description: "Не, ну прикольный стул"
 *              price: 210
 *              stock: 24
 */

let goods = [
    {
        id: nanoid(6),
        name: "Стул обычный",
        category: "Мебель",
        description: "Не, ну прикольный",
        price: 184,
        stock: 12,
    },
    {
        id: nanoid(6),
        name: "Стул маленький",
        category: "Мебель",
        description: "Не, ну прикольный",
        price: 318,
        stock: 13,
    },
    {
        id: nanoid(6),
        name: "Стул большой",
        category: "Мебель",
        description: "Не, ну сойдет",
        price: 205,
        stock: 8,
    },
];

/**
 * @swagger
 * /api/goods:
 *  get:
 *      summary: Получения списка товаров
 *      tags: [Goods]
 *      responses:
 *          200:
 *              description: Успешно получен список товаров
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 */

router.get("/", (req, res) => {
    res.json(goods);
});

/**
 * @swagger
 * /api/goods/{id}:
 *  get:
 *      summary: Получения товара по его id
 *      tags: [Goods]
 *      responses:
 *          200:
 *              description: Успешно получен товар
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          404:
 *              description: Продукт не найден
 */

router.get("/:id", (req, res) => {
    const product = findProductById(req.params.id, goods);

    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: "Продукт не найден" });
    }
});

/**
 * @swagger
 * /api/goods:
 *  post:
 *      summary: Добавление товара
 *      tags: [Goods]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Product'
 *      responses:
 *          201:
 *              description: Успешно добавлен продукт
 */

router.post("/", (req, res) => {
    const product = req.body;
    goods.push(product);

    res.status(201).json(product);
});

/**
 * @swagger
 * /api/goods/{id}:
 *  put:
 *      summary: Изменение товара по его id
 *      tags: [Goods]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Product'
 *      responses:
 *          202:
 *              description: Успешно изменен товар
 */

router.put("/:id", (req, res) => {
    updateById(req.params.id, goods, req.body);

    res.status(202).end();
});

/**
 * @swagger
 * /api/goods/{id}:
 *  delete:
 *      summary: Удаление товара по его id
 *      tags: [Goods]
 *      responses:
 *          204:
 *              description: Успешно удален товар
 */

router.delete("/:id", (req, res) => {
    deleteById(req.params.id, goods);

    res.status(204).end();
});

module.exports = router;
