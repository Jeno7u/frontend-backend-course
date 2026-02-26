# Проект: Интернет-магазин (Frontend + Backend)

Русская версия

Краткое описание
- Это учебный проект, состоящий из простого REST API на Express (папка `goods-api`) и одностраничного приложения на React (папка `react-site`). Проект реализует базовую функциональность для управления товарами: просмотр списка, создание, редактирование и удаление.

Структура репозитория
- `goods-api/` — небольшой сервер на Express, реализующий CRUD-эндпоинты для товаров.
- `react-site/` — фронтенд на React (Create React App / react-scripts), использующий API для отображения и редактирования товаров.

Основной функционал
- Список товаров: получение всех товаров.
- Просмотр товара: получение товара по id.
- Создание товара: добавление нового товара через форму.
- Редактирование товара: изменение полей существующего товара.
- Удаление товара: удаление товара по id.

Основные файлы и места реализации
- Backend: `goods-api/server.js`, `goods-api/routes/goods.js`, `goods-api/controllers/goods.js`.
- Frontend: `react-site/src/pages/GoodsPage/GoodsPage.jsx`, `react-site/src/components/GoodsList.jsx`, `react-site/src/components/ProductItem.jsx`, `react-site/src/components/ProductModal.jsx`, `react-site/src/api/index.js`.

API (пример)
- GET /api/goods — получить список товаров
- GET /api/goods/:id — получить товар по id
- POST /api/goods — создать товар (JSON-полe с полями name, category, description, price, stock)
- PUT /api/goods/:id — обновить товар
- DELETE /api/goods/:id — удалить товар

Запуск проекта (локально)
1. Backend
   - Перейти в `goods-api/` и установить зависимости:
     ```bash
     cd goods-api
     npm install
     ```
   - Запустить сервер (в проекте может не быть `start`-скрипта, поэтому используйте `node`):
     ```bash
     node server.js
     ```
   По умолчанию сервер ожидает запросы на `http://localhost:3000` и предоставляет маршруты под префиксом `/api`.

2. Frontend
   - Перейти в `react-site/` и установить зависимости, затем запустить dev-сервер:
     ```bash
     cd react-site
     npm install
     npm run dev
     ```
   - Если `npm run dev` не подходит на вашей платформе, попробуйте `npm start`.

Замечания
- API-клиент фронтенда настроен на `http://localhost:3000/api` (см. `react-site/src/api/index.js`).
- Компиляция стилей может генерировать скомпилированные CSS-файлы рядом с исходниками. При рефакторинге классов проверьте как исходные SCSS, так и скомпилированные CSS файлы.

---

English version

Project overview
- This is a small educational project consisting of an Express REST API (`goods-api`) and a React single-page application (`react-site`). The app demonstrates basic product management: listing, creating, editing, and deleting products.

Repository structure
- `goods-api/` — Express backend implementing CRUD endpoints for products.
- `react-site/` — React frontend (Create React App / react-scripts) consuming the API.

Features
- List products — retrieve all products.
- Get product — retrieve a product by id.
- Create product — add a new product via a form.
- Update product — modify existing product fields.
- Delete product — remove a product by id.

Key files
- Backend: `goods-api/server.js`, `goods-api/routes/goods.js`, `goods-api/controllers/goods.js`.
- Frontend: `react-site/src/pages/GoodsPage/GoodsPage.jsx`, `react-site/src/components/GoodsList.jsx`, `react-site/src/components/ProductItem.jsx`, `react-site/src/components/ProductModal.jsx`, `react-site/src/api/index.js`.

API example endpoints
- GET /api/goods — list products
- GET /api/goods/:id — get product by id
- POST /api/goods — create product (JSON body: name, category, description, price, stock)
- PUT /api/goods/:id — update product
- DELETE /api/goods/:id — delete product

How to run locally
1. Backend
   - Install dependencies and run the server:
     ```bash
     cd goods-api
     npm install
     node server.js
     ```
   - The backend serves routes under `/api` on `http://localhost:3000` by default.

2. Frontend
   - Install dependencies and start the frontend:
     ```bash
     cd react-site
     npm install
     npm run dev
     ```
   - If `npm run dev` does not work, try `npm start`.

Notes
- The frontend API client points to `http://localhost:3000/api` (see `react-site/src/api/index.js`).
- If you change SCSS class names, ensure to update any compiled CSS files as well.
