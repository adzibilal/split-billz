'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AssignmentBadge } from './AssignmentBadge';
import { AssignmentActions } from './AssignmentActions';
import { formatCurrency } from '@/lib/utils/calculations';
import { UserPlus, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { BillItem, AssignmentWithUser } from '@/types';

interface BillItemsClientProps {
  billId: string;
  items: (BillItem & { assignments: AssignmentWithUser[] })[];
  isCreator: boolean;
  currentUserId: string;
}

export function BillItemsClient({
  billId,
  items,
  isCreator,
  currentUserId,
}: BillItemsClientProps) {
  const router = useRouter();

  const handleUpdate = () => {
    router.refresh();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Items</CardTitle>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => router.refresh()}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => {
          return (
            <div
              key={item.id}
              className="border rounded-lg p-4 space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">{item.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(item.amount)}
                  </p>
                </div>
                {isCreator && (
                  <Link href={`/bills/${billId}/items/${item.id}/assign`}>
                    <Button size="sm" variant="outline">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Assign
                    </Button>
                  </Link>
                )}
              </div>

              {item.assignments.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Assigned to:</p>
                  {item.assignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{assignment.user.name}</span>
                        <AssignmentBadge status={assignment.status} />
                      </div>
                      {assignment.userId === currentUserId && (
                        <AssignmentActions
                          billId={billId}
                          itemId={item.id}
                          assignmentId={assignment.id}
                          currentStatus={assignment.status}
                          onUpdate={handleUpdate}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {items.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            No items in this bill
          </p>
        )}
      </CardContent>
    </Card>
  );
}

