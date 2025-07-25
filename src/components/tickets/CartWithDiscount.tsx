'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { AppliedDiscount } from '@/types/discountCode';
import DiscountCodeInput from './DiscountCodeInput';
import OrderSummary from './OrderSummary';

interface CartWithDiscountProps {
  ticketPrice: number;
  quantity: number;
  includeMemories: boolean;
  memoriesAlreadyIncluded: boolean;
  isOnlyMemories?: boolean;
}

export default function CartWithDiscount({
  ticketPrice,
  quantity,
  includeMemories,
  memoriesAlreadyIncluded,
  isOnlyMemories = false,
}: CartWithDiscountProps) {
  const { state, applyDiscount, removeDiscount } = useCart();

  const handleDiscountApplied = (discount: { code: string; percentage: number }) => {
    const appliedDiscount: AppliedDiscount = {
      code: discount.code,
      discountPercentage: discount.percentage,
      discountAmount: 0, // Se calculará en el servicio
      originalAmount: 0, // Se calculará en el servicio
      finalAmount: 0, // Se calculará en el servicio
    };
    
    applyDiscount(appliedDiscount);
  };

  const handleDiscountRemoved = () => {
    removeDiscount();
  };

  return (
    <div className="space-y-4">
      <DiscountCodeInput
        onDiscountApplied={handleDiscountApplied}
        onDiscountRemoved={handleDiscountRemoved}
        appliedDiscount={state.appliedDiscount}
      />
      
      <OrderSummary
        ticketPrice={ticketPrice}
        quantity={quantity}
        includeMemories={includeMemories}
        memoriesAlreadyIncluded={memoriesAlreadyIncluded}
        isOnlyMemories={isOnlyMemories}
        appliedDiscount={state.appliedDiscount}
      />
    </div>
  );
}