import { BillSummary as BillSummaryType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils/calculations';
import { AssignmentBadge } from './AssignmentBadge';

interface BillSummaryProps {
  summary: BillSummaryType;
  bankName: string;
  accountNumber: string;
  accountOwner: string;
}

export function BillSummary({
  summary,
  bankName,
  accountNumber,
  accountOwner,
}: BillSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Total Amount */}
        <div className="flex justify-between items-center text-lg font-bold">
          <span>Total Amount:</span>
          <span>{formatCurrency(summary.totalAmount)}</span>
        </div>

        <Separator />

        {/* Per Person Breakdown */}
        <div className="space-y-3">
          <h4 className="font-semibold">Per Person:</h4>
          {summary.userAmounts.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No assignments yet
            </p>
          ) : (
            summary.userAmounts.map((userAmount) => (
              <div
                key={userAmount.userId}
                className="flex justify-between items-center"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{userAmount.userName || 'Unknown'}</span>
                  <AssignmentBadge status={userAmount.status} />
                </div>
                <span className="font-medium">
                  {formatCurrency(userAmount.amount)}
                </span>
              </div>
            ))
          )}
        </div>

        <Separator />

        {/* Payment Information */}
        <div className="space-y-2">
          <h4 className="font-semibold">Payment Information:</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Bank:</span>
              <span className="font-medium">{bankName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Account:</span>
              <span className="font-medium">{accountNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Owner:</span>
              <span className="font-medium">{accountOwner}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Status Counts */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="space-y-1">
            <p className="text-2xl font-bold">{summary.pendingCount}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-green-600">
              {summary.acceptedCount}
            </p>
            <p className="text-xs text-muted-foreground">Accepted</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-red-600">
              {summary.rejectedCount}
            </p>
            <p className="text-xs text-muted-foreground">Rejected</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

