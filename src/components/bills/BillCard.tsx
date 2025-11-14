import Link from 'next/link';
import { Bill } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils/calculations';
import { format } from 'date-fns';
import { Timestamp } from 'firebase/firestore';

interface BillCardProps {
  bill: Bill;
  totalAmount?: number;
}

export function BillCard({ bill, totalAmount }: BillCardProps) {
  const createdAtDate =
    bill.createdAt instanceof Timestamp
      ? bill.createdAt.toDate()
      : bill.createdAt;

  return (
    <Link href={`/bills/${bill.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader>
          <CardTitle className="text-lg">{bill.title}</CardTitle>
          {bill.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {bill.description}
            </p>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {totalAmount !== undefined && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total:</span>
                <span className="font-semibold">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Bank:</span>
              <span className="text-sm font-medium">{bill.bankName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Created:</span>
              <span className="text-sm">
                {format(createdAtDate, 'MMM dd, yyyy')}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

