import { useEffect, useState } from 'react';

import { supabase } from '@/lib/supabase';
import type { Partner } from '@/types/partner';

type PartnerRow = {
  id: string;
  name: string;
  description: string | null;
  address: string;
  latitude: number;
  longitude: number;
  happy_hour_start: string;
  happy_hour_end: string;
  exclusive_promo: string;
};

function mapRow(row: PartnerRow): Partner {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? '',
    address: row.address,
    latitude: row.latitude,
    longitude: row.longitude,
    happyHourStart: row.happy_hour_start.slice(0, 5),
    happyHourEnd: row.happy_hour_end.slice(0, 5),
    exclusivePromo: row.exclusive_promo,
  };
}

export function usePartners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('partners')
      .select('*')
      .order('name')
      .then(({ data }) => {
        if (data) setPartners(data.map(mapRow));
        setIsLoading(false);
      });
  }, []);

  return { partners, isLoading };
}
