import { auth } from '@clerk/nextjs/server';
import { redirect, notFound } from 'next/navigation';
import {
  getBill,
  getBillItems,
} from '@/lib/services/bills.service';
import { getItemAssignmentsWithUsers } from '@/lib/services/assignments.service';
import { getBillActivitiesWithUsers } from '@/lib/services/activity.service';
import { getUserById, getUsersByIds } from '@/lib/services/users.service';
import { calculateBillSummary } from '@/lib/utils/calculations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BillSummary } from '@/components/bills/BillSummary';
import { ActivityLogItem } from '@/components/bills/ActivityLogItem';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Assignment, AssignmentWithUser } from '@/types';
import { BillItemsClient } from '@/components/bills/BillItemsClient';
import { Timestamp } from 'firebase/firestore';

// Helper function to convert Firestore Timestamps to plain objects
function serializeTimestamp(date: Date | Timestamp): Date {
  if (date instanceof Timestamp) {
    return date.toDate();
  }
  return date;
}

export default async function BillDetailPage({
  params,
}: {
  params: Promise<{ billId: string }>;
}) {
  const { userId } = await auth();
  const { billId } = await params;

  if (!userId) {
    redirect('/sign-in');
  }

  const bill = await getBill(billId);

  if (!bill) {
    notFound();
  }

  const items = await getBillItems(billId);
  const creator = await getUserById(bill.creatorId);
  
  // Get assignments for all items
  const assignmentsMap = new Map<string, AssignmentWithUser[]>();
  for (const item of items) {
    const assignments = await getItemAssignmentsWithUsers(billId, item.id);
    assignmentsMap.set(item.id, assignments);
  }

  // Calculate summary
  const summary = calculateBillSummary(items, assignmentsMap as Map<string, Assignment[]>);
  
  // Get user names for summary
  const userIds = [...new Set(summary.userAmounts.map(u => u.userId))];
  const users = await getUsersByIds(userIds);
  const userMap = new Map(users.map(u => [u.id, u]));
  
  summary.userAmounts.forEach(ua => {
    const user = userMap.get(ua.userId);
    if (user) {
      ua.userName = user.name;
    }
  });

  // Get activities
  const activities = await getBillActivitiesWithUsers(billId);

  const isCreator = bill.creatorId === userId;

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 max-w-7xl">
      <div className="mb-6">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bill Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{bill.title}</CardTitle>
                  {bill.description && (
                    <p className="text-muted-foreground mt-2">
                      {bill.description}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground mt-2">
                    Created by {creator?.name || 'Unknown'}
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Items List */}
          <BillItemsClient
            billId={billId}
            items={items.map(item => ({
              ...item,
              createdAt: serializeTimestamp(item.createdAt),
              assignments: (assignmentsMap.get(item.id) || []).map(assignment => ({
                ...assignment,
                createdAt: serializeTimestamp(assignment.createdAt),
                user: {
                  ...assignment.user,
                  createdAt: serializeTimestamp(assignment.user.createdAt),
                }
              }))
            }))}
            isCreator={isCreator}
            currentUserId={userId}
          />

          {/* Activity Log */}
          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activities.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  No activity yet
                </p>
              ) : (
                activities.map((activity) => (
                  <ActivityLogItem key={activity.id} activity={activity} />
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Summary */}
        <div className="lg:col-span-1">
          <BillSummary
            summary={summary}
            bankName={bill.bankName}
            accountNumber={bill.accountNumber}
            accountOwner={bill.accountOwner}
          />
        </div>
      </div>
    </div>
  );
}

