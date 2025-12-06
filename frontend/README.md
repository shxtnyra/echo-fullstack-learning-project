# Echo Frontend

Современный frontend для музыкального приложения Echo, построенный на React + TypeScript + Vite.

## Технологии

- **React 19** - UI библиотека
- **TypeScript** - типизация
- **Vite** - сборщик и dev-сервер
- **React Router** - маршрутизация
- **Axios** - HTTP клиент
- **Tailwind CSS** - стилизация

## Установка

```bash
npm install
```

## Запуск

```bash
npm run dev
```

Приложение будет доступно по адресу `http://localhost:5173`

## Сборка

```bash
npm run build
```

## Структура проекта

```
src/
├── api/              # API сервисы
│   ├── apiClient.ts  # Настроенный axios клиент
│   ├── authService.ts
│   ├── trackService.ts
│   ├── artistService.ts
│   ├── albumService.ts
│   ├── tagService.ts
│   └── sourceService.ts
├── components/       # React компоненты
│   ├── Layout.tsx
│   ├── AudioPlayer.tsx
│   ├── TrackCard.tsx
│   └── ProtectedRoute.tsx
├── context/          # React контексты
│   └── AuthContext.tsx
├── pages/            # Страницы приложения
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── TracksPage.tsx
│   ├── ArtistsPage.tsx
│   ├── AlbumsPage.tsx
│   ├── SourcesPage.tsx
│   └── TagsPage.tsx
├── types/            # TypeScript типы
│   └── index.ts
├── App.tsx           # Главный компонент
├── main.tsx          # Точка входа
└── index.css         # Глобальные стили
```

## Функциональность

- ✅ Аутентификация (логин/регистрация)
- ✅ Просмотр треков с пагинацией
- ✅ Аудио плеер с управлением
- ✅ Просмотр артистов, альбомов, источников, тегов
- ✅ Поиск по всем сущностям
- ✅ Скачивание треков (ZIP архивы)
- ✅ Адаптивный дизайн
- ✅ Автоматическое обновление токенов

## API Endpoints

Frontend работает с backend API на `http://localhost:8082/api/v1`

## Настройка

Измените `API_URL` в `src/api/apiClient.ts` если ваш backend работает на другом порту.
