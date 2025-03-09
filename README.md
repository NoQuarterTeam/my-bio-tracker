# My Bio Tracker

A comprehensive biological data tracking application built with Next.js, deployed on Vercel, and using PostgreSQL database.

## Tech Stack

- **Frontend & Backend**: Next.js 15
- **Database**: PostgreSQL (compatible with any provider)
- **Styling**: Tailwind CSS with shadcn/ui components
- **Authentication**: Custom auth solution
- **ORM**: Drizzle ORM
- **AI Integration**: OpenAI and Mistral AI
- **User Engagement**: Loops
- **Deployment**: Vercel

## Prerequisites

- Node.js 20+ or Bun
- PostgreSQL database (Neon, Supabase, or any other PostgreSQL provider)
- OpenAI API key
- Mistral AI API key
- Loops API key
- Vercel account (for deployment)

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
DATABASE_URL=your_postgresql_connection_string
OPENAI_API_KEY=your_openai_api_key
APP_SECRET=your_app_secret_for_general_encryption
APP_AUTH_SECRET=your_app_auth_secret_for_authentication
MISTRAL_API_KEY=your_mistral_api_key
LOOPS_API_KEY=your_loops_api_key
```

### Generating Secrets

For `APP_SECRET` and `APP_AUTH_SECRET`, you can generate secure random strings using:

```bash
openssl rand -hex 32
```

## Setup Instructions

1. **Clone the repository**

```bash
git clone https://github.com/NoQuarterTeam/my-bio-tracker
cd my-bio-tracker
```

2. **Install dependencies**

```bash
bun install
```

3. **Set up the database**

Create a PostgreSQL database using any provider of your choice:
- [Neon](https://neon.tech)
- [Supabase](https://supabase.com)
- [Railway](https://railway.app)
- Or any other PostgreSQL provider
- Get your connection string and add it to your `.env.local` file as `DATABASE_URL`

4. **Run database migrations**

```bash
bun db:push
```

5. **Start the development server**

```bash
bun dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Database Management

- **Push schema changes**: `bun db:push`
- **Generate migrations**: `bun db:migrate`
- **Open Drizzle Studio**: `bun db:studio`

## Deployment

### Deploying to Vercel

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Add all environment variables in the Vercel project settings
4. Deploy

## API Keys Setup

### OpenAI API

1. Create an account at [OpenAI](https://platform.openai.com/)
2. Generate an API key
3. Add the key to your `.env.local` file as `OPENAI_API_KEY`

### Mistral AI API

1. Create an account at [Mistral AI](https://mistral.ai/)
2. Generate an API key
3. Add the key to your `.env.local` file as `MISTRAL_API_KEY`

### Loops API

1. Create an account at [Loops](https://loops.so/)
2. Generate an API key
3. Add the key to your `.env.local` file as `LOOPS_API_KEY`

## Project Structure

- `/src/app` - Next.js app router pages and API routes
- `/src/components` - UI components using shadcn/ui
- `/src/lib` - Utility functions and shared code
- `/src/lib/server` - Server-side code including database schema and operations
- `/public` - Static assets

## License

[MIT](LICENSE) 