'use client';

import { useState } from 'react';
import { Card, CardBody, CardHeader, Button, Input, Select, SelectItem, addToast } from '@heroui/react';
import { apiClient } from '@/lib/api';

const MATURITIES = [
  '1 MONTH',
  '2 MONTH',
  '3 MONTH',
  '4 MONTH',
  '6 MONTH',
  '1 YEAR',
  '2 YEAR',
  '3 YEAR',
  '5 YEAR',
  '7 YEAR',
  '10 YEAR',
  '20 YEAR',
  '30 YEAR',
];

const ORDER_TYPES = [
  { key: 'BUY', label: 'BUY' },
  { key: 'SELL', label: 'SELL' }
];

interface OrderFormProps {
  onOrderSubmitted?: () => void;
}

export default function OrderForm({ onOrderSubmitted }: OrderFormProps) {
  const [maturity, setMaturity] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [orderType, setOrderType] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseInt(amount);
    setIsSubmitting(true);
    
    try {
      await apiClient.post('/v1/orders', {
        maturity,
        amount_usd: numericAmount,
        order_type: orderType
      });
      
      // Reset form
      setMaturity('');
      setAmount('');
      setOrderType('');
      
      // Notify parent component
      onOrderSubmitted?.();
      
      // Show success toast
      addToast({
        title: "Order placed successfully!",
        color: "success"
      });
    } catch (error) {
      console.error('Error submitting order:', error);
      addToast({
        title: "Error placing order. Please try again.",
        color: "danger"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <h3 className="text-lg font-semibold">Place Order</h3>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Treasury Maturity"
            placeholder="Select maturity"
            selectedKeys={maturity ? [maturity] : []}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0] as string;
              setMaturity(selectedKey || '');
            }}
            isRequired
          >
            {MATURITIES.map((mat) => (
              <SelectItem key={mat}>
                {mat}
              </SelectItem>
            ))}
          </Select>
          
          <Select
            label="Order Type"
            placeholder="Select order type"
            selectedKeys={orderType ? [orderType] : []}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0] as string;
              setOrderType(selectedKey || '');
            }}
            isRequired
          >
            {ORDER_TYPES.map((type) => (
              <SelectItem key={type.key}>
                {type.label}
              </SelectItem>
            ))}
          </Select>
          
          <Input
            type="number"
            label="Dollar Amount"
            placeholder="1000000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            startContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-small">$</span>
              </div>
            }
            min="1"
            step="1"
            isRequired
          />
          
          <Button
            type="submit"
            color="primary"
            variant="shadow"
            className="w-full"
            isLoading={isSubmitting}
            isDisabled={!maturity || !amount || !orderType}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Order'}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
