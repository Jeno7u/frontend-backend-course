const express = require("express");
const app = express();

app.use(express.json());

const goodsRouter = require("./routes/goods");

app.use("/api/goods", goodsRouter);

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
    console.log(`API доступно по адресу: http://localhost:${PORT}`);
});
