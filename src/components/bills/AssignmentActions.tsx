'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, X, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { AssignmentStatus } from '@/types';

interface AssignmentActionsProps {
  billId: string;
  itemId: string;
  assignmentId: string;
  currentStatus: AssignmentStatus;
  onUpdate: () => void;
}

export function AssignmentActions({
  billId,
  itemId,
  assignmentId,
  currentStatus,
  onUpdate,
}: AssignmentActionsProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusUpdate = async (newStatus: AssignmentStatus) => {
    setIsUpdating(true);
    try {
      const response = await fetch(
        `/api/bills/${billId}/items/${itemId}/assignments/${assignmentId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) throw new Error('Failed to update status');

      toast.success(`Assignment ${newStatus}!`);
      onUpdate();
    } catch (error) {
      console.error('Error updating assignment:', error);
      toast.error('Failed to update assignment');
    } finally {
      setIsUpdating(false);
    }
  };

  if (currentStatus === AssignmentStatus.ACCEPTED) {
    return (
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="destructive"
          onClick={() => handleStatusUpdate(AssignmentStatus.REJECTED)}
          disabled={isUpdating}
        >
          <X className="mr-2 h-4 w-4" />
          Reject
        </Button>
      </div>
    );
  }

  if (currentStatus === AssignmentStatus.REJECTED) {
    return (
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={() => handleStatusUpdate(AssignmentStatus.ACCEPTED)}
          disabled={isUpdating}
        >
          <Check className="mr-2 h-4 w-4" />
          Accept
        </Button>
      </div>
    );
  }

  // Pending status
  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        onClick={() => handleStatusUpdate(AssignmentStatus.ACCEPTED)}
        disabled={isUpdating}
      >
        <Check className="mr-2 h-4 w-4" />
        Accept
      </Button>
      <Button
        size="sm"
        variant="destructive"
        onClick={() => handleStatusUpdate(AssignmentStatus.REJECTED)}
        disabled={isUpdating}
      >
        <X className="mr-2 h-4 w-4" />
        Reject
      </Button>
    </div>
  );
}

