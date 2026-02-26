const express = require("express");
const cors = require("cors");
const { logging } = require("./middleware/logging");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const app = express();

app.use(cors());
app.use(express.json());
app.use(logging);

const goodsRouter = require("./routes/goods");
const productsRouter = require("./routes/users");

app.use("/api/goods", goodsRouter);
app.use("/api/products", productsRouter);

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
    console.log(`API доступно по адресу: http://localhost:${PORT}`);
});
