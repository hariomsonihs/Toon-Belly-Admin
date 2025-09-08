# Firebase Setup Guide

## 1. Get Firebase Config
1. Firebase Console me jao
2. Project Settings (gear icon) click karo
3. "General" tab me scroll down karo
4. "Your apps" section me "Web app" add karo
5. App nickname: "ToonBelly-Admin"
6. Firebase config copy karo

## 2. Replace Config in script.js
```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

## 3. Database Rules (Security)
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

## 4. Admin Panel Access URLs
- **Local**: http://localhost:8000
- **Firebase Hosting**: https://YOUR_PROJECT.web.app
- **GitHub Pages**: https://username.github.io/repository

## 5. Real-time Updates Flow
Admin Panel → Firebase → Android App (Instant)