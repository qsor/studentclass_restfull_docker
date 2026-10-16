# Задание: Docker Monorepo

> [!IMPORTANT]
> **Это ветка с заданием (`main`).** 
> Ваша задача: написать `Dockerfile` для каждого из трех сервисов (backend, frontend, database) и связать их в единую сеть.
> Если вы застряли или хотите подсмотреть готовое решение, переключитесь на ветку `example`:
> `git checkout example`

Этот репозиторий содержит три сервиса (база данных, бекенд и фронтенд), которые необходимо запустить локально и связать с помощью Docker Network.

## 1. Подготовка сети

Сначала необходимо создать общую виртуальную сеть, чтобы контейнеры могли общаться друг с другом по именам.

```bash
docker network create studentclass-network
```

## 2. Запуск Базы данных (PostgreSQL)

Перейдите в папку `database/` и соберите образ БД. Затем запустите контейнер, подключив его к созданной сети с именем `db` (бекенд будет искать хост с именем `db`).

```bash
cd database
docker build -t studentclass-db .
docker run -d --name db --network studentclass-network studentclass-db
cd ..
```

*Контейнер `db` сразу запустится с нужным пользователем и пустой базой данных.*

## 3. Запуск Backend (Django API)

Перейдите в папку `backend/`. 
Бекенд автоматически подключится к БД, выполнит миграции (создаст таблицы) и загрузит "стоковых" студентов с помощью команды `seed_db`.

```bash
cd backend
docker build -t studentclass-backend .
docker run -d --name backend -p 8000:8000 --network studentclass-network studentclass-backend
cd ..
```

*API будет доступно по адресу `http://localhost:8000/api/v1/users/`.*

## 4. Запуск Frontend (Vanilla JS)

Перейдите в папку `frontend/`. 
Фронтенд — это простой сервер статики (HTML, CSS, JS), работающий на порту 80. Мы "пробросим" его на порт 8080 вашего компьютера.

```bash
cd frontend
docker build -t studentclass-frontend .
docker run -d --name frontend -p 8080:80 --network studentclass-network studentclass-frontend
cd ..
```

## 5. Проверка работы

Теперь вы можете зайти в браузере по адресу:
**http://localhost:8080**

Там откроется простая витрина данных, которая автоматически сделает запрос к `http://localhost:8000/api/v1/users/` (вашему бекенду) и отобразит студентов с возможностью фильтрации.

---
**Примечание:** Для остановки и удаления всех контейнеров после завершения работы выполните:
```bash
docker stop db backend frontend
docker rm db backend frontend
```
