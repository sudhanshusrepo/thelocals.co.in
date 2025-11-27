# Development

This document describes how to set up the development environment and get started with developing the application.

## Prerequisites

*   [Node.js](https://nodejs.org/en/) (v18 or later)
*   [pnpm](https://pnpm.io/)
*   A Supabase account

## Setup

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Set up environment variables:**

    Create a `.env` file in the root of the project and add the following environment variables:

    ```
    VITE_SUPABASE_URL=<your-supabase-url>
    VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
    VITE_GEMINI_API_KEY=<your-gemini-api-key>
    ```

4.  **Run the development server:**

    ```bash
    pnpm dev
    ```

    This will start the React application on `http://localhost:5173`.

## Development Workflow

*   The project is a monorepo, with the React application in the `apps/web` directory and the shared services in the `packages/core` directory.
*   Changes to the `packages/core` directory will automatically be reflected in the `apps/web` application.
*   The Supabase schema is managed through migrations. To create a new migration, you can use the Supabase CLI.

## Future Improvements

### Monorepo Management

While `pnpm` workspaces are effective for this project, we should consider adopting a more advanced monorepo management tool like [Turborepo](https://turbo.build/repo) or [Nx](https://nx.dev/) in the future. These tools can help to streamline build processes, manage dependencies more effectively, and improve overall performance as the codebase grows.
