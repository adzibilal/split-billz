import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getUserBills, getBillItems } from '@/lib/services/bills.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils/calculations';

export default async function ProfilePage() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    redirect('/sign-in');
  }

  // Get user's bills
  const bills = await getUserBills(userId);

  // Calculate statistics
  let totalBillsCreated = bills.length;
  let totalAmountCreated = 0;

  for (const bill of bills) {
    const items = await getBillItems(bill.id);
    totalAmountCreated += items.reduce((sum, item) => sum + item.amount, 0);
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>

      <div className="space-y-6">
        {/* User Information */}
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.imageUrl} />
                <AvatarFallback className="text-2xl">
                  {user.firstName?.charAt(0) || user.emailAddresses[0]?.emailAddress.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-muted-foreground">
                  {user.emailAddresses[0]?.emailAddress}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Bills Created
                </p>
                <p className="text-3xl font-bold">{totalBillsCreated}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Total Amount Created
                </p>
                <p className="text-3xl font-bold">
                  {formatCurrency(totalAmountCreated)}
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-semibold">Account Details</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">User ID:</span>
                  <span className="font-mono">{userId.slice(0, 12)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Member Since:</span>
                  <span>
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Bills</CardTitle>
          </CardHeader>
          <CardContent>
            {bills.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No bills created yet
              </p>
            ) : (
              <div className="space-y-2">
                {bills.slice(0, 5).map((bill) => (
                  <div
                    key={bill.id}
                    className="flex justify-between items-center py-2"
                  >
                    <div>
                      <p className="font-medium">{bill.title}</p>
                      {bill.description && (
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {bill.description}
                        </p>
                      )}
                    </div>
                    <a
                      href={`/bills/${bill.id}`}
                      className="text-sm text-primary hover:underline"
                    >
                      View
                    </a>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

