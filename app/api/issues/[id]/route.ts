import { NextRequest, NextResponse } from 'next/server';
import { updateIssueStatus } from '@/lib/sheets';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await req.json();
    const validStatuses = ['Open', 'In Progress', 'Resolved'];

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    await updateIssueStatus(id, status);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PATCH error:', error);
    return NextResponse.json(
      { error: 'Failed to update status' },
      { status: 500 }
    );
  }
}
