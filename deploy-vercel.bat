@echo off
echo Installing Vercel CLI...
npm install -g vercel

echo Deploying to Vercel...
vercel --prod

echo.
echo Admin Panel deployed successfully!
echo Your admin panel URL will be shown above
echo Example: https://toonbelly-admin.vercel.app
pause