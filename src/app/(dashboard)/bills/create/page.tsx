'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const billFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string(),
  bankName: z.string().min(1, 'Bank name is required'),
  accountNumber: z.string().min(1, 'Account number is required'),
  accountOwner: z.string().min(1, 'Account owner is required'),
  items: z
    .array(
      z.object({
        name: z.string().min(1, 'Item name is required'),
        amount: z.number().positive('Amount must be positive'),
      })
    )
    .min(1, 'At least one item is required'),
});

type BillFormData = z.infer<typeof billFormSchema>;

export default function CreateBillPage() {
  const router = useRouter();
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<BillFormData>({
    resolver: zodResolver(billFormSchema),
    defaultValues: {
      title: '',
      description: '',
      bankName: '',
      accountNumber: '',
      accountOwner: '',
      items: [{ name: '', amount: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const onSubmit = async (data: BillFormData) => {
    if (!user) {
      toast.error('You must be logged in to create a bill');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/bills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create bill');
      }

      const result = await response.json();
      toast.success('Bill created successfully!');
      router.push(`/bills/${result.billId}`);
    } catch (error) {
      console.error('Error creating bill:', error);
      toast.error('Failed to create bill. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Create New Bill</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Bill Information */}
        <Card>
          <CardHeader>
            <CardTitle>Bill Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Team Lunch, Office Supplies"
                {...register('title')}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Optional description..."
                {...register('description')}
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Payment Information */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name *</Label>
              <Input
                id="bankName"
                placeholder="e.g., BCA, Mandiri"
                {...register('bankName')}
              />
              {errors.bankName && (
                <p className="text-sm text-red-500">
                  {errors.bankName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number *</Label>
              <Input
                id="accountNumber"
                placeholder="e.g., 1234567890"
                {...register('accountNumber')}
              />
              {errors.accountNumber && (
                <p className="text-sm text-red-500">
                  {errors.accountNumber.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountOwner">Account Owner *</Label>
              <Input
                id="accountOwner"
                placeholder="Name of account owner"
                {...register('accountOwner')}
              />
              {errors.accountOwner && (
                <p className="text-sm text-red-500">
                  {errors.accountOwner.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Items */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Items *</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ name: '', amount: 0 })}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-4 items-start">
                <div className="flex-1 space-y-2">
                  <Label htmlFor={`items.${index}.name`}>Item Name</Label>
                  <Input
                    id={`items.${index}.name`}
                    placeholder="e.g., Coffee, Sandwich"
                    {...register(`items.${index}.name`)}
                  />
                  {errors.items?.[index]?.name && (
                    <p className="text-sm text-red-500">
                      {errors.items[index]?.name?.message}
                    </p>
                  )}
                </div>

                <div className="w-32 space-y-2">
                  <Label htmlFor={`items.${index}.amount`}>Amount</Label>
                  <Input
                    id={`items.${index}.amount`}
                    type="number"
                    placeholder="0"
                    {...register(`items.${index}.amount`, { valueAsNumber: true })}
                  />
                  {errors.items?.[index]?.amount && (
                    <p className="text-sm text-red-500">
                      {errors.items[index]?.amount?.message}
                    </p>
                  )}
                </div>

                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="mt-8"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}

            {errors.items?.root && (
              <p className="text-sm text-red-500">
                {errors.items.root.message}
              </p>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Bill'}
          </Button>
        </div>
      </form>
    </div>
  );
}

