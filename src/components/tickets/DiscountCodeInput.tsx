'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { discountCodeService } from '@/services/discountCode';
import { ValidateDiscountCodeResponse } from '@/types/discountCode';
import { useLanguage } from '@/context/LanguageContext';

interface DiscountCodeInputProps {
  onDiscountApplied: (discount: { code: string; percentage: number }) => void;
  onDiscountRemoved: () => void;
  appliedDiscount?: { code: string; percentage: number } | null;
  disabled?: boolean;
  editionId?: number;
}

export default function DiscountCodeInput({
  onDiscountApplied,
  onDiscountRemoved,
  appliedDiscount,
  disabled = false,
  editionId,
}: DiscountCodeInputProps) {
  const { t } = useLanguage();
  const [code, setCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string>('');

  const validateCode = async () => {
    if (!code.trim()) {
      setError(t('forms.discount.enterCode'));
      return;
    }

    setIsValidating(true);
    setError('');

    try {
      const response: ValidateDiscountCodeResponse = await discountCodeService.validateCode({
        code: code.trim(),
        edition: editionId,
      });

      if (response.isValid && response.discountPercentage) {
        onDiscountApplied({
          code: code.trim().toUpperCase(),
          percentage: parseFloat(response.discountPercentage),
        });
        setCode('');
      } else {
        setError(response.message || t('forms.discount.invalid'));
      }
    } catch (error: any) {
      console.error('Error validating discount code:', error);
      setError(t('forms.discount.validateError'));
    } finally {
      setIsValidating(false);
    }
  };

  const removeDiscount = () => {
    onDiscountRemoved();
    setCode('');
    setError('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      validateCode();
    }
  };

  return (
    <div className="qs-panel">
      <h4 className="cart-summary-title" style={{ marginBottom: 14 }}>{t('forms.discount.title')}</h4>

      {appliedDiscount ? (
        <div className="cart-alert ok" style={{ marginBottom: 0, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="cart-edition-icon" style={{ width: 32, height: 32 }}>
              <FontAwesomeIcon icon={faCheck} />
            </span>
            <div>
              <p style={{ color: 'var(--white)', fontWeight: 600 }}>
                {t('forms.discount.appliedPrefix')} {appliedDiscount.code}
              </p>
              <p style={{ color: 'var(--neon)', fontSize: 13 }}>
                {t('forms.discount.discountOf', { percentage: appliedDiscount.percentage })}
              </p>
            </div>
          </div>
          <button
            onClick={removeDiscount}
            disabled={disabled}
            className="cart-item-remove"
            title={t('forms.discount.removeTitle')}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              onKeyPress={handleKeyPress}
              placeholder={t('forms.discount.placeholder')}
              disabled={disabled || isValidating}
              className="cart-field"
              style={{
                flex: 1, padding: '12px 16px', borderRadius: 10,
                border: '1px solid var(--line)', background: 'var(--panel-2)', color: 'var(--white)',
                fontFamily: 'var(--body)', fontSize: 14,
              }}
            />
            <button
              onClick={validateCode}
              disabled={disabled || isValidating || !code.trim()}
              className="btn btn-neon"
              style={{ minWidth: 110, justifyContent: 'center', opacity: (disabled || isValidating || !code.trim()) ? .5 : 1, cursor: (disabled || isValidating || !code.trim()) ? 'not-allowed' : 'pointer' }}
            >
              {isValidating ? (
                <span style={{ width: 16, height: 16, border: '2px solid rgba(6,43,20,.3)', borderTopColor: '#062B14', borderRadius: '50%', display: 'inline-block' }} className="animate-spin" />
              ) : (
                t('forms.discount.apply')
              )}
            </button>
          </div>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#FF5470', fontSize: 13 }}>
              <FontAwesomeIcon icon={faCircleExclamation} />
              <span>{error}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
