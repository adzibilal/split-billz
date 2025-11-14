import { ActivityLog, ActivityLogWithUser } from '@/types';
import {
  COLLECTIONS,
  createSubDocument,
  querySubDocuments,
  Timestamp,
} from '@/lib/firebase/firestore';
import { orderBy } from 'firebase/firestore';
import { getUserById } from './users.service';

export async function logActivity(
  billId: string,
  userId: string | null,
  action: string,
  metadata: Record<string, unknown> = {}
): Promise<string> {
  const activityId = await createSubDocument<Omit<ActivityLog, 'id' | 'billId'>>(
    COLLECTIONS.BILLS,
    billId,
    'activity_logs',
    {
      userId,
      action,
      metadata,
      createdAt: Timestamp.now(),
    }
  );

  return activityId;
}

export async function getBillActivities(billId: string): Promise<ActivityLog[]> {
  const activities = await querySubDocuments<Omit<ActivityLog, 'billId'>>(
    COLLECTIONS.BILLS,
    billId,
    'activity_logs',
    orderBy('createdAt', 'desc')
  );

  return activities.map(activity => ({
    ...activity,
    billId,
  }));
}

export async function getBillActivitiesWithUsers(
  billId: string
): Promise<ActivityLogWithUser[]> {
  const activities = await getBillActivities(billId);

  const activitiesWithUsers = await Promise.all(
    activities.map(async (activity) => {
      if (!activity.userId) {
        return {
          ...activity,
          user: null,
        };
      }
      
      const user = await getUserById(activity.userId);
      return {
        ...activity,
        user,
      };
    })
  );

  return activitiesWithUsers;
}

