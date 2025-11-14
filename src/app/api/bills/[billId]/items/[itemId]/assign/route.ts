import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createAssignment } from '@/lib/services/assignments.service';
import { CreateAssignmentFormData } from '@/types';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ billId: string; itemId: string }> }
) {
  try {
    const { userId } = await auth();
    const { billId, itemId } = await params;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data: CreateAssignmentFormData = await req.json();

    if (!data.userId || !data.portionType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const assignmentId = await createAssignment(
      billId,
      itemId,
      userId,
      data
    );

    return NextResponse.json({ assignmentId }, { status: 201 });
  } catch (error) {
    console.error('Error creating assignment:', error);
    return NextResponse.json(
      { error: 'Failed to create assignment' },
      { status: 500 }
    );
  }
}

