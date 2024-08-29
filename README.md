# Chad-Next

Chad-Next aims to be the most sigma Next.js starter kit available.

Be a chad and kickstart your next SaaS project with a powerful and modern tech stack.

## 🚀 Features

### Out of the Box
- [Bun](https://bun.sh/) - A fast all-in-one JavaScript runtime
- [Next.js 14](https://nextjs.org/) - The React Framework for Production
- [TailwindCSS](https://tailwindcss.com/) and [shadcn/ui](https://ui.shadcn.com/) - For rapid and beautiful UI development
- [Tanstack Query](https://tanstack.com/query/latest) and Devtools - Powerful asynchronous state management
- [DrizzleORM](https://orm.drizzle.team/) - TypeScript ORM for SQL databases
- [Lucia](https://lucia-auth.com/) auth with GitHub OAuth - Flexible authentication solution

### Configurable Options
- Classic authentication
- Google OAuth

## 🛠 Getting Started

Follow these steps to set up your project using Chad-Next:

1. Clone this repository and navigate to your project directory.

2. Copy the environment variables:
   ```
   cp .env.example .env
   ```
   Fill in the required environment variables in the newly created `.env` file.

3. Configure the database container name:
   Open `start-database.sh` and change the value of `DB_CONTAINER_NAME` on line 12 to `"{your-project-name}-postgres"`.

4. Install dependencies:
   ```
   bun install
   ```

5. Set up the database:
   ```
   bun drizzle-kit generate && bun drizzle-kit migrate
   ```

## 💻 Local Development Workflow

1. Start the development server:
   ```
   bun run dev
   ```

2. In a separate terminal window, launch Drizzle Studio:
   ```
   bunx drizzle-kit studio
   ```

## 🤝 Contributing

Contributions to Chad-Next are welcome! Raise issues and make PRs, and the chad shall review in due time.

---

Built by shahank42.