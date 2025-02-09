# Spotify API Dashboard

A modern web application built with Next.js that integrates with the Spotify API to provide a dashboard interface for managing and viewing Spotify data.

## Features

- Spotify OAuth2 Authentication
- Modern and responsive dashboard interface
- Built with Next.js 15 and TypeScript
- Docker support for easy deployment
- Tailwind CSS for styling

## Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn
- Docker and Docker Compose (optional, for containerized deployment)
- Spotify Developer Account and API credentials

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=your_redirect_uri
```

You can obtain these credentials by creating an application in the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/spotify-api.git
cd spotify-api
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`.

## Docker Deployment

To run the application using Docker:

1. Build and start the containers:
```bash
docker-compose up -d
```

2. The application will be available at `http://localhost:3000`.

## Project Structure

```
spotify-api/
├── src/
│   ├── app/              # Next.js app directory
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
├── public/               # Static assets
├── Dockerfile           # Docker configuration
├── docker-compose.yml   # Docker Compose configuration
└── ...
```

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework for production
- [TypeScript](https://www.typescriptlang.org/) - Static typing for JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Docker](https://www.docker.com/) - Containerization platform

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
