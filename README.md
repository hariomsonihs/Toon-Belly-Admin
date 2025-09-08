# 🔥 ToonBelly Admin Panel Setup Guide

## 📋 Setup Instructions

### 1. Firebase Configuration
1. Open `script.js` file
2. Replace the Firebase config with your project details:

```javascript
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com", 
    databaseURL: "https://your-project-default-rtdb.firebaseio.com/",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
};
```

### 2. Firebase Database Rules
Set these rules in Firebase Console → Database → Rules:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

### 3. Host the Admin Panel
**Option 1: Local Server**
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server

# Then open: http://localhost:8000
```

**Option 2: Firebase Hosting**
```bash
firebase init hosting
firebase deploy
```

## 🚀 Features

### ✅ Categories Management
- **Add Category**: ID, Name, Image URL, Active status
- **Edit Category**: Modify existing categories
- **Delete Category**: Remove categories
- **Toggle Status**: Enable/Disable categories

### ✅ Videos Management  
- **Add Video**: Title, YouTube ID, Category, Description, Views
- **Edit Video**: Modify existing videos
- **Delete Video**: Remove videos
- **Toggle Status**: Enable/Disable videos
- **Auto Thumbnail**: Generates from YouTube ID

### ✅ Real-time Updates
- **Live Dashboard**: Shows total counts
- **Instant Sync**: Changes reflect immediately in app
- **Status Indicators**: Active/Inactive badges

## 📱 How to Use

### Adding a Category:
1. Click "Categories" in sidebar
2. Click "Add Category" button
3. Fill form:
   - **Category ID**: `motu_patlu` (lowercase, underscore)
   - **Category Name**: `Motu Patlu`
   - **Image URL**: Direct image link
   - **Active**: Check to show in app
4. Click "Save"

### Adding a Video:
1. Click "Videos" in sidebar  
2. Click "Add Video" button
3. Fill form:
   - **Title**: Video title
   - **YouTube ID**: `JsGNdu1rMYE` (from YouTube URL)
   - **Category**: Select from dropdown
   - **Description**: Video description
   - **Views**: Initial view count
   - **Active**: Check to show in app
4. Click "Save"

### Managing Content:
- **Edit**: Click pencil icon
- **Delete**: Click trash icon  
- **Toggle**: Click eye icon to enable/disable
- **Status**: Green = Active, Red = Inactive

## 🔧 Troubleshooting

**Connection Issues:**
- Check Firebase config
- Verify database rules
- Check internet connection

**Videos Not Showing:**
- Ensure category is Active
- Ensure video is Active
- Check YouTube ID is correct

**Images Not Loading:**
- Use direct image URLs
- Ensure URLs are accessible
- Check CORS settings

## 📊 Database Structure

```json
{
  "categories": {
    "category_id": {
      "id": "category_id",
      "name": "Category Name",
      "imageUrl": "image_url",
      "folderPath": "categories/category_id", 
      "isActive": true
    }
  },
  "videos": {
    "category_id": {
      "video_id": {
        "id": 123,
        "title": "Video Title",
        "youtubeLink": "youtube_id",
        "thumbnailUrl": "auto_generated",
        "description": "Description",
        "category": "Category Name",
        "categoryId": "category_id",
        "views": 1000,
        "uploadDate": "2024-01-01",
        "isActive": true,
        "timestamp": 1704067200000
      }
    }
  }
}
```

## 🎯 Next Steps

1. **Setup Firebase** with your config
2. **Host admin panel** locally or online
3. **Add categories** first
4. **Add videos** to categories
5. **Test in app** - changes appear instantly!

**Admin Panel URL**: Open `index.html` in browser after setup
**App Updates**: Real-time, no restart needed! 🚀