# PitchPal Deployment Guide

## 🚀 Quick Start

PitchPal is now fully configured and ready for deployment! Here's how to get it running in production.

## 📋 Pre-Deployment Checklist

### ✅ Environment Configuration
- [ ] Firebase project created and configured
- [ ] OpenAI API key added (optional - demo mode available)
- [ ] All environment variables set in `.env.local`
- [ ] Setup verification completed at `/setup`

### ✅ Testing
- [ ] Authentication flow tested (sign up/login)
- [ ] Pitch creation wizard tested
- [ ] AI generation working (or demo mode active)
- [ ] PDF export functionality tested
- [ ] Dashboard and pitch viewer tested

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial PitchPal deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy automatically

3. **Environment Variables for Vercel**
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=y"AIzaSyDhr9l2t90iufbcoT4h1YeDCHEWjZxgrZs"
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="pitchpal-62be6.firebaseapp.com"
   NEXT_PUBLIC_FIREBASE_PROJECT_ID="pitchpal-62be6"
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="pitchpal-62be6.firebasestorage.app"
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="269472958398"
   NEXT_PUBLIC_FIREBASE_APP_ID="1:269472958398:web:cb1624587db5fbd4261bef"   OPENAI_API_KEY="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"
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   ```

### Option 2: Netlify

1. **Build Command**: `npm run build`
2. **Publish Directory**: `.next`
3. **Add environment variables in Netlify dashboard**

### Option 3: Self-Hosted

1. **Build the application**
   ```bash
   npm run build
   npm start
   ```

2. **Use PM2 for production**
   ```bash
   npm install -g pm2
   pm2 start npm --name "pitchpal" -- start
   ```

## 🔧 Production Configuration

### Firebase Security Rules

**Firestore Rules** (`firestore.rules`):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /ideas/{ideaId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    match /pitchDecks/{pitchId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    match /executiveSummaries/{summaryId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

**Storage Rules** (`storage.rules`):
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Performance Optimizations

1. **Enable Firebase App Check** for security
2. **Set up CDN** for static assets
3. **Configure caching headers**
4. **Enable compression** (gzip/brotli)

## 📊 Monitoring & Analytics

### Error Tracking
- Set up Sentry for error monitoring
- Configure Firebase Crashlytics

### Analytics
- Google Analytics 4
- Firebase Analytics
- Custom event tracking for pitch creation

### Performance Monitoring
- Vercel Analytics
- Firebase Performance Monitoring
- Core Web Vitals tracking

## 🔒 Security Considerations

### API Security
- Rate limiting on API routes
- Input validation and sanitization
- CORS configuration
- API key rotation strategy

### Authentication
- Enable MFA for admin accounts
- Configure session timeouts
- Implement proper logout flows

### Data Protection
- GDPR compliance measures
- Data retention policies
- User data export/deletion

## 🚀 Post-Deployment Steps

1. **Test all functionality** in production
2. **Set up monitoring** and alerts
3. **Configure backup** strategies
4. **Document** any custom configurations
5. **Set up CI/CD** pipeline for future updates

## 📈 Scaling Considerations

### Database
- Monitor Firestore usage and costs
- Implement data archiving for old pitches
- Consider read replicas for high traffic

### API Limits
- Monitor OpenAI API usage
- Implement request queuing for high volume
- Consider caching for repeated requests

### Infrastructure
- Auto-scaling configuration
- Load balancing setup
- CDN optimization

## 🆘 Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**
   - Verify all variables are set correctly
   - Check for typos in variable names
   - Restart the application after changes

2. **Firebase Connection Issues**
   - Verify Firebase project configuration
   - Check security rules
   - Ensure proper authentication setup

3. **OpenAI API Errors**
   - Verify API key is valid
   - Check rate limits and quotas
   - Monitor usage and billing

### Debug Mode
Visit `/setup` to verify configuration and troubleshoot issues.

## 📞 Support

For deployment issues or questions:
- Check the setup page at `/setup`
- Review Firebase console for errors
- Monitor Vercel/Netlify deployment logs
- Check browser console for client-side errors

---

**🎉 Congratulations! PitchPal is ready for production!**

Your AI-powered startup pitch generator is now live and ready to help entrepreneurs create investor-ready presentations.
