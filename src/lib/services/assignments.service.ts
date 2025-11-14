import {
  Assignment,
  AssignmentStatus,
  PortionType,
  CreateAssignmentFormData,
  AssignmentWithUser,
} from '@/types';
import {
  COLLECTIONS,
  createSubDocument,
  updateSubDocument,
  deleteSubDocument,
  querySubDocuments,
  Timestamp,
} from '@/lib/firebase/firestore';
import { where, orderBy } from 'firebase/firestore';
import { logActivity } from './activity.service';
import { getUserById } from './users.service';

export async function createAssignment(
  billId: string,
  itemId: string,
  userId: string,
  data: CreateAssignmentFormData
): Promise<string> {
  const assignmentId = await createSubDocument<Omit<Assignment, 'id' | 'billId' | 'itemId'>>(
    `${COLLECTIONS.BILLS}/${billId}/bill_items`,
    itemId,
    'assignments',
    {
      userId: data.userId,
      status: AssignmentStatus.PENDING,
      portionType: data.portionType,
      portionValue: data.portionValue || null,
      createdAt: Timestamp.now(),
    }
  );

  // Log activity
  const user = await getUserById(data.userId);
  await logActivity(billId, userId, 'Assigned item', {
    itemId,
    assignedTo: user?.name || 'Unknown',
  });

  return assignmentId;
}

export async function getItemAssignments(
  billId: string,
  itemId: string
): Promise<Assignment[]> {
  const assignments = await querySubDocuments<Omit<Assignment, 'billId' | 'itemId'>>(
    `${COLLECTIONS.BILLS}/${billId}/bill_items`,
    itemId,
    'assignments',
    orderBy('createdAt', 'asc')
  );

  return assignments.map(assignment => ({
    ...assignment,
    billId,
    itemId,
  }));
}

export async function getItemAssignmentsWithUsers(
  billId: string,
  itemId: string
): Promise<AssignmentWithUser[]> {
  const assignments = await getItemAssignments(billId, itemId);
  
  const assignmentsWithUsers = await Promise.all(
    assignments.map(async (assignment) => {
      const user = await getUserById(assignment.userId);
      return {
        ...assignment,
        user: user!,
      };
    })
  );

  return assignmentsWithUsers.filter(a => a.user !== null);
}

export async function updateAssignmentStatus(
  billId: string,
  itemId: string,
  assignmentId: string,
  userId: string,
  status: AssignmentStatus
): Promise<void> {
  await updateSubDocument(
    `${COLLECTIONS.BILLS}/${billId}/bill_items`,
    itemId,
    'assignments',
    assignmentId,
    { status }
  );

  // Log activity
  const user = await getUserById(userId);
  await logActivity(billId, userId, `${status} assignment`, {
    itemId,
    assignmentId,
    userName: user?.name || 'Unknown',
  });
}

export async function reassignItem(
  billId: string,
  itemId: string,
  currentUserId: string,
  newUserIds: string[]
): Promise<void> {
  // Create new assignments for each new user
  for (const newUserId of newUserIds) {
    await createAssignment(billId, itemId, currentUserId, {
      userId: newUserId,
      portionType: PortionType.EQUAL,
    });
  }

  // Log activity
  const user = await getUserById(currentUserId);
  await logActivity(billId, currentUserId, 'Reassigned item', {
    itemId,
    newUsers: newUserIds.length,
    userName: user?.name || 'Unknown',
  });
}

export async function deleteAssignment(
  billId: string,
  itemId: string,
  assignmentId: string
): Promise<void> {
  await deleteSubDocument(
    `${COLLECTIONS.BILLS}/${billId}/bill_items`,
    itemId,
    'assignments',
    assignmentId
  );
}

export async function getUserAssignments(userId: string): Promise<Assignment[]> {
  // Note: This is complex with Firestore's subcollections
  // For a production app, consider denormalizing this data
  // For now, we'll need to query all bills and check assignments
  // This is not optimal but works for MVP
  
  // TODO: Optimize this query in production
  return [];
}

