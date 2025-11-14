import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getUserBills, getBillItems } from '@/lib/services/bills.service';
import { BillCard } from '@/components/bills/BillCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

// Helper function to convert Firestore Timestamps to plain objects
function serializeTimestamp(date: Date | Timestamp): Date {
  if (date instanceof Timestamp) {
    return date.toDate();
  }
  return date;
}

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const bills = await getUserBills(userId);
  
  // Get total amount for each bill
  const billsWithTotals = await Promise.all(
    bills.map(async (bill) => {
      const items = await getBillItems(bill.id);
      const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
      return { 
        bill: {
          ...bill,
          createdAt: serializeTimestamp(bill.createdAt)
        }, 
        totalAmount 
      };
    })
  );

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your bills and expenses
          </p>
        </div>
        <Link href="/bills/create">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Bill
          </Button>
        </Link>
      </div>

      {billsWithTotals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 text-6xl">📋</div>
          <h2 className="text-2xl font-semibold mb-2">No bills yet</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Start by creating your first bill to split expenses with friends and
            family.
          </p>
          <Link href="/bills/create">
            <Button size="lg">
              <PlusCircle className="mr-2 h-5 w-5" />
              Create Your First Bill
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {billsWithTotals.map(({ bill, totalAmount }) => (
            <BillCard key={bill.id} bill={bill} totalAmount={totalAmount} />
          ))}
        </div>
      )}
    </div>
  );
}

