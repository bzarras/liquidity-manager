'use client';

import { useEffect, useState } from 'react';
import { 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell,
  Card,
  CardBody,
  CardHeader,
  Spinner
} from '@heroui/react';
import { apiClient } from '@/lib/api';

interface Order {
  id: number;
  maturity: string;
  amount_usd: number;
  created_at: string;
  order_type: string;
  order_status: string;
}

interface OrderHistoryTableProps {
  refreshTrigger?: number;
}

export default function OrderHistoryTable({ refreshTrigger }: OrderHistoryTableProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/v1/orders');
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [refreshTrigger]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    // Ensure the UTC timestamp is properly parsed
    const date = new Date(dateString.endsWith('Z') ? dateString : dateString + 'Z');
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <h3 className="text-lg font-semibold">Order History</h3>
      </CardHeader>
      <CardBody>
        <Table aria-label="Order history table" removeWrapper>
          <TableHeader>
            <TableColumn>DATE</TableColumn>
            <TableColumn>MATURITY</TableColumn>
            <TableColumn>AMOUNT</TableColumn>
            <TableColumn>TYPE</TableColumn>
            <TableColumn>STATUS</TableColumn>
          </TableHeader>
          <TableBody
            isLoading={isLoading}
            loadingContent={<Spinner label="Loading orders..." />}
            emptyContent={isLoading ? " " : "No orders found."}
          >
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{formatDate(order.created_at)}</TableCell>
                <TableCell>{order.maturity}</TableCell>
                <TableCell>{formatCurrency(order.amount_usd)}</TableCell>
                <TableCell>{order.order_type}</TableCell>
                <TableCell>
                  <span className="text-green-600 font-medium">
                    {order.order_status || 'PENDING'}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
}
