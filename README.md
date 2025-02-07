# Bounty-Quest

Bounty-Quest is a decentralized task-based rewards system that generates daily tasks using the Gemini API. Participants complete tasks by posting on the blockchain via Twitter, providing a link to their tweet for AI-powered evaluation. The top three winners are announced based on AI scoring, and authentication is managed through Solana. Future updates will include smart contract integration to distribute rewards in DevSOL.

## Features

- **Daily Task Generation**: Tasks are generated using the Gemini API.
- **Blockchain Integration**: Tasks are posted on Twitter with blockchain validation.
- **AI-based Scoring**: AI evaluates tweets and assigns scores based on relevance and quality.
- **Automated Winner Selection**: The top 3 users with the highest scores are announced.
- **Solana Authentication**: Secure login and verification using Solana wallets.
- **Future Smart Contract Integration**: DevSOL rewards will be distributed through Solana smart contracts.

## Tech Stack

- **Frontend**: Next.js, Tailwind CSS, TypeScript
- **Backend**: API Routes, Solana Authentication
- **AI Scoring**: Gemini API
- **Blockchain**: Solana, Twitter (for task submission)
- **Storage & Services**: MongoDB (for task & user management)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/prathamesh-chougale-17/bounty-quest.git
   cd bounty-quest
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env.local` and update the required credentials.
4. Run the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
prathamesh-chougale-17-bounty-quest/
├── app/                # Next.js app folder
├── components/         # Reusable components
├── hooks/             # Custom React hooks
├── lib/               # Utility functions and API adapters
├── services/          # Business logic services (scoring, task generation)
├── types/             # TypeScript types
├── utils/             # Utility scripts
├── public/            # Static assets
├── .github/           # CI/CD workflows
└── system-design.drawio  # System architecture
```

## API Endpoints

### Authentication (Solana)

```
POST /api/auth
```

Handles user authentication via Solana wallets.

### Task Management

```
POST /api/tasks/create
```

Generates a new task using Gemini API.

```
GET /api/tasks/active
```

Retrieves the active task of the day.

```
POST /api/tasks/submit
```

User submits their Twitter post link for scoring.

### AI Evaluation

```
POST /api/tweet/analyze
```

Analyzes the tweet and assigns a score.

```
POST /api/tasks/evaluate
```

Evaluates all submissions and selects top 3 winners.

## Roadmap

- [x] Task generation using Gemini API
- [x] Solana authentication
- [x] AI-based scoring
- [x] Winner selection automation
- [ ] Smart contract integration for reward distribution

## Contributing

Feel free to submit issues, pull requests, or suggestions to improve Bounty-Quest!

## License

MIT License
