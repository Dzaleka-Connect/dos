import { google } from 'googleapis';

// Initialize Google Sheets API
const initializeAuth = () => {
  const clientEmail = import.meta.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const privateKey = import.meta.env.GOOGLE_SHEETS_PRIVATE_KEY;
  const spreadsheetId = import.meta.env.GOOGLE_SHEETS_ID;

  if (!clientEmail || !privateKey || !spreadsheetId) {
    console.error('Missing environment variables:', {
      hasClientEmail: !!clientEmail,
      hasPrivateKey: !!privateKey,
      hasSpreadsheetId: !!spreadsheetId
    });
    throw new Error('Missing required Google Sheets environment variables');
  }

  try {
    return new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey.replace(/\\n/g, '\n'),
        type: 'service_account',
        project_id: 'sixth-now-440314',
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
  } catch (error) {
    console.error('Error initializing Google Auth:', error);
    throw error;
  }
};

// Retry configuration
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let auth: any;
let sheets: any;
let spreadsheetId: string;

try {
  auth = initializeAuth();
  sheets = google.sheets({ version: 'v4', auth });
  spreadsheetId = import.meta.env.GOOGLE_SHEETS_ID;
  console.log('Successfully initialized Google Sheets');
} catch (error) {
  console.error('Failed to initialize Google Sheets:', error);
}

async function retryOperation<T>(
  operation: () => Promise<T>,
  retryCount = 0
): Promise<T> {
  try {
    return await operation();
  } catch (error: any) {
    if (retryCount >= MAX_RETRIES) {
      console.error(`Failed after ${MAX_RETRIES} retries:`, error);
      throw error;
    }

    if (error.code === 429 || error.message?.includes('resource_exhausted')) {
      const delay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount);
      console.log(`Rate limited, retrying in ${delay}ms...`);
      await wait(delay);
      return retryOperation(operation, retryCount + 1);
    }

    throw error;
  }
}

export async function appendToSheet(values: any[]) {
  if (!sheets || !spreadsheetId) {
    console.error('Google Sheets not properly initialized');
    return null;
  }

  try {
    return await retryOperation(async () => {
      console.log('Attempting to append to sheet:', spreadsheetId);
      const response = await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'Events!A:K', // Adjust range based on your columns
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [values],
        },
      });
      console.log('Successfully appended to sheet');
      return response.data;
    });
  } catch (error) {
    console.error('Error appending to sheet:', error);
    return null;
  }
}

export async function getEvents() {
  if (!sheets || !spreadsheetId) {
    console.error('Google Sheets not properly initialized');
    return [];
  }

  try {
    return await retryOperation(async () => {
      console.log('Attempting to fetch events from sheet:', spreadsheetId);
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Events!A:K', // Adjust range based on your columns
      });
      console.log('Successfully fetched events');
      return response.data.values || [];
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}
