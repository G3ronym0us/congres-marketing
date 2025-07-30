import { useState, useEffect } from 'react';
import { getTicketsMetrics } from '@/services/tickets';

export interface TicketMetrics {
  type: string;
  paid: number;
  reserved: number;
  total: number;
}

export interface SeatsOverview {
  totalPaid: number;
  totalReserved: number;
  totalAvailable: number;
  occupancyRate: number;
}

export interface MetricsData {
  ticketsByType: TicketMetrics[];
  seatsOverview: SeatsOverview;
  totalTickets: number;
  totalTransactions: number;
  conversionRate: number;
  lastUpdated: string;
}

export const useMetrics = () => {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getTicketsMetrics();
      setMetrics(data);
    } catch (err) {
      console.error('Error fetching metrics:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return {
    metrics,
    loading,
    error,
    refetch: fetchMetrics,
  };
};