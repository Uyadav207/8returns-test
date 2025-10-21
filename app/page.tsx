'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, ScanLine, CheckCircle2, ArrowRight } from "lucide-react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/scan');
    }, 2000);
    return () => clearTimeout(timer);
  }, [router]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-6">
            <Package className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            Warehouse Return
            <span className="block text-primary mt-2">Inspector</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Mobile-optimized inspection app for warehouse workers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mb-3">
                <ScanLine className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-lg">Quick Scanning</CardTitle>
              <CardDescription>
                Scan barcodes to instantly lookup returns
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-lg">Easy Inspection</CardTitle>
              <CardDescription>
                View all items with their status
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center mb-3">
                <Package className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-lg">Real-time Data</CardTitle>
              <CardDescription>
                Status syncs with 8returns API
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="text-center">
          <Button 
            size="lg" 
            className="h-16 px-8 text-lg"
            onClick={() => router.push('/scan')}
          >
            <ScanLine className="mr-2 h-6 w-6" />
            Start Scanning
            <ArrowRight className="ml-2 h-6 w-6" />
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Redirecting to scanner...
          </p>
        </div>

        <div className="mt-12 flex items-center justify-center gap-2 flex-wrap">
          <Badge variant="secondary">Next.js 15</Badge>
          <Badge variant="secondary">shadcn/ui</Badge>
          <Badge variant="secondary">8returns API</Badge>
          <Badge variant="secondary">Mobile-First</Badge>
        </div>
      </div>
    </div>
  );
}
