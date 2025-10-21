'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScanLine, Package, AlertCircle, Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";
import { getCustomerReturn, updateItemStatus, CustomerReturn, ReturnItem } from "@/lib/api";

export default function ScanPage() {
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [returnData, setReturnData] = useState<CustomerReturn | null>(null);
  const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());
  const [successMessage, setSuccessMessage] = useState('');

  const handleScan = async () => {
    if (!orderId.trim()) {
      setError('Please enter an order number');
      return;
    }

    setLoading(true);
    setError('');
    setReturnData(null);
    setSuccessMessage('');

    try {
      const data = await getCustomerReturn(orderId.trim());
      setReturnData(data);
      setError('');
    } catch (err) {
      console.error('Fetch error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch return data';
      setError(errorMessage);
      setReturnData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleInspectItem = async (item: ReturnItem) => {
    if (!returnData) return;

    setUpdatingItems(prev => new Set(prev).add(item.id));
    setError('');
    setSuccessMessage('');

    try {
      await updateItemStatus(
        returnData.order_number,
        returnData.id,
        item.sku,
        item.quantity,
        'inspected',
        `Inspected by warehouse worker on ${new Date().toLocaleString()}`
      );
      
      // Refresh the return data to get updated status
      const updatedData = await getCustomerReturn(returnData.order_number);
      setReturnData(updatedData);
      setSuccessMessage(`${item.name} marked as inspected!`);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Update error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update item status';
      setError(errorMessage);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleScan();
    }
  };

  const getStatusColor = (status?: string) => {
    if (!status) return 'outline';
    const s = status.toLowerCase();
    if (s.includes('refund') || s.includes('inspected')) return 'default';
    if (s.includes('registered') || s.includes('arrived')) return 'secondary';
    if (s.includes('cancel') || s.includes('hold')) return 'destructive';
    return 'outline';
  };

  const isItemInspected = (item: ReturnItem) => {
    return !!item.inspected_date;
  };

  const getInspectionStats = () => {
    if (!returnData?.items) return { inspected: 0, total: 0 };
    const inspected = returnData.items.filter(isItemInspected).length;
    const total = returnData.items.length;
    return { inspected, total };
  };

  const stats = getInspectionStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 md:p-6">
      <div className="container mx-auto max-w-5xl py-4 md:py-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
            <Package className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Warehouse Inspector</h1>
          <p className="text-lg text-muted-foreground">iPad Optimized for Barcode Scanning</p>
        </div>

        {/* Scanner Input */}
        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <ScanLine className="w-7 h-7" />
              Scan Order Barcode
            </CardTitle>
            <CardDescription className="text-base">Use barcode scanner or enter order number manually</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Input
                type="text"
                placeholder="Scan or type order number..."
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                onKeyPress={handleKeyPress}
                className="h-20 text-2xl font-mono"
                autoFocus
                disabled={loading}
              />
              <Button 
                onClick={handleScan} 
                disabled={loading}
                className="h-20 px-10 text-lg"
                size="lg"
              >
                {loading ? (
                  <Loader2 className="w-7 h-7 animate-spin" />
                ) : (
                  <ScanLine className="w-7 h-7" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Success Alert */}
        {successMessage && (
          <Alert className="mb-6 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-800 dark:text-green-200 font-medium">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-5 w-5" />
            <AlertDescription className="text-base">{error}</AlertDescription>
          </Alert>
        )}

        {/* Return Details */}
        {returnData && (
          <div className="space-y-6">
            {/* Progress Card */}
            <Card className="shadow-lg border-2">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-2xl font-bold">Inspection Progress</h3>
                  <div className="text-4xl font-bold text-primary">
                    {stats.inspected}/{stats.total}
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-6 overflow-hidden">
                  <div 
                    className="bg-primary h-full transition-all duration-500 flex items-center justify-center text-xs font-semibold text-primary-foreground"
                    style={{ width: `${stats.total > 0 ? (stats.inspected / stats.total) * 100 : 0}%` }}
                  >
                    {stats.total > 0 && Math.round((stats.inspected / stats.total) * 100)}%
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Info */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">Order Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Order Number</p>
                    <p className="font-bold text-lg">{returnData.order_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">RMA</p>
                    <p className="font-bold text-lg">{returnData.rma}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Customer</p>
                    <p className="font-semibold text-base">{returnData.customer.full_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                    <Badge variant={getStatusColor(returnData.status)} className="text-sm px-3 py-1">
                      {returnData.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Items List */}
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Package className="w-7 h-7" />
                Items to Inspect ({returnData.items?.length || 0})
              </h2>
              <div className="space-y-4">
                {returnData.items?.map((item) => {
                  const inspected = isItemInspected(item);
                  const updating = updatingItems.has(item.id);
                  
                  return (
                    <Card 
                      key={item.id} 
                      className={`transition-all duration-300 ${
                        inspected 
                          ? 'border-2 border-green-500 bg-green-50 dark:bg-green-950/20' 
                          : 'border-2 border-orange-300 dark:border-orange-700 hover:shadow-lg'
                      }`}
                    >
                      <CardContent className="p-6">
                        <div className="flex gap-6">
                          {/* Item Image */}
                          {item.return_reason_pictures && item.return_reason_pictures.length > 0 && (
                            <div className="w-32 h-32 bg-muted rounded-lg flex-shrink-0 overflow-hidden border-2">
                              <img 
                                src={item.return_reason_pictures[0].image_url} 
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          
                          {/* Item Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-3">
                              <h3 className="font-bold text-2xl">
                                {item.name}
                              </h3>
                              {inspected ? (
                                <div className="flex items-center gap-2 bg-green-100 dark:bg-green-900 px-4 py-2 rounded-full">
                                  <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                                  <span className="font-semibold text-green-700 dark:text-green-300">INSPECTED</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 bg-orange-100 dark:bg-orange-900 px-4 py-2 rounded-full">
                                  <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                                  <span className="font-semibold text-orange-700 dark:text-orange-300">PENDING</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex flex-wrap gap-3 mb-4">
                              <Badge variant="outline" className="text-base px-3 py-1">
                                SKU: {item.sku}
                              </Badge>
                              <Badge variant="outline" className="text-base px-3 py-1">
                                Qty: {item.quantity}
                              </Badge>
                              {item.item_condition && (
                                <Badge variant="outline" className="text-base px-3 py-1">
                                  {item.item_condition}
                                </Badge>
                              )}
                              <Badge variant="outline" className="text-base px-3 py-1">
                                {item.amount} {item.currency}
                              </Badge>
                            </div>
                            
                            {item.return_reason?.reason_internal && (
                              <p className="text-sm text-muted-foreground mb-4">
                                <strong>Return Reason:</strong> {item.return_reason.reason_internal}
                              </p>
                            )}

                            {/* Inspection Button */}
                            <Button
                              onClick={() => handleInspectItem(item)}
                              disabled={inspected || updating}
                              size="lg"
                              className={`h-16 text-lg font-bold min-w-[200px] ${
                                inspected 
                                  ? 'bg-green-600 hover:bg-green-600' 
                                  : 'bg-orange-600 hover:bg-orange-700'
                              }`}
                            >
                              {updating ? (
                                <>
                                  <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                                  Updating...
                                </>
                              ) : inspected ? (
                                <>
                                  <CheckCircle2 className="w-6 h-6 mr-2" />
                                  Inspected ✓
                                </>
                              ) : (
                                <>
                                  <Package className="w-6 h-6 mr-2" />
                                  Mark as Inspected
                                </>
                              )}
                            </Button>

                            {inspected && item.inspected_date && (
                              <p className="text-xs text-muted-foreground mt-2">
                                Inspected on: {new Date(item.inspected_date).toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Scan New Button */}
            <div className="sticky bottom-4 pt-4">
              <Button 
                onClick={() => {
                  setReturnData(null);
                  setOrderId('');
                  setError('');
                  setSuccessMessage('');
                }}
                variant="outline"
                className="w-full h-20 text-xl font-bold border-2 shadow-lg bg-background hover:bg-muted"
                size="lg"
              >
                <ScanLine className="w-7 h-7 mr-2" />
                Scan New Order
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

