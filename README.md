# Countries Widget

A responsive country information widget built with Next.js and TypeScript.

The application allows users to search for and select a country from a custom dropdown. After selecting a country, the widget displays its capital, region, currencies, population, and time zones.

## Features

- Fetches country data from the REST Countries API
- Searchable custom country dropdown
- Country flags displayed as emoji
- Clear search button
- Animated dropdown arrow
- Loading and error states
- Responsive layout
- Keyboard-accessible buttons and visible focus states
- API key kept securely on the server
- Country data cached by Next.js

## Country Information

For each selected country, the widget displays:

- Capital
- Region
- Currency name, code, and symbol
- Population
- Time zones

## Technologies

- Next.js
- React
- TypeScript
- CSS Modules
- REST Countries API

## Project Structure

```text
src/
├── app/
│   ├── api/
│   │   └── countries/
│   │       └── route.ts
│   ├── components/
│   │   ├── CountriesWidget.tsx
│   │   └── CountriesWidget.module.css
│   ├── layout.tsx
│   └── page.tsx
```

## How It Works

The client-side `CountriesWidget` component sends a request to the internal Next.js API route:

```text
/api/countries
```

The API route requests country data from REST Countries v5 and returns a simplified response to the client.

The REST Countries API key is stored on the server and is never exposed in the browser.

Because the free REST Countries plan returns a maximum of 100 countries per request, the server route loads the data using pagination.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/kottuzik/countries-widget-task.git
cd countries-widget-task
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create an API key

Create an account and obtain an API key from:

[REST Countries](https://restcountries.com/)

### 4. Configure environment variables

Create a `.env.local` file in the project root:

```env
REST_COUNTRIES_API_KEY=your_api_key
```

Do not commit `.env.local` or expose your API key publicly.

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

```bash
npm run dev
```

Starts the development server.

```bash
npm run build
```

Creates a production build.

```bash
npm run start
```

Starts the production server after building the project.

```bash
npm run lint
```

Runs ESLint.

## API

This project uses the [REST Countries API v5](https://restcountries.com/docs/countries).

The application requests the following country fields:

- Common name
- Country code
- Capital
- Flag emoji
- Region
- Currencies
- Population
- Time zones
