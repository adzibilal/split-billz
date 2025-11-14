# SplitBillz - Setup Guide

This guide will help you set up and run the SplitBillz application.

## Prerequisites

Before you begin, make sure you have:

1. Node.js 18+ installed
2. A Firebase project
3. A Clerk account

## Step 1: Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Firestore Database:
   - Go to Firestore Database
   - Create database in production mode
   - Choose a location
4. Get your Firebase configuration:
   - Go to Project Settings > General
   - Scroll to "Your apps" section
   - Click on Web app (or add one if none exists)
   - Copy the configuration values
5. Create a service account for Firebase Admin:
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Save the JSON file securely
   - You'll need to convert this to a single-line string for the `.env.local` file

## Step 2: Clerk Setup

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application or select an existing one
3. Enable email/password and OAuth providers:
   - Go to User & Authentication > Email, Phone, Username
   - Enable Email
   - Enable Google OAuth (optional)
4. Get your API keys:
   - Go to API Keys
   - Copy the "Publishable key" and "Secret key"
5. Set up webhook for user synchronization:
   - Go to Webhooks
   - Click "Add Endpoint"
   - Enter your webhook URL: `https://your-domain.com/api/webhooks/clerk`
   - Subscribe to events: `user.created`, `user.updated`, `user.deleted`
   - Copy the "Signing Secret"

## Step 3: Environment Variables

Create a `.env.local` file in the root directory:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123:web:abc...

# Firebase Admin (Service Account Key as single-line JSON string)
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"..."}

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Clerk Webhook Secret
CLERK_WEBHOOK_SECRET=whsec_...
```

## Step 4: Deploy Firestore Security Rules

1. Install Firebase CLI if you haven't:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase in your project (if not already done):
```bash
firebase init firestore
```

4. Deploy the security rules:
```bash
firebase deploy --only firestore:rules
```

## Step 5: Install Dependencies and Run

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Step 6: Testing the Application

1. **Sign Up**: Create a new account using the sign-up page
2. **Create a Bill**: 
   - Go to Dashboard
   - Click "Create Bill"
   - Fill in bill details and add items
   - Submit
3. **Assign Items**:
   - Open the created bill
   - Click "Assign" on any item
   - Search for a user (you'll need at least 2 accounts to test)
   - Assign the item
4. **Accept/Reject**:
   - Log in with the assigned user's account
   - View the bill
   - Accept or reject the assignment
5. **View Summary**:
   - Check the bill summary on the right sidebar
   - See the total amount and per-person breakdown

## Troubleshooting

### Firebase Connection Issues

- Make sure all Firebase environment variables are correct
- Check that Firestore is enabled in your Firebase project
- Verify security rules are deployed

### Clerk Authentication Issues

- Verify Clerk environment variables are correct
- Check that the webhook endpoint is publicly accessible
- Make sure webhook signing secret matches

### User Sync Issues

If users aren't syncing to Firestore:
- Check the webhook is configured correctly in Clerk
- Verify the webhook URL is correct and accessible
- Check browser console and server logs for errors

### Build Errors

If you encounter build errors:
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run dev
```

## Production Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add all environment variables in Vercel dashboard
4. Deploy
5. Update Clerk webhook URL to your production domain

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- DigitalOcean App Platform
- Railway
- Render

Make sure to:
1. Set all environment variables
2. Update Clerk webhook URL
3. Configure build settings (build command: `npm run build`, output directory: `.next`)

## Next Steps

Now that your app is running, you can:

1. Customize the styling and branding
2. Add more features from the V2 roadmap:
   - Real-time notifications
   - File upload for receipts
   - Export to PDF
   - Payment proof upload
   - Split calculations (percentage/ratio)
3. Set up monitoring and analytics
4. Configure custom domain
5. Add email notifications

## Support

If you encounter any issues:
1. Check the console logs for errors
2. Review the README.md for project structure
3. Check Firebase and Clerk documentation
4. Review the firestore.rules file for security configuration

Happy bill splitting! 🎉

