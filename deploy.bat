@echo off
echo Installing Firebase CLI...
npm install -g firebase-tools

echo Logging into Firebase...
firebase login

echo Initializing Firebase Hosting...
firebase init hosting

echo Deploying to Firebase...
firebase deploy

echo Admin Panel deployed successfully!
echo Access URL will be shown above
pause