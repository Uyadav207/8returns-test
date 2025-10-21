export interface ReturnItem {
  id: number;
  name: string;
  sku: string;
  ean?: number;
  quantity: number;
  amount: string;
  currency: string;
  item_condition?: string;
  return_type: string;
  restocked: boolean;
  notes?: string;
  return_reason_text?: string;
  registered_date?: string;
  arrived_date?: string;
  inspected_date?: string;
  refunded_date?: string;
  return_reason?: {
    reason_internal?: string;
  };
  return_reason_pictures?: Array<{
    image_url: string;
  }>;
}

export interface CustomerReturn {
  id: number;
  order_id: string;
  order_number: string;
  rma: number;
  total_amount: string;
  currency: string;
  quantity: number;
  status: string;
  registered_date: string;
  created_at: string;
  updated_at: string;
  is_registered: boolean;
  is_arrived: boolean;
  is_inspected: boolean;
  is_refunded: boolean;
  customer: {
    full_name: string;
    email: string;
    country?: string;
    notes?: string;
  };
  items: ReturnItem[];
}

export interface ApiResponse {
  customer_return: CustomerReturn;
}

export interface SearchApiResponse {
  customer_returns: CustomerReturn[];
  total_count: number;
  current_page: number;
  total_pages: number;
}

export async function getCustomerReturn(orderId: string): Promise<CustomerReturn> {
  // Use Next.js API route as proxy to avoid CORS issues
  const response = await fetch(`/api/returns/${orderId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(errorData.error || `Failed to fetch return (${response.status})`);
  }

  const data: ApiResponse = await response.json();
  return data.customer_return;
}

export async function updateItemStatus(
  orderId: string,
  customerReturnId: number,
  sku: string,
  quantity: number,
  status: 'inspected' | 'arrived' | 'missing',
  notes?: string
): Promise<Array<{ id: number; sku: string; message: string; status: string }>> {
  const response = await fetch(`/api/returns/${orderId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      customerReturnId,
      sku,
      quantity,
      status,
      notes,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(errorData.error || `Failed to update item status (${response.status})`);
  }

  const data = await response.json();
  return data;
}

