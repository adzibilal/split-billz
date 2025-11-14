import { User } from '@/types';
import {
  COLLECTIONS,
  getDocument,
  createDocumentWithId,
  queryDocuments,
} from '@/lib/firebase/firestore';
import { where } from 'firebase/firestore';

export async function syncUserFromClerk(
  userId: string,
  email: string,
  name: string,
  imageUrl: string
): Promise<void> {
  await createDocumentWithId<Omit<User, 'id'>>(COLLECTIONS.USERS, userId, {
    email,
    name,
    imageUrl,
    createdAt: new Date(),
  });
}

export async function getUserById(userId: string): Promise<User | null> {
  return await getDocument<User>(COLLECTIONS.USERS, userId);
}

export async function searchUsers(searchQuery: string): Promise<User[]> {
  if (!searchQuery || searchQuery.trim() === '') {
    return [];
  }

  const query = searchQuery.toLowerCase();
  
  // Search by email
  const usersByEmail = await queryDocuments<User>(
    COLLECTIONS.USERS,
    where('email', '>=', query),
    where('email', '<=', query + '\uf8ff')
  );

  // Note: Firestore doesn't support OR queries directly, so we need to search by name separately
  // and then merge the results (removing duplicates)
  const usersByName = await queryDocuments<User>(
    COLLECTIONS.USERS,
    where('name', '>=', query),
    where('name', '<=', query + '\uf8ff')
  );

  // Merge and deduplicate
  const userMap = new Map<string, User>();
  [...usersByEmail, ...usersByName].forEach(user => {
    userMap.set(user.id, user);
  });

  return Array.from(userMap.values());
}

export async function getUsersByIds(userIds: string[]): Promise<User[]> {
  if (userIds.length === 0) return [];
  
  const users = await Promise.all(
    userIds.map(id => getUserById(id))
  );
  
  return users.filter((user): user is User => user !== null);
}

