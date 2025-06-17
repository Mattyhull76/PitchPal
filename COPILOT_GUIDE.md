# GitHub Copilot Development Guide for PitchPal

This guide helps you maximize GitHub Copilot's effectiveness when working on the PitchPal project.

## 🚀 Quick Start

1. **Install Required Extensions** (VS Code will prompt you automatically):
   - GitHub Copilot
   - GitHub Copilot Chat
   - Prettier
   - ESLint
   - Tailwind CSS IntelliSense

2. **Sign in to GitHub Copilot**:
   - Press `Ctrl+Shift+P` → "GitHub Copilot: Sign In"
   - Follow authentication flow

3. **Verify Setup**:
   - Open any `.tsx` file
   - Start typing a function - you should see inline suggestions
   - Press `Ctrl+I` to open Copilot Chat

## 💡 Best Practices for PitchPal Development

### Writing Effective Comments

```typescript
// Generate a professional pitch deck slide with AI-powered content
// Takes startup data and slide type, returns formatted slide content
async function generateSlide(startupData: StartupData, slideType: SlideType) {
  // Copilot will suggest implementation based on this context
}
```

### Component Development

```typescript
// React component for displaying pitch deck slides with animations
// Supports PDF export and interactive presentation mode
interface PitchSlideProps {
  slide: SlideData;
  isPresenting: boolean;
  onNext: () => void;
}

export function PitchSlide({ slide, isPresenting, onNext }: PitchSlideProps) {
  // Copilot will suggest component implementation
}
```

### API Route Development

```typescript
// API endpoint for generating pitch deck content using OpenAI
// POST /api/generate-pitch
// Body: { companyName, industry, description, targetAudience }
export async function POST(request: Request) {
  // Copilot will suggest OpenAI integration
}
```

## 🎯 Project-Specific Copilot Tips

### 1. Leverage Project Context

Copilot understands your project structure. When working on:

- **Components**: Reference existing UI components in `src/components/ui/`
- **API Routes**: Follow patterns from existing routes in `src/app/api/`
- **Types**: Use types defined in `src/types/pitch.ts`
- **Utilities**: Extend functions in `src/lib/utils.ts`

### 2. AI Integration Patterns

When working with OpenAI integration:

```typescript
// Copilot knows about your OpenAI setup and will suggest appropriate patterns
import { openai } from '@/lib/ai';

// Generate pitch deck content for [specific slide type]
// Use company context and industry best practices
async function generatePitchContent(prompt: string) {
  // Copilot will suggest OpenAI API calls
}
```

### 3. Firebase Integration

```typescript
// Copilot understands your Firebase setup
import { db } from '@/lib/firebase';

// Save pitch deck to Firestore with user authentication
// Include metadata for sharing and analytics
async function savePitchDeck(pitchData: PitchDeck, userId: string) {
  // Copilot will suggest Firestore operations
}
```

### 4. React Hook Form Patterns

```typescript
// Copilot knows your form validation patterns
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Form for collecting startup information
// Validate using Zod schema and handle submission
function StartupInfoForm() {
  // Copilot will suggest form setup
}
```

## 🔧 Copilot Chat Commands

Use these commands in Copilot Chat for PitchPal development:

### Code Generation
- `/explain` - Explain complex AI or Firebase code
- `/fix` - Fix TypeScript or React errors
- `/optimize` - Optimize performance for large pitch decks
- `/tests` - Generate tests for components or utilities

### Project-Specific Prompts
- "Create a new slide component for [slide type]"
- "Add error handling for OpenAI API calls"
- "Generate TypeScript types for [feature]"
- "Create a Firebase security rule for pitch decks"
- "Add responsive design for mobile pitch viewing"

## 📁 File Patterns Copilot Recognizes

### Component Files
```
src/components/pitch/SlideEditor.tsx
src/components/ui/Button.tsx
src/components/forms/StartupForm.tsx
```

### API Routes
```
src/app/api/generate-pitch/route.ts
src/app/api/save-pitch/route.ts
src/app/api/export-pdf/route.ts
```

### Utility Files
```
src/lib/ai.ts          // OpenAI integration
src/lib/firebase.ts    // Firebase config
src/lib/utils.ts       // General utilities
src/lib/pdf-export.ts  // PDF generation
```

## 🚫 What Copilot Ignores

The `.copilotignore` file excludes:
- `node_modules/` - Dependencies
- `.next/` - Build files
- `.env*` - Environment variables
- Large media files
- Generated documentation

## 🐛 Troubleshooting

### Copilot Not Working?
1. Check VS Code status bar for Copilot icon
2. Verify GitHub authentication: `Ctrl+Shift+P` → "GitHub Copilot: Check Status"
3. Restart VS Code if suggestions stop appearing

### Poor Suggestions?
1. Add more descriptive comments
2. Use consistent naming conventions
3. Break large functions into smaller ones
4. Ensure TypeScript types are properly defined

### Context Issues?
1. Open related files in VS Code tabs
2. Use meaningful variable and function names
3. Add JSDoc comments for complex functions

## 📚 Learning Resources

- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
- [VS Code Copilot Extension](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot)
- [Copilot Best Practices](https://github.blog/2023-06-20-how-to-write-better-prompts-for-github-copilot/)

## 🎉 Happy Coding!

With these configurations and practices, GitHub Copilot will significantly accelerate your PitchPal development workflow. The AI assistant understands your project context and will provide relevant suggestions for React, Next.js, TypeScript, Firebase, and OpenAI integration.
