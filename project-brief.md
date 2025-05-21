Project Brief: Split Billz

Overview:
Split Billz is a modern web application built with Next.js, Prisma, MongoDB, and NextAuth that simplifies the process of splitting shared expenses among users. The app provides a seamless experience for uploading receipts, detailing expense items, assigning them to specific participants, and managing payments with user-friendly controls to view, reject, or pay expenses.

Technology Stack:

- Next.js: React framework for Server-Side Rendering (SSR), API routes, and frontend.
- Prisma: ORM for type-safe database access and schema management.
- MongoDB: NoSQL database for flexible storage of bills, users, and transactions.
- NextAuth: Authentication library using Google OAuth provider for secure user login.

Key Features:

- Upload Expense Receipts: Users can upload expense records, including photo evidence like receipts or invoices.
- Detailed Item Input: Specify individual items within the expense, their prices, and assign them to users involved.
- User Assignment: Split bills by associating each item or part of the bill to different users.
- Expense Review: Assigned users can view detailed expense breakdowns.
- Payment Workflow: Assigned users have the ability to accept and pay their share or reject charges if needed.
- Google-based Authentication: Secure sign-in using Google account credentials with NextAuth.

User Flow:

1. A user uploads a new expense, attaching receipt images as proof.
2. The user inputs detailed items related to the expense and assigns each item to one or more users responsible for payment.
3. Assigned users receive notification or can view their expense dashboard.
4. Users review assigned expenses, check details and receipts.
5. Users choose to pay or reject their portion of the bill.
6. Payment statuses and records are updated in the system for tracking.

Roles and Permissions:

- Expense Uploaders: Create expenses, upload receipts, and assign items.
- Assigned Users: View their assigned expense items, accept/pay or reject charges.
- Admin (optional): Manage users, oversee transactions and system data integrity.

This architecture ensures a clear separation of concerns while providing an intuitive, responsive UI and robust backend to track shared expenses efficiently.