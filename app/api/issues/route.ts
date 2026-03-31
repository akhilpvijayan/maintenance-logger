import { NextRequest, NextResponse } from 'next/server';
import { getAllIssues, appendIssue, getNextTicketNumber } from '@/lib/sheets';
import { Issue } from '@/types/issue';

export async function GET() {
  try {
    const issues = await getAllIssues();
    return NextResponse.json({ issues });
  } catch (error) {
    console.error('GET /api/issues error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch issues' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validation
    const required = ['propertyName', 'issueCategory', 'urgency', 'description'];
    for (const field of required) {
      if (!body[field]?.toString().trim()) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const ticketNumber = await getNextTicketNumber();
    const issue: Issue = {
      ticketNumber,
      propertyName: body.propertyName.trim(),
      issueCategory: body.issueCategory,
      urgency: body.urgency,
      description: body.description.trim(),
      photoURL: body.photoURL || '',
      dateSubmitted: new Date().toISOString(),
      status: 'Open',
    };

    await appendIssue(issue);
    return NextResponse.json({ issue }, { status: 201 });
  } catch (error) {
    console.error('POST /api/issues error:', error);
    return NextResponse.json(
      { error: 'Failed to create issue' },
      { status: 500 }
    );
  }
}