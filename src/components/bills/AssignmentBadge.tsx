import { AssignmentStatus } from '@/types';
import { Badge } from '@/components/ui/badge';

interface AssignmentBadgeProps {
  status: AssignmentStatus;
}

export function AssignmentBadge({ status }: AssignmentBadgeProps) {
  const variants = {
    [AssignmentStatus.PENDING]: 'pending',
    [AssignmentStatus.ACCEPTED]: 'success',
    [AssignmentStatus.REJECTED]: 'destructive',
  } as const;

  return (
    <Badge variant={variants[status]}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

