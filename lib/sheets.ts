import { google } from 'googleapis';
import { Issue } from '@/types/issue';

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const SHEET_NAME = 'Issues';

function getAuth() {
  return new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

export async function getSheets() {
  const auth = getAuth();
  return google.sheets({ version: 'v4', auth });
}

export async function getAllIssues(): Promise<Issue[]> {
  const sheets = await getSheets();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A2:H`,
  });

  const rows = response.data.values || [];
  return rows.map((row) => ({
    ticketNumber: row[0] || '',
    propertyName: row[1] || '',
    issueCategory: row[2] || '',
    urgency: row[3] || 'Low',
    description: row[4] || '',
    photoURL: row[5] || '',
    dateSubmitted: row[6] || '',
    status: row[7] || 'Open',
  })) as Issue[];
}

export async function appendIssue(issue: Issue): Promise<void> {
  const sheets = await getSheets();
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A:H`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [[
        issue.ticketNumber,
        issue.propertyName,
        issue.issueCategory,
        issue.urgency,
        issue.description,
        issue.photoURL,
        issue.dateSubmitted,
        issue.status,
      ]],
    },
  });
}

export async function updateIssueStatus(
  ticketNumber: string,
  status: string
): Promise<void> {
  const sheets = await getSheets();

  // Find the row with this ticket number
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A:A`,
  });

  const rows = response.data.values || [];
  const rowIndex = rows.findIndex((row) => row[0] === ticketNumber);

  if (rowIndex === -1) throw new Error('Ticket not found');

  const sheetRow = rowIndex + 1; // 1-indexed, row 1 is header
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!H${sheetRow}`,
    valueInputOption: 'RAW',
    requestBody: { values: [[status]] },
  });
}

export async function getNextTicketNumber(): Promise<string> {
  const issues = await getAllIssues();
  const count = issues.length + 1;
  return `MNT-${String(count).padStart(4, '0')}`;
}