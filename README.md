# Split Billz

A modern web application for splitting bills and managing shared expenses with friends and family.

## Features

- **Create Bills**: Create detailed bills with multiple items and payment information
- **Assign Items**: Assign specific items to different users with flexible splitting options (equal, fixed amount, or percentage)
- **Accept/Reject/Reassign**: Users can accept, reject, or reassign items assigned to them
- **Real-time Updates**: Track bill status and activity in real-time
- **Payment Information**: Store and display bank details for easy payment
- **Activity Logs**: Complete audit trail of all bill activities

## Tech Stack

- **Frontend**: Next.js 15 with App Router
- **Authentication**: Clerk
- **Database**: Firebase Firestore
- **UI**: TailwindCSS + shadcn/ui
- **Forms**: React Hook Form + Zod validation
- **Notifications**: Sonner

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase project
- Clerk account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd split-billz
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory with the following variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin (for server-side operations)
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Clerk Webhook Secret (for user sync)
CLERK_WEBHOOK_SECRET=your_webhook_secret
```

4. Set up Firestore Security Rules:

Deploy the `firestore.rules` file to your Firebase project:

```bash
firebase deploy --only firestore:rules
```

5. Set up Clerk Webhook:

- Go to your Clerk Dashboard
- Navigate to Webhooks
- Create a new webhook endpoint: `https://your-domain.com/api/webhooks/clerk`
- Subscribe to: `user.created`, `user.updated`, `user.deleted`
- Copy the webhook signing secret to your `.env.local`

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
split-billz/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Authentication pages
│   │   ├── (dashboard)/       # Protected dashboard routes
│   │   ├── (landing)/         # Public landing page
│   │   └── api/               # API routes
│   ├── components/            # React components
│   │   ├── bills/            # Bill-specific components
│   │   ├── layout/           # Layout components
│   │   └── ui/               # shadcn/ui components
│   ├── lib/                  # Utility libraries
│   │   ├── firebase/         # Firebase configuration
│   │   ├── services/         # Business logic services
│   │   └── utils/            # Helper functions
│   └── types/                # TypeScript type definitions
├── public/                   # Static assets
├── firestore.rules          # Firestore security rules
└── package.json
```

## Usage

### Creating a Bill

1. Log in to your account
2. Click "Create Bill" from the dashboard or navigation
3. Fill in bill details (title, description, payment info)
4. Add items with names and amounts
5. Submit to create the bill

### Assigning Items

1. Open a bill you created
2. Click "Assign" on any item
3. Search for users by email or name
4. Select a user and choose split type:
   - Equal Split: Item cost divided equally among assignees
   - Fixed Amount: Specify exact amount
   - Percentage: Specify percentage of item cost
5. Click "Assign User"

### Managing Assignments

1. View bills where you're assigned items
2. For each assignment, you can:
   - **Accept**: Confirm your responsibility
   - **Reject**: Decline the assignment
   - Change status at any time

### Viewing Summary

- Bill detail page shows real-time summary
- Total amount and per-person breakdown
- Assignment status (pending/accepted/rejected)
- Payment information for settling up

## Firebase Firestore Structure

```
users/{userId}
  - email: string
  - name: string
  - imageUrl: string
  - createdAt: timestamp

bills/{billId}
  - creatorId: string
  - title: string
  - description: string
  - bankName: string
  - accountNumber: string
  - accountOwner: string
  - createdAt: timestamp
  
  bill_items/{itemId}
    - name: string
    - amount: number
    - createdAt: timestamp
    
    assignments/{assignmentId}
      - userId: string
      - status: 'pending' | 'accepted' | 'rejected'
      - portionType: 'equal' | 'amount' | 'percent'
      - portionValue: number | null
      - createdAt: timestamp
  
  activity_logs/{logId}
    - userId: string | null
    - action: string
    - metadata: object
    - createdAt: timestamp
```

## Security

- Authentication required for all protected routes
- Firestore security rules enforce data access control
- Bill creators have full control over their bills
- Assigned users can only update their own assignment status
- Activity logs are immutable

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For support, email support@splitbillz.com or open an issue in the repository.
