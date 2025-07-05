🎗️ Cancer Awareness Platform

A comprehensive web application for cancer awareness, medical record management, and AI-powered treatment planning.

<div align="center">
  <img src="https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/Vite-Latest-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Google_AI-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Google AI">
</div>

✨ Features
🔐 Authentication & Security

Secure Login with Privy wallet integration
User-specific data isolation for privacy protection

📋 Medical Records Management

Upload & organize medical reports securely
Document categorization for easy access
Version control for medical document updates

🤖 AI-Powered Analysis

Google Gemini AI integration for intelligent treatment analysis
Automated report interpretation and recommendations
Personalized treatment insights based on medical history

📊 Treatment Planning

Interactive Kanban board for treatment workflow tracking
Progress visualization and milestone management
Collaborative planning with healthcare providers

🗓️ Screening Schedules

Automated screening reminders and notifications
Appointment scheduling and management
Preventive care tracking for early detection

🎨 Modern User Experience

Responsive design optimized for all devices
Intuitive navigation and user-friendly interface
Accessibility-focused development


🛠️ Tech Stack
<table>
  <tr>
    <td align="center"><strong>Frontend</strong></td>
    <td>React 18, Vite, Tailwind CSS</td>
  </tr>
  <tr>
    <td align="center"><strong>Authentication</strong></td>
    <td>Privy Wallet Integration</td>
  </tr>
  <tr>
    <td align="center"><strong>Database</strong></td>
    <td>Neon PostgreSQL with Drizzle ORM</td>
  </tr>
  <tr>
    <td align="center"><strong>AI Integration</strong></td>
    <td>Google Generative AI (Gemini)</td>
  </tr>
  <tr>
    <td align="center"><strong>Deployment</strong></td>
    <td>Vercel</td>
  </tr>
</table>

📋 Prerequisites
Before you begin, ensure you have the following installed:

Node.js (v16 or higher) - Download here
npm or yarn package manager
Git for version control
Neon PostgreSQL database account
Google AI API key access
Privy App ID for authentication


🚀 Quick Start
1. Clone the Repository
bashgit clone <repository-url>
cd cancer_aware
2. Install Dependencies
bash# Using npm
npm install

# Or using yarn
yarn install
3. Environment Setup
Create a .env file in the root directory:
env# Database Configuration
VITE_DATABASE_URL=your_neon_database_url

# AI Integration
VITE_GEMINI_API_KEY=your_google_ai_api_key

# Authentication (Optional)
VITE_PRIVY_APP_ID=your_privy_app_id
4. Start Development Server
bashnpm run dev
Your application will be available at http://localhost:5173

🌐 Deployment
Vercel Deployment (Recommended)

Prepare Your Repository
bashgit add .
git commit -m "🚀 Ready for deployment"
git push origin main

Deploy to Vercel

Visit Vercel Dashboard
Click "New Project" and import your GitHub repository
Configure environment variables:

VITE_DATABASE_URL
VITE_GEMINI_API_KEY
VITE_PRIVY_APP_ID




Automatic Deployment

Vercel automatically detects Vite configuration
Build and deployment happen seamlessly
Your app will be live with a custom domain


🔐 Environment Variables
VariableDescriptionRequiredExampleVITE_DATABASE_URLNeon PostgreSQL connection string✅postgresql://user:pass@host/dbVITE_GEMINI_API_KEYGoogle AI API key for treatment analysis✅AIzaSyB...VITE_PRIVY_APP_IDPrivy authentication app identifier⚠️clm7q...

🧪 Available Scripts
bash# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Quality Assurance
npm run lint         # Run ESLint
npm run test         # Run tests
npm run type-check   # TypeScript type checking

🤝 Contributing
We welcome contributions! Here's how you can help:

Fork the repository
Create a feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request

📝 Contribution Guidelines

Follow the existing code style
Write clear commit messages
Add tests for new features
Update documentation as needed


📄 License
This project is licensed under the MIT License - see the LICENSE file for details.


🙏 Acknowledgments

Google AI for providing the Gemini API
Neon for reliable PostgreSQL hosting
Privy for seamless authentication
Vercel for excellent deployment platform
Open Source Community for amazing tools and libraries


<div align="center">
  <h3>Made with ❤️ and care by <strong>Aditya & Ayush</strong></h3>
  <p><em>Building technology to save lives, one line of code at a time.</em></p>
</div>
