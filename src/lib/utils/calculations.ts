import {
  BillItem,
  Assignment,
  AssignmentStatus,
  PortionType,
  BillSummary,
} from '@/types';

export function calculateBillSummary(
  items: BillItem[],
  assignments: Map<string, Assignment[]>
): BillSummary {
  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
  
  const userAmountsMap = new Map<
    string,
    { userName: string; amount: number; status: AssignmentStatus }
  >();
  
  let pendingCount = 0;
  let acceptedCount = 0;
  let rejectedCount = 0;

  // Calculate amount per user based on assignments
  items.forEach((item) => {
    const itemAssignments = assignments.get(item.id) || [];
    
    if (itemAssignments.length === 0) return;

    // Filter out rejected assignments
    const activeAssignments = itemAssignments.filter(
      (a) => a.status !== AssignmentStatus.REJECTED
    );

    if (activeAssignments.length === 0) return;

    // Calculate based on portion type
    activeAssignments.forEach((assignment) => {
      let userAmount = 0;

      switch (assignment.portionType) {
        case PortionType.EQUAL:
          userAmount = item.amount / activeAssignments.length;
          break;
        case PortionType.AMOUNT:
          userAmount = assignment.portionValue || 0;
          break;
        case PortionType.PERCENT:
          userAmount = (item.amount * (assignment.portionValue || 0)) / 100;
          break;
      }

      const existing = userAmountsMap.get(assignment.userId);
      if (existing) {
        existing.amount += userAmount;
        // Update status if any assignment is pending
        if (assignment.status === AssignmentStatus.PENDING) {
          existing.status = AssignmentStatus.PENDING;
        }
      } else {
        userAmountsMap.set(assignment.userId, {
          userName: '', // Will be filled by caller
          amount: userAmount,
          status: assignment.status,
        });
      }

      // Count statuses
      if (assignment.status === AssignmentStatus.PENDING) {
        pendingCount++;
      } else if (assignment.status === AssignmentStatus.ACCEPTED) {
        acceptedCount++;
      } else if (assignment.status === AssignmentStatus.REJECTED) {
        rejectedCount++;
      }
    });
  });

  const userAmounts = Array.from(userAmountsMap.entries()).map(
    ([userId, data]) => ({
      userId,
      userName: data.userName,
      amount: Math.round(data.amount * 100) / 100, // Round to 2 decimal places
      status: data.status,
    })
  );

  return {
    totalAmount: Math.round(totalAmount * 100) / 100,
    userAmounts,
    pendingCount,
    acceptedCount,
    rejectedCount,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

export function calculateItemTotal(
  item: BillItem,
  assignments: Assignment[]
): number {
  const activeAssignments = assignments.filter(
    (a) => a.status !== AssignmentStatus.REJECTED
  );

  if (activeAssignments.length === 0) return item.amount;

  return item.amount;
}

