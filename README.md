# SchemeFinder 

[![License: MIT](https://img.shields.io/badge/License-MIT-174D38.svg)](https://opensource.org/licenses/MIT)
[![Vite](https://img.shields.io/badge/Vite-8.2-174D38?logo=vite)](https://vitejs.org/)
[![React](https://img.shields.io/badge/React-18-174D38?logo=react)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-174D38?logo=tailwindcss)](https://tailwindcss.com/)
[![Language](https://img.shields.io/badge/Language-English%20%7C%20%E0%A4%B9%E0%A4%BF%E0%A4%A8%E0%A5%8D%E0%A4%A6%E0%A5%80-4D1717.svg)](#)

---

## Description

**SchemeFinder** is a personalized civic intelligence web application designed to bridge the gap between Indian citizens and government welfare schemes. 

Instead of searching through fragmented government portals and reading complex eligibility PDFs, citizens can simply describe their profile naturally in **English or Hindi** (via freeform text, voice input, or quick form). SchemeFinder's boundary-safe NLP engine parses key criteria—such as age, state, education, category, and income—and instantly matches them against verified Central and State government welfare schemes with direct links to official application portals.

---

## Requirements

Ensure you have the following installed on your machine before running the application:

- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher (or `yarn` / `pnpm`)
- **Modern Web Browser**: Chrome, Edge, Safari, or Firefox (Chrome/Edge recommended for Voice Input via Speech Recognition API)

---

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/schemefinder.git
   cd schemefinder
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

---

## Usage

### Development Mode
Start the local development server with Hot Module Replacement (HMR):
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173` (or `http://localhost:5174`).

### Production Build
To create an optimized production build:
```bash
npm run build
```

To preview the generated production build locally:
```bash
npm run preview
```