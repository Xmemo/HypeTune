# HypeTune Lab

A professional AI workspace for deconstructing musical intuition into structured creative blueprints and production signals.

## Overview

`HypeTune Lab` is a specialized environment for AI music creators and producers. It leverages large language models to analyze musical "vibes" and reverse-engineer them into actionable data across four key dimensions: **Harmony**, **Rhythm**, **Texture**, and **Arrangement**.

## Core Concepts

The application serves as a bridge between **Auditory Instinct** and **Creative Execution**:
- **Sonic Deconstruction:** Analyzes the DNA of a track to identify why it works.
- **Precision Prompting:** Converts abstract feelings into high-fidelity prompts for AI tools (Suno, Udio, etc.).
- **Reference Mapping:** Identifies specific sonic targets for alignment and consistency.

## Key Features

- **4D Analysis Framework:** Systematic breakdown of music into core production elements.
- **AI-Optimized Prompts:** Generates structured inputs for LLM-based music generation.
- **Cross-Lingual Support:** Optimized for both English and Chinese creative workflows.
- **Inspiration Mining:** Helps creators move from shallow imitation to informed production.

## Tech Stack

- **Frontend:** React + TypeScript
- **Build System:** Vite
- **Integrations:** AI Processing Engine (API-based)

## Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd hypetune-lab
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup environment variables:
   Copy `.env.example` to `.env` and configure your API keys.

4. Start development:
   ```bash
   npm run dev
   ```

## Deployment

This project is pre-configured for **Vercel** cloud deployment:

1. Push the code to your GitHub repository.
2. Import the repository into the Vercel dashboard.
3. Add the following environment variable in the Vercel project settings:
   - `ZHIPU_API_KEY`: Your Zhipu AI API Key.
4. Deploy. Vercel will automatically detect and deploy the Serverless Functions in the `api/` directory.

### Option B: Render Backend + Vercel Frontend (Recommended)

Since Vercel Hobby tier has a 10s timeout limit, if you encounter frequent "Request timeout" errors, we recommend deploying the backend to **Render**:

1. **Render Deployment:** Create a new **Web Service** on Render. Set the start command to `npm start` and add the `ZHIPU_API_KEY` environment variable.
2. **Copy URL:** Copy the URL provided by Render (e.g., `https://xxx.onrender.com`).
3. **Frontend Link:** In your Vercel project settings, add the environment variable `VITE_BACKEND_API_BASE_URL` with your Render URL, then redeploy the frontend.

## License

MIT License - see [LICENSE](LICENSE) for details.
