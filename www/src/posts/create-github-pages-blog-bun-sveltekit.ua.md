---
title: Створення блогу на GitHub Pages з Bun та SvelteKit
date: '2025-12-23'
tags:
  - sveltekit
  - bun
  - github-pages
  - tutorial
description: Дізнайтеся, як створити та розгорнути сучасний блог за допомогою SvelteKit та Bun на GitHub Pages. Цей посібник охоплює налаштування проєкту, статичний адаптер, пререндеринг та GitHub Actions для швидкого та надійного розгортання статичного сайту.
readingTime: 4 хв
---

У цьому посібнику ми створимо швидкий, сучасний блог за допомогою SvelteKit, Bun та GitHub Pages. Ця комбінація забезпечує чудовий досвід розробки з блискавичними збірками та розгортаннями.

## Передумови

- Обліковий запис GitHub
- Bun, встановлений на вашому комп'ютері
- Базові знання JavaScript/TypeScript

## Крок 1: Створення проєкту SvelteKit

Почніть зі створення нового проєкту SvelteKit:

```bash
bun create svelte@latest my-blog
```

Виберіть наступні опції:
- Which Svelte app template: **Skeleton project**
- Add type checking: **Yes, using TypeScript**
- Select additional options: **None**

Перейдіть до каталогу проєкту:

```bash
cd my-blog
```

## Крок 2: Встановлення статичного адаптера

Для розгортання на GitHub Pages нам потрібен статичний адаптер. Встановіть його за допомогою Bun:

```bash
bun add -D @sveltejs/adapter-static
```

## Крок 3: Налаштування SvelteKit

Оновіть ваш `svelte.config.js` для використання статичного адаптера:

```javascript
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: '404.html',
			precompress: false,
			strict: true
		}),
		paths: {
			base: process.argv.includes('dev') ? '' : process.env.BASE_PATH ?? '/your-repo-name'
		}
	}
};

export default config;
```

Налаштування `BASE_PATH` є критичним для GitHub Pages. Якщо ваш репозиторій називається `my-blog`, ваш сайт буде доступний за адресою `https://username.github.io/my-blog/` замість кореневого домену.

## Крок 4: Увімкнення пререндерингу

Додайте опцію `prerender` до вашого кореневого макета (`src/routes/+layout.ts`):

```typescript
export const prerender = true;
```

Це вказує SvelteKit попередньо рендерити всі сторінки як статичний HTML, що є обов'язковим для GitHub Pages.

## Крок 5: Створення робочого процесу GitHub Actions

Створіть робочий процес GitHub Actions за адресою `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install

      - name: Build
        env:
          BASE_PATH: '/${{ github.event.repository.name }}'
        run: bun run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: build

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

Цей робочий процес:
- Налаштовує Bun за допомогою офіційної дії `setup-bun`
- Встановлює залежності та збирає ваш сайт
- Завантажує артефакти збірки
- Розгортає на GitHub Pages

## Крок 6: Увімкнення GitHub Pages

1. Перейдіть до вашого репозиторію на GitHub
2. Перейдіть до **Settings** → **Pages**
3. У розділі **Build and deployment** встановіть:
   - **Source**: GitHub Actions
4. GitHub використовуватиме ваш файл робочого процесу для автоматичного розгортання

## Крок 7: Додавання контенту блогу

Створіть просту структуру блогу. Ось приклад сторінки `src/routes/+page.svelte`:

```svelte
<script lang="ts">
  import { posts } from '$lib/posts';
</script>

<h1>Мій блог</h1>

<ul>
  {#each posts as post}
    <li>
      <a href="/posts/{post.slug}">{post.title}</a>
    </li>
  {/each}
</ul>
```

## Крок 8: Публікація та розгортання

Зафіксуйте ваші зміни та відправте на GitHub:

```bash
git add .
git commit -m "Initial blog setup"
git push origin main
```

GitHub Actions автоматично збере та розгорне ваш сайт. Після завершення ваш блог буде доступний за адресою `https://your-username.github.io/your-repo-name/`.

## Структура проєкту

Ось довідкова структура проєкту для цього налаштування блогу:

```
www/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── src/
│   ├── app.html
│   ├── app.d.ts
│   ├── lib/
│   │   ├── assets/
│   │   │   └── favicon.svg
│   │   ├── index.ts
│   │   └── posts.ts
│   ├── posts/
│   │   ├── create-github-pages-blog-bun-sveltekit.md
│   │   └── first-post.md
│   └── routes/
│       ├── +layout.svelte
│       ├── +layout.ts
│       ├── +page.server.ts
│       ├── +page.svelte
│       └── posts/
│           └── [slug]/
│               ├── +page.svelte
│               └── +page.ts
├── static/
│   ├── .nojekyll
│   └── robots.txt
├── .gitignore
├── .npmrc
├── bun.lock
├── package.json
├── svelte.config.js
├── tsconfig.json
└── vite.config.ts
```

Ключові файли:
- `svelte.config.js`: Конфігурація SvelteKit зі статичним адаптером
- `.github/workflows/deploy.yml`: Робочий процес GitHub Actions для розгортання
- `src/routes/+layout.ts`: Увімкнення пререндерингу
- `static/.nojekyll`: Запобігає втручанню Jekyll у GitHub Pages

## Переваги цього налаштування

- **Швидкі збірки**: Bun значно швидший за npm або yarn
- **Безпека типів**: TypeScript забезпечує чудовий досвід розробки
- **Сучасний стек**: SvelteKit пропонує чудовий досвід розробки
- **Безкоштовний хостинг**: GitHub Pages повністю безкоштовний для публічних репозиторіїв
- **Автоматичні розгортання**: Відправте в main — і ваш сайт оновиться автоматично

## Наступні кроки

Звідси ви можете:
- Додати підтримку Markdown для постів блогу за допомогою mdsvex
- Стилізувати ваш блог за допомогою Tailwind CSS або інших рішень для стилізації
- Додати функціонал пошуку
- Налаштувати власні домени
- Додати аналітику

Успішного блогінгу!

