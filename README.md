# Mecenate — Test Assignment

Мобильное приложение для платформы Mecenate на React Native + Expo.
Реализованы экраны ленты и детальной публикации с real-time обновлениями через WebSocket.

## Стек

- **Expo SDK 54** + **expo-router** (file-based routing)
- **TypeScript** (strict)
- **MobX + mobx-react-lite** — auth-токен и статус WebSocket
- **@tanstack/react-query v5** — server-state (posts, comments, likes)
- **react-native-reanimated v4** (+ worklets) — анимации лайка и счётчика
- **expo-haptics** — тактильный отклик при лайке
- **expo-secure-store** — хранение UUID-токена между запусками
- **expo-image**, **expo-blur**, **@shopify/flash-list**
- Нативный WebSocket API с auto-reconnect

## Запуск

```bash
# 1. Установить зависимости
npm install --legacy-peer-deps

# 2. (опционально) свои переменные окружения
cp .env.example .env
# отредактировать EXPO_PUBLIC_API_URL / EXPO_PUBLIC_WS_URL при необходимости

# 3. Запустить Metro-бандлер
npx expo start
```

Откройте Expo Go на iOS/Android и отсканируйте QR-код, либо нажмите `i` / `a`
в терминале для запуска в симуляторе iOS / эмуляторе Android.

## Переменные окружения

По умолчанию значения берутся из `app.json` → `extra`:

| Переменная               | Значение                                       |
| ------------------------ | ---------------------------------------------- |
| `EXPO_PUBLIC_API_URL`    | `https://k8s.mectest.ru/test-app`              |
| `EXPO_PUBLIC_WS_URL`     | `wss://k8s.mectest.ru/test-app/ws`             |

Любая из них может быть переопределена через `.env`.

## Авторизация

Приложение генерирует UUID v4 на первом запуске и сохраняет его в SecureStore.
Один и тот же UUID используется:

- как `Authorization: Bearer <uuid>` для HTTP-запросов;
- как `?token=<uuid>` для WebSocket-подключения.

Сбросить токен → удалить приложение или очистить данные.

## Структура проекта

```
app/                          # expo-router
├── _layout.tsx               # providers (RQ + MobX + GestureHandler + WS sync)
├── index.tsx                 # Feed screen
└── posts/[id].tsx            # Post detail screen

src/
├── api/                      # HTTP client + typed endpoints + DTOs
├── ws/WebSocketClient.ts     # managed socket с auto-reconnect
├── stores/                   # MobX: AuthStore, WsStore, RootStore
├── hooks/                    # RQ-хуки: usePostsFeed, usePostDetail,
│                             # useComments, useAddComment, useLikeToggle,
│                             # useWsSync
├── components/
│   ├── common/               # Avatar, Button, Icon, ErrorState, EmptyState
│   ├── feed/                 # PostCard, PaidPostCard, TabFilter, AuthorRow
│   └── detail/               # LikeButton, AnimatedCounter, LikeBar,
│                             # CommentItem, CommentInput, PostDetailHeader
├── theme/tokens.ts           # единая таблица цветов/отступов/типографики
└── utils/                    # uuid, time (relative + Russian plural)
```

## Реализованная функциональность

### Feed (`/`)

- Таб-фильтр: Все / Бесплатные / Платные (RQ-кэш по табу — мгновенное переключение)
- Бесконечная прокрутка через FlashList + курсорная пагинация
- Pull-to-refresh
- Карточки `free`: аватар, имя, обложка, заголовок, превью, счётчики, анимированный лайк
- Карточки `paid`: заблюренная обложка, lock-иконка, CTA «Отправить донат»
- Тап по карточке → детальный экран

### Post Detail (`/posts/[id]`)

- Заголовок, обложка, полный текст
- Анимированный лайк с:
  - масштабированием (withSequence)
  - интерполяцией цвета (outline gray ↔ filled red)
  - слайдом счётчика при изменении
  - `Haptics.impactAsync(Medium)` при каждом нажатии
- Optimistic like с rollback при ошибке
- Комментарии с lazy load (FlashList → `onEndReached` → cursor)
- Поле ввода + кнопка отправки, валидация 1–500 символов, `KeyboardAvoidingView`
- Back-кнопка с fallback на `/` если нет истории
- ErrorState при ошибке загрузки поста

### Real-time (WebSocket)

Подключение живёт на уровне `RootLayout` — открывается после hydrate-токена,
переподключается с capped exponential backoff (1s → 15s).

`useWsSync` слушает события и патчит React Query кэш:

| Событие           | Действие                                                       |
| ----------------- | -------------------------------------------------------------- |
| `like_updated`    | патч `likesCount` в деталях поста + во всех страницах ленты    |
| `comment_added`   | prepend комментария в первую страницу (идемпотентно) + bump `commentsCount` |
| `ping`            | keep-alive, без действий                                       |

Обновления появляются без перезагрузки и без участия React-ремоунтов.

## Дизайн-токены

Все стили в компонентах ссылаются на [src/theme/tokens.ts](src/theme/tokens.ts).
Хардкод цветов/размеров в компонентах отсутствует.

Основные токены:

```
primary       #7B4FFF      // активный таб, кнопки, send
primaryTint   #E9E0FF      // disabled CTA, отключённый send
background    #F5F8FD      // фон экранов
surface       #FFFFFF      // карточки
danger        #FF3B30      // filled heart
textPrimary   #1A1A1A
textSecondary #7B7B82
```

## Проверки качества

- `npx tsc --noEmit` — проходит без ошибок
- `npx expo-doctor` — 17/17 проверок пройдено
- `npx expo export --platform ios` — Hermes-бандл собирается успешно

## Примечания

- UI-заглушка «Отправить донат» на платных постах не имеет реальной логики — эндпоинт вне скоупа API.
- Лайки на комментариях — локально-визуальные (API их не поддерживает).
- Дизайн-ссылка: [Figma Test Assignment](https://www.figma.com/design/bAxXrk7TaPN13TZ60yf7uD/Test-Assignment).
- OpenAPI: `https://k8s.mectest.ru/test-app/openapi.json`
