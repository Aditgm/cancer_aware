# Cancer Awareness Platform

A comprehensive web application for cancer awareness, medical record management, and AI-powered treatment planning.

## 🚀 Features

- **User Authentication**: Secure login with Privy wallet integration
- **Medical Records Management**: Upload and manage medical reports
- **AI-Powered Analysis**: Google Gemini AI integration for treatment analysis
- **Treatment Planning**: Interactive Kanban board for treatment tracking
- **Screening Schedules**: Manage and track cancer screening appointments
- **Responsive Design**: Modern UI with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Authentication**: Privy
- **Database**: Neon PostgreSQL with Drizzle ORM
- **AI Integration**: Google Generative AI (Gemini)
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Neon PostgreSQL database
- Google AI API key
- Privy App ID

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cancer_aware
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_DATABASE_URL=your_neon_database_url
   VITE_GEMINI_API_KEY=your_google_ai_api_key
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

## 🚀 Deployment

### Vercel Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Import your GitHub repository
   - Add environment variables:
     - `VITE_DATABASE_URL`
     - `VITE_GEMINI_API_KEY`

3. **Deploy**
   - Vercel will automatically detect the Vite configuration
   - Build and deploy will happen automatically

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── context/            # React context for state management
├── utils/              # Database configuration and schema
├── assets/             # Static assets (SVGs, images)
├── constants/          # Application constants
└── index.css           # Global styles
```

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_DATABASE_URL` | Neon PostgreSQL connection string | Yes |
| `VITE_GEMINI_API_KEY` | Google AI API key for treatment analysis | Yes |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
