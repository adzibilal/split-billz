'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Search } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { PortionType, User } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface PageProps {
  params: Promise<{
    billId: string;
    itemId: string;
  }>;
}

export default function AssignItemPage({ params }: PageProps) {
  const router = useRouter();
  const { user } = useUser();
  const [billId, setBillId] = useState<string>('');
  const [itemId, setItemId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [portionType, setPortionType] = useState<PortionType>(
    PortionType.EQUAL
  );
  const [portionValue, setPortionValue] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    params.then(({ billId: bid, itemId: iid }) => {
      setBillId(bid);
      setItemId(iid);
    });
  }, [params]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `/api/users/search?q=${encodeURIComponent(searchQuery)}`
      );
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error('Error searching users:', error);
      toast.error('Failed to search users');
    } finally {
      setIsSearching(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedUserId) {
      toast.error('Please select a user');
      return;
    }

    if (
      portionType !== PortionType.EQUAL &&
      (!portionValue || portionValue <= 0)
    ) {
      toast.error('Please enter a valid portion value');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/bills/${billId}/items/${itemId}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: selectedUserId,
          portionType,
          portionValue: portionType === PortionType.EQUAL ? null : portionValue,
        }),
      });

      if (!response.ok) throw new Error('Failed to assign');

      toast.success('User assigned successfully!');
      router.push(`/bills/${billId}`);
    } catch (error) {
      console.error('Error assigning user:', error);
      toast.error('Failed to assign user');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 max-w-2xl">
      <div className="mb-6">
        <Link href={`/bills/${billId}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Bill
          </Button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">Assign Item</h1>

      <div className="space-y-6">
        {/* Search Users */}
        <Card>
          <CardHeader>
            <CardTitle>Search User</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Search by email or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch} disabled={isSearching}>
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {users.length > 0 && (
              <div className="space-y-2">
                <Label>Select User:</Label>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {users.map((searchUser) => (
                    <div
                      key={searchUser.id}
                      className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-accent ${
                        selectedUserId === searchUser.id ? 'bg-accent' : ''
                      }`}
                      onClick={() => setSelectedUserId(searchUser.id)}
                    >
                      <Avatar>
                        <AvatarImage src={searchUser.imageUrl} />
                        <AvatarFallback>
                          {searchUser.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{searchUser.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {searchUser.email}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Portion Settings */}
        {selectedUserId && (
          <Card>
            <CardHeader>
              <CardTitle>Portion Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Portion Type</Label>
                <Select
                  value={portionType}
                  onValueChange={(value) => setPortionType(value as PortionType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={PortionType.EQUAL}>
                      Equal Split
                    </SelectItem>
                    <SelectItem value={PortionType.AMOUNT}>
                      Fixed Amount
                    </SelectItem>
                    <SelectItem value={PortionType.PERCENT}>
                      Percentage
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {portionType !== PortionType.EQUAL && (
                <div className="space-y-2">
                  <Label>
                    {portionType === PortionType.AMOUNT
                      ? 'Amount'
                      : 'Percentage'}
                  </Label>
                  <Input
                    type="number"
                    value={portionValue}
                    onChange={(e) =>
                      setPortionValue(parseFloat(e.target.value))
                    }
                    placeholder={
                      portionType === PortionType.AMOUNT ? '0' : '0-100'
                    }
                  />
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex gap-4 justify-end">
          <Button
            variant="outline"
            onClick={() => router.push(`/bills/${billId}`)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={!selectedUserId || isSubmitting}
          >
            {isSubmitting ? 'Assigning...' : 'Assign User'}
          </Button>
        </div>
      </div>
    </div>
  );
}

