# EmojiPay

## Live Link

[emojipay.it](https://emojipay.vercel.app/)

## The Problem

Building a seamless, user-friendly platform for sending and receiving payments in Web3 can be challenging, especially when it involves managing wallets, assets, and complex blockchain technologies. EmojiPay solves this problem by offering a simple and intuitive interface for users to transact with emojis, leveraging Okto’s embedded wallet for a smooth and secure experience.

## Demo video

[Youtube Link](https://www.youtube.com/playlist?list=PL3UlUjd8O7qsx_284aQHBbpcyP0QwVqBV)

## Proposed Solution

EmojiPay is a Web3 payments platform where users can create a unique emoji-based username (3-5 emojis) and use it to send and receive payments. The platform integrates Okto’s wallet services, enabling users to manage their blockchain assets without needing deep technical knowledge of blockchain operations. Users can:

- Create emoji-based usernames to handle transactions.
- View balance, portfolio, and order history (via Okto).
- Transfer multiple blockchain tokens easily.
- Use Google OAuth to sign in and instantly connect their Okto wallet for quick payments.

This creates a frictionless experience, allowing users to interact with their digital assets using only emojis.

## Technologies

- Next.js (v14) for the app routing and server-side rendering.
- Shadcn for UI component design.
- Tailwind CSS for styling.
- Okto SDK for wallet integration and asset management.
- Supabase for persisting indexed data.
- TypeScript for a fully typed solution.

## Characteristics of this solution

- Emoji-based username system for easy user identification and payments.
- Okto wallet integration for seamless blockchain transactions.
- Google OAuth for fast login and wallet setup.
- User-friendly UI designed with Shadcn and Tailwind CSS.
- Responsive design with a modular, well-structured codebase.
- Real-time data fetching from Okto for portfolios, balances, and transaction history.
- Scalable architecture for future features.
- Deployed on Vercel for easy access.

## Install dependencies

```bash
yarn install
```

## Configure environment variables

Set up the environment variables by creating a .env file and populating the following:

```bash
cp .env.example .env
vim .env
```

## Environment variables:

```bash
NEXT_PUBLIC_ENV=development
NEXT_PUBLIC_OKTO_CLIENT_API_KEY=your_okto_client_api_key
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
DATABASE_URL=your_supabase_database_url
```

## Project Structure

```bash
/src
  .env            - Contains typed environment variables.
  /app               - Houses API and UI routes.
    /_components       - Platform-specific folders for each feature.
  /components/ui     - Standardized atomic UI components.
```

## Routes

- /: Main landing page showcasing the features of the app
- /dash: View your portfolio, transfer tokens and view history.
- /create: Page to Claim your emoji username
- /api/emoji: API endpoint to do logic regarding emojis
- /api/emoji/wallet: API endpoint to get information of wallet based on emoji
- /api/tx/prepare: API endpoint to get information to prepare tx to send money
- /api/user: API endpoint to create, update and retrieve user information
- /api/wallet: API endpoint to get wallet information

## Running the project

Ensure the .env file is correctly set up. To run the project in development mode:

```bash
pnpm dev
```

## Creating a production build

To create a production build, run:

```bash
pnpm build
pnpm start
```

This will start a server for the production build.
