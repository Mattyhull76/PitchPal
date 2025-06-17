# PitchPal - AI Startup Pitch Generator

**One-liner:** "From napkin sketch to investor-ready pitch in minutes."

PitchPal is an AI-powered platform that transforms your startup idea into a compelling pitch deck, executive summary, and investor materials that get results.

## 🚀 Features

### Core Features
- **AI Pitch Deck Generator** - Transform your idea into a complete pitch deck with AI-generated content tailored to your industry and audience
- **Executive Summary Generator** - Generate professional one-page summaries perfect for investors, incubators, and grant applications
- **Smart Templates** - Industry-specific templates that adapt to B2B, B2C, SaaS, and other business models automatically
- **Investor Targeting** - Customize your pitch for different investor types and regions with AI-powered personalization
- **Export Options** - Download your pitch as PDF, PPTX, or share interactive web versions with professional branding
- **Smart Sharing** - Share your pitch with trackable links, analytics, and investor-friendly viewing modes

### Tech Stack
- **Frontend:** React + Next.js + TailwindCSS + shadcn/ui
- **Backend:** Next.js API routes
- **Database:** Firebase (Firestore)
- **Authentication:** Firebase Auth
- **AI:** OpenAI GPT-4 API
- **File Storage:** Firebase Storage
- **Styling:** TailwindCSS + Framer Motion

## 🛠 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase account
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pitchpal
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory and add:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=PitchPal
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── create/            # Pitch creation wizard
│   ├── dashboard/         # User dashboard
│   ├── pitch/view/        # Pitch viewer
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── pitch/            # Pitch-specific components
├── lib/                  # Utility libraries
│   ├── firebase.ts       # Firebase configuration
│   ├── ai.ts            # OpenAI integration
│   └── utils.ts         # General utilities
└── types/               # TypeScript type definitions
    └── pitch.ts         # Pitch-related types
```

## 🎯 Usage

1. **Create a Pitch**: Navigate to `/create` and fill out the startup information form
2. **AI Generation**: The AI will generate a complete pitch deck with 10 slides and an executive summary
3. **View & Edit**: Review your generated pitch in the interactive viewer
4. **Export & Share**: Download as PDF/PPTX or share with trackable links

## 💰 Pricing Model (Planned)

- **Free Tier**: 1 pitch deck + summary, watermarked exports
- **Pro Tier ($9/mo)**: Unlimited decks, editable exports, collaboration
- **Startup Pack ($299 one-time)**: Custom branding, AI iterations, priority support

## 🗺 Roadmap

- ✅ V1: Core deck + summary generator
- 🔜 V2: Live pitch rehearsal mode with AI feedback
- 🔜 V3: Integrate market data from Crunchbase/API
- 🔜 V4: Chrome Extension: Highlight any idea → "Send to PitchPal"
- 🔜 V5: Community Templates + PitchPal Hall of Fame

## 🤖 GitHub Copilot Integration

This project is optimized for GitHub Copilot development. The repository includes VS Code configuration files that enhance the Copilot experience.

### Setup Instructions

1. **Install VS Code Extensions** (recommended extensions are configured in `.vscode/extensions.json`):
   - GitHub Copilot (`github.copilot`)
   - GitHub Copilot Chat (`github.copilot-chat`)
   - Prettier (`esbenp.prettier-vscode`)
   - ESLint (`ms-vscode.vscode-eslint`)
   - Tailwind CSS IntelliSense (`bradlc.vscode-tailwindcss`)

2. **GitHub Copilot Subscription**: Ensure you have an active GitHub Copilot subscription
   - Individual: $10/month or $100/year
   - Business: $19/user/month
   - Free for verified students, teachers, and maintainers of popular open source projects

3. **Authentication**: Sign in to GitHub Copilot in VS Code
   - Open VS Code
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
   - Type "GitHub Copilot: Sign In"
   - Follow the authentication flow

### Copilot Features Configured

- **Inline Suggestions**: Real-time code completion as you type
- **Chat Integration**: AI-powered coding assistance via chat
- **Context Awareness**: Optimized file exclusions for better suggestions
- **TypeScript/React Support**: Enhanced suggestions for Next.js development
- **Auto-imports**: Intelligent import suggestions
- **Code Comments**: Copilot understands project context through comments

### Usage Tips

- **Write descriptive comments** before functions to get better suggestions
- **Use meaningful variable names** to help Copilot understand context
- **Break down complex functions** into smaller, well-named pieces
- **Leverage Copilot Chat** for explaining code, generating tests, and debugging

### Files Configured

- `.vscode/settings.json` - Copilot and editor settings
- `.vscode/extensions.json` - Recommended extensions
- `.vscode/tasks.json` - Development tasks
- `.vscode/launch.json` - Debug configurations
- `.copilotignore` - Files excluded from Copilot context

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [OpenAI](https://openai.com/) for the powerful GPT-4 API
- [Firebase](https://firebase.google.com/) for backend services
- [TailwindCSS](https://tailwindcss.com/) for styling
- [GitHub Copilot](https://github.com/features/copilot) for AI-powered development assistance
