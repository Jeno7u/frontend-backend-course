const express = require("express");
const cors = require("cors");
const { logging } = require("./middleware/logging");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const app = express();

app.use(cors());
app.use(express.json());
app.use(logging);

const authRouter = require("./routes/auth");
const productsRouter = require("./routes/products");
const usersRouter = require("./routes/users");

app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/users", usersRouter);

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Goods API",
            version: "1.0.0",
            description: "API для регистрации, логина и управления товарами",
        },
        servers: [
            {
                url: `http://localhost:3000`,
                description: "Локальный сервер",
            },
        ],
    },
    apis: ["./routes/auth.js", "./routes/products.js", "./routes/users.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
    console.log(`API доступно по адресу: http://localhost:${PORT}`);
});
