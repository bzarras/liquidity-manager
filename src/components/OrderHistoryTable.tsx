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
  Spinner,
  Select,
  SelectItem
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
  const [limit, setLimit] = useState<number>(10);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const params = { limit };
      const response = await apiClient.get('/v1/orders', { params });
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
  }, [refreshTrigger, limit]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
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
      <CardHeader className="flex-row items-center justify-between">
        <h3 className="text-lg font-semibold">Order History</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Display:</span>
          <Select
            size="sm"
            selectedKeys={[limit.toString()]}
            onSelectionChange={(keys) => {
              const key = Array.from(keys)[0] as string;
              setLimit(parseInt(key));
            }}
            className="w-32"
            aria-label="Select display limit"
          >
            <SelectItem key="10">Last 10</SelectItem>
            <SelectItem key="25">Last 25</SelectItem>
            <SelectItem key="50">Last 50</SelectItem>
            <SelectItem key="100">Last 100</SelectItem>
            <SelectItem key="-1">All</SelectItem>
          </Select>
        </div>
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
