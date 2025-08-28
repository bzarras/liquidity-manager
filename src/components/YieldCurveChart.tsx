'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardBody } from '@heroui/react';
import { fetchYieldCurveData, type YieldData } from '@/lib/yieldCurve';

export default function YieldCurveChart() {
  const [yieldData, setYieldData] = useState<YieldData[]>([]);
  const [dataDate, setDataDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadYieldData = async () => {
      try {
        setError(null);
        const response = await fetchYieldCurveData();
        setYieldData(response.yields);
        setDataDate(response.date);
      } catch (error) {
        console.error('Error loading yield data:', error);
        setError(error instanceof Error ? error.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadYieldData();
  }, []);

  if (loading) {
    return (
      <Card className="w-full h-96">
        <CardBody className="flex items-center justify-center">
          <div className="text-center">Loading yield curve...</div>
        </CardBody>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full h-96">
        <CardBody className="flex items-center justify-center">
          <div className="text-center text-red-500">
            <p>Error loading yield curve data:</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  if (yieldData.length === 0) {
    return (
      <Card className="w-full h-96">
        <CardBody className="flex items-center justify-center">
          <div className="text-center">No yield data available</div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="w-full h-96">
      <CardBody>
        <h3 className="text-lg font-semibold mb-4">
          Treasury Yield Curve
          {dataDate && (
            <span className="text-sm font-normal text-gray-400 ml-2">
              (as of {dataDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })})
            </span>
          )}
        </h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={yieldData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#6b7280" />
            <XAxis 
              dataKey="maturity" 
              tick={{ fontSize: 12, fill: '#ffffff' }}
              axisLine={{ stroke: '#ffffff' }}
              tickLine={{ stroke: '#ffffff' }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#ffffff' }}
              label={{ value: 'Yield (%)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#ffffff' } }}
              domain={['dataMin - 0.1', 'dataMax + 0.1']}
              tickFormatter={(value) => value.toFixed(2)}
              axisLine={{ stroke: '#ffffff' }}
              tickLine={{ stroke: '#ffffff' }}
            />
            <Tooltip 
              formatter={(value: number) => [`${value}%`, 'Yield']}
              labelFormatter={(label) => `Maturity: ${label}`}
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '6px',
                color: '#f9fafb'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="yield" 
              stroke="#2563eb" 
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
}