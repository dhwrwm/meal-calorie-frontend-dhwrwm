# NutriLog Web app 🥗

NutriLog is a calorie tracker that helps you track your daily calorie intake and meal calories. Built with **Next.js**, **TailwindCss**, and **Zustand** for state management. Users can search for meals and see total calories, macros, etc.

---

## 🌐 Hosted App

[View Live App](https://meal-calorie-frontend-dhwrwm.vercel.app/)

---

## ⚙️ Setup Instructions

1. **Clone the repo**

```bash
git clone https://github.com/your-username/calorie-web-app.git
cd calorie-web-app
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Create `.env.local` file**
   Add your environment variables (example):

```env
NEXT_PUBLIC_API_BASE_URL=https://xpcc.devb.zeak.io
```

4. **Run the app in development**

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

6. **Build for production**

```bash
npm run build
npm start
# or
yarn build
yarn start
```

---

## 🧪 Testing

This project uses **Vitest** + **React Testing Library** for unit and component testing.

### Run tests

```bash
npm run test
# or
yarn test
```

### Test setup

| Tool                        | Purpose                                      |
| --------------------------- | -------------------------------------------- |
| Vitest                      | Test runner                                  |
| React Testing Library       | Component rendering and DOM assertions       |
| `@testing-library/jest-dom` | Custom matchers (e.g. `toBeInTheDocument`)   |
| `happy-dom`                 | Lightweight DOM environment (replaces jsdom) |

Configuration lives in `vitest.config.ts`. Global setup (font mocks, jest-dom) is in `vitest.setup.ts`.

### What's tested

| Area       | Examples                                           |
| ---------- | -------------------------------------------------- |
| Components | `SearchForm`, `Greeting`, `CalorieResultCard` etc. |
| Hooks      | `useLogin`, `useGetCalories`, `useGreeting` etc.   |
| Stores     | `useAuthStore`, `useMealStore`                     |
| Utilities  | `formatLabel`, `apiFetch`                          |

### Notes

- Next.js modules (`next/navigation`, `next/font/google`) are mocked globally via `vitest.setup.ts`
- Zustand stores are tested directly using `getState()` and `setState()` — no mocking needed
- `apiFetch` tests replace `global.fetch` with a `vi.fn()` to prevent real HTTP calls

---

## 🛠️ Tech Decisions & Trade-offs

| Feature          | Tech Choice       | Trade-off / Reasoning                                                                                  |
| ---------------- | ----------------- | ------------------------------------------------------------------------------------------------------ |
| Framework        | Next.js           | Server-side rendering + static pages; slightly higher build complexity but better SEO and performance. |
| State Management | Zustand           | Lightweight and simple; less boilerplate than Redux, but lacks devtools and middleware options.        |
| Styling          | Tailwind CSS v4   | Fast styling and responsiveness; but may be verbose in JSX.                                            |
| API Handling     | Custom `apiFetch` | Centralized fetch with auth support; adds extra abstraction over fetch.                                |
| Hosting          | Vercel            | Easy deployment and previews; limited control over server-side features.                               |
| Testing          | Vitest + RTL      | Fast, ESM-native test runner that pairs well with Vite-based Next.js setups.                           |

---

## 💻 Screenshots

![Dashboard](./screenshots/dashboard.png)
![Dashboard dark](./screenshots/dashboard-dark.png)
![Search Result Light](./screenshots/search-result-light.png)
![Search Result Dark](./screenshots/search-result-dark.png)
![Login page](./screenshots/login.png)
![Register Page](./screenshots/signup.png)
![Search Autocomplete](./screenshots/search-autocomplete.png)
![Mobile Search Results](./screenshots/mobile-search-result.png)
![Dashboard mobile](./screenshots/dashboard-mobile.png)

---

## 🔗 Links

- Repository: [GitHub](https://github.com/dhwrwm/meal-calorie-frontend-dhwrwm)
- Hosted App: [Live Demo](https://meal-calorie-frontend-dhwrwm.vercel.app/)
