import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    const response = await axios.get(
      `https://data-api.coindesk.com/news/v1/article/list`,
      {
        params: {
          lang: 'EN',
          limit: 100,
          api_key: process.env.apikey, // Make sure it's in your .env.local
        },
      }
    );
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error fetching data:', error.message);
    return NextResponse.json(
      { error: 'Failed to fetch data from Coindesk' },
      { status: 500 }
    );
  }
}
