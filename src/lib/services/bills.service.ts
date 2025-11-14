import {
  Bill,
  BillItem,
  CreateBillFormData,
  BillWithItems,
} from '@/types';
import {
  COLLECTIONS,
  createDocument,
  getDocument,
  updateDocument,
  deleteDocument,
  queryDocuments,
  createSubDocument,
  updateSubDocument,
  deleteSubDocument,
  querySubDocuments,
  Timestamp,
} from '@/lib/firebase/firestore';
import { where, orderBy } from 'firebase/firestore';
import { logActivity } from './activity.service';

// Bill CRUD
export async function createBill(
  userId: string,
  data: CreateBillFormData
): Promise<string> {
  // Create bill
  const billId = await createDocument<Omit<Bill, 'id'>>(COLLECTIONS.BILLS, {
    creatorId: userId,
    title: data.title,
    description: data.description,
    bankName: data.bankName,
    accountNumber: data.accountNumber,
    accountOwner: data.accountOwner,
    createdAt: Timestamp.now(),
  });

  // Add items
  for (const item of data.items) {
    await addItemToBill(billId, item.name, item.amount);
  }

  // Log activity
  await logActivity(billId, userId, 'Created bill', {
    title: data.title,
  });

  return billId;
}

export async function getBill(billId: string): Promise<Bill | null> {
  return await getDocument<Bill>(COLLECTIONS.BILLS, billId);
}

export async function getBillWithItems(
  billId: string
): Promise<BillWithItems | null> {
  const bill = await getBill(billId);
  if (!bill) return null;

  const items = await getBillItems(billId);
  
  // We'll load the creator separately if needed
  return {
    ...bill,
    items,
  } as BillWithItems;
}

export async function updateBill(
  billId: string,
  data: Partial<Omit<Bill, 'id' | 'creatorId' | 'createdAt'>>
): Promise<void> {
  await updateDocument(COLLECTIONS.BILLS, billId, data);
}

export async function deleteBill(billId: string): Promise<void> {
  // Note: Firestore will automatically delete subcollections if rules allow
  // Or you need to manually delete all subcollections first
  await deleteDocument(COLLECTIONS.BILLS, billId);
}

export async function getUserBills(userId: string): Promise<Bill[]> {
  return await queryDocuments<Bill>(
    COLLECTIONS.BILLS,
    where('creatorId', '==', userId),
    orderBy('createdAt', 'desc')
  );
}

// Bill Items CRUD
export async function addItemToBill(
  billId: string,
  name: string,
  amount: number
): Promise<string> {
  const itemId = await createSubDocument<Omit<BillItem, 'id' | 'billId'>>(
    COLLECTIONS.BILLS,
    billId,
    'bill_items',
    {
      name,
      amount,
      createdAt: Timestamp.now(),
    }
  );

  return itemId;
}

export async function getBillItems(billId: string): Promise<BillItem[]> {
  const items = await querySubDocuments<Omit<BillItem, 'billId'>>(
    COLLECTIONS.BILLS,
    billId,
    'bill_items',
    orderBy('createdAt', 'asc')
  );

  return items.map(item => ({ ...item, billId }));
}

export async function getBillItem(
  billId: string,
  itemId: string
): Promise<BillItem | null> {
  const item = await getDocument<Omit<BillItem, 'billId'>>(
    `${COLLECTIONS.BILLS}/${billId}/bill_items`,
    itemId
  );
  
  if (!item) return null;
  return { ...item, billId };
}

export async function updateBillItem(
  billId: string,
  itemId: string,
  data: { name?: string; amount?: number }
): Promise<void> {
  await updateSubDocument(
    COLLECTIONS.BILLS,
    billId,
    'bill_items',
    itemId,
    data
  );
}

export async function deleteBillItem(
  billId: string,
  itemId: string
): Promise<void> {
  await deleteSubDocument(COLLECTIONS.BILLS, billId, 'bill_items', itemId);
}

