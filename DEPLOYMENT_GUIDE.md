# 🚀 PitchPal Deployment Guide

Deploy your AI-powered pitch deck generator to production.

## Quick Deploy to Vercel (Recommended)

### 1. Push to GitHub
Your code is ready! Just push to GitHub:

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Deploy with Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Import your PitchPal repository
4. Add environment variables (see below)
5. Deploy!

### 3. Environment Variables
Add these in Vercel dashboard:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
GOOGLE_AI_API_KEY=your_google_ai_key
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

## Alternative: Deploy to Netlify

1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Add same environment variables

## Post-Deployment

### Configure Firebase
1. Go to Firebase Console
2. Add your production domain to authorized domains
3. Update security rules if needed

### Get Google AI Key (Optional)
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create API key
3. Add to environment variables

## Features Ready for Production

✅ **5 Beautiful Themes** - Purple, Blue, Orange, Green, Dark  
✅ **AI-Powered Content** - Google Gemini integration  
✅ **User Authentication** - Firebase Auth  
✅ **Pitch Creation** - Step-by-step wizard  
✅ **PDF Export** - Professional presentations  
✅ **Responsive Design** - Works on all devices  
✅ **Demo Mode** - Works without API keys  

## Support

- Visit `/setup` page to check configuration
- Check Firebase Console for auth issues
- Monitor Vercel deployment logs

**🎉 Your PitchPal app will be live in minutes!**
