'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface EnquiryItem {
  id?: string | number;
  partId?: number;
  partNumber: string;
  name: string;
  slug?: string;
  grade?: string;
  quantity: number;
  moq?: number;
  imageUrl?: string;
}

interface EnquiryContextType {
  items: EnquiryItem[];
  addItem: (part: { id?: number; partNumber: string; name: string; slug?: string; grade?: string; moq?: number; images?: string[] }, quantity?: number) => void;
  removeItem: (partNumber: string) => void;
  updateQuantity: (partNumber: string, quantity: number) => void;
  clearEnquiry: () => void;
  addBulkItems: (rawText: string) => number;
  totalCount: number;
  uniqueCount: number;
}

const EnquiryContext = createContext<EnquiryContextType | undefined>(undefined);

export function EnquiryProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<EnquiryItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('hastina_enquiry_list');
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load enquiry list from localStorage:', e);
    }
    setIsLoaded(true);
  }, []);

  // Sync to localStorage on update
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('hastina_enquiry_list', JSON.stringify(items));
      } catch (e) {
        console.error('Failed to save enquiry list to localStorage:', e);
      }
    }
  }, [items, isLoaded]);

  const addItem = (part: { id?: number; partNumber: string; name: string; slug?: string; grade?: string; moq?: number; images?: string[] }, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.partNumber.toLowerCase() === part.partNumber.toLowerCase());
      const minQty = part.moq || 1;
      const addQty = Math.max(quantity, minQty);

      if (existing) {
        return prev.map(i =>
          i.partNumber.toLowerCase() === part.partNumber.toLowerCase()
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      } else {
        return [
          ...prev,
          {
            partId: part.id,
            partNumber: part.partNumber,
            name: part.name,
            slug: part.slug,
            grade: part.grade,
            quantity: addQty,
            moq: part.moq || 1,
            imageUrl: part.images?.[0]
          }
        ];
      }
    });
  };

  const removeItem = (partNumber: string) => {
    setItems(prev => prev.filter(i => i.partNumber.toLowerCase() !== partNumber.toLowerCase()));
  };

  const updateQuantity = (partNumber: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(partNumber);
      return;
    }
    setItems(prev =>
      prev.map(i =>
        i.partNumber.toLowerCase() === partNumber.toLowerCase()
          ? { ...i, quantity }
          : i
      )
    );
  };

  const clearEnquiry = () => {
    setItems([]);
  };

  // Quick enquiry parser: allows pasting lines like:
  // "36360086 x 50" or "JA541015, 100" or "16510-05240 25"
  const addBulkItems = (rawText: string): number => {
    const lines = rawText.split('\n');
    let addedCount = 0;

    const newItems: EnquiryItem[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      // Extract part number and optional quantity
      const match = trimmed.match(/^([a-zA-Z0-9\-\.\/_]+)(?:[\s,xX\t]+(\d+))?/);
      if (match) {
        const partNo = match[1].trim();
        const qty = match[2] ? parseInt(match[2], 10) : 10;
        newItems.push({
          partNumber: partNo,
          name: `Part: ${partNo}`,
          quantity: qty,
          moq: 1
        });
        addedCount++;
      }
    }

    if (newItems.length > 0) {
      setItems(prev => {
        const updated = [...prev];
        for (const item of newItems) {
          const existing = updated.find(i => i.partNumber.toLowerCase() === item.partNumber.toLowerCase());
          if (existing) {
            existing.quantity += item.quantity;
          } else {
            updated.push(item);
          }
        }
        return updated;
      });
    }

    return addedCount;
  };

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const uniqueCount = items.length;

  return (
    <EnquiryContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearEnquiry,
        addBulkItems,
        totalCount,
        uniqueCount
      }}
    >
      {children}
    </EnquiryContext.Provider>
  );
}

export function useEnquiry() {
  const context = useContext(EnquiryContext);
  if (!context) {
    throw new Error('useEnquiry must be used within an EnquiryProvider');
  }
  return context;
}
