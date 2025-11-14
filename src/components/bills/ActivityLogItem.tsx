import { ActivityLogWithUser } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { Timestamp } from 'firebase/firestore';

interface ActivityLogItemProps {
  activity: ActivityLogWithUser;
}

export function ActivityLogItem({ activity }: ActivityLogItemProps) {
  const createdAtDate =
    activity.createdAt instanceof Timestamp
      ? activity.createdAt.toDate()
      : activity.createdAt;

  return (
    <div className="flex gap-3">
      <Avatar className="h-8 w-8">
        {activity.user && (
          <>
            <AvatarImage src={activity.user.imageUrl} />
            <AvatarFallback>
              {activity.user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </>
        )}
        {!activity.user && <AvatarFallback>?</AvatarFallback>}
      </Avatar>
      <div className="flex-1">
        <p className="text-sm">
          <span className="font-medium">
            {activity.user?.name || 'System'}
          </span>{' '}
          {activity.action}
        </p>
        <p className="text-xs text-muted-foreground">
          {format(createdAtDate, 'MMM dd, yyyy HH:mm')}
        </p>
      </div>
    </div>
  );
}

