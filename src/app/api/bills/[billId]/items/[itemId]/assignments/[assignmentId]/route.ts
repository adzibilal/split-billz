import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { updateAssignmentStatus } from '@/lib/services/assignments.service';
import { AssignmentStatus } from '@/types';

export async function PATCH(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ billId: string; itemId: string; assignmentId: string }>;
  }
) {
  try {
    const { userId } = await auth();
    const { billId, itemId, assignmentId } = await params;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { status } = await req.json();

    if (!status || !Object.values(AssignmentStatus).includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    await updateAssignmentStatus(
      billId,
      itemId,
      assignmentId,
      userId,
      status as AssignmentStatus
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error updating assignment:', error);
    return NextResponse.json(
      { error: 'Failed to update assignment' },
      { status: 500 }
    );
  }
}

