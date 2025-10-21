import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://api.returnsportal.online';
const API_PASSWORD = process.env.NEXT_PUBLIC_8RETURNS_API_PASSWORD || '';
const API_KEY = process.env.NEXT_PUBLIC_8RETURNS_API_KEY || '';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!API_PASSWORD || !API_KEY) {
    return NextResponse.json(
      { error: 'API credentials not configured' },
      { status: 500 }
    );
  }

  try {
    // Search by order number using query parameter
    const url = `${API_BASE_URL}/v1/customer_returns?s=${id}&page=1&per_page=1`;
    console.log('Searching for order:', id);
    console.log('URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer token=${API_PASSWORD}, api_key=${API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      return NextResponse.json(
        { error: `API Error (${response.status}): ${errorText || response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Search results:', data);
    
    // Check if we got results
    if (!data.customer_returns || data.customer_returns.length === 0) {
      return NextResponse.json(
        { error: `No return found for order number: ${id}` },
        { status: 404 }
      );
    }

    // Return the first matching customer return
    const customerReturn = data.customer_returns[0];
    console.log('Found return ID:', customerReturn.id);
    
    return NextResponse.json({ customer_return: customerReturn });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch return data' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!API_PASSWORD || !API_KEY) {
    return NextResponse.json(
      { error: 'API credentials not configured' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { customerReturnId, sku, quantity, status, notes } = body;

    if (!customerReturnId || !sku || !quantity || !status) {
      return NextResponse.json(
        { error: 'Missing required fields: customerReturnId, sku, quantity, or status' },
        { status: 400 }
      );
    }

    // Update item status using 8returns API
    // Endpoint: PATCH /v1/customer_returns/:id/items
    const url = `${API_BASE_URL}/v1/customer_returns/${customerReturnId}/items`;
    console.log(`Updating return ${customerReturnId}, SKU ${sku} to status:`, status);
    
    const requestBody = {
      customer_return: {
        items: [
          {
            sku,
            quantity,
            status,
            ...(notes && { notes })
          }
        ]
      }
    };

    console.log('Request body:', JSON.stringify(requestBody, null, 2));
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer token=${API_PASSWORD}, api_key=${API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Update response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      return NextResponse.json(
        { error: `API Error (${response.status}): ${errorText || response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Update successful:', data);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update item status' },
      { status: 500 }
    );
  }
}

