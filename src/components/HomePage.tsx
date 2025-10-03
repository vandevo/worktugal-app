import { useState, useEffect } from 'react';
import { Hero } from './Hero';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export function HomePage() {
  const navigate = useNavigate();
  const [spotsLeft, setSpotsLeft] = useState<number | null>(null);
  const [spotsLoading, setSpotsLoading] = useState(true);
  const [activePerksCount, setActivePerksCount] = useState<number | null>(null);
  const [activePerksLoading, setActivePerksLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const { count: submissionsCount } = await supabase
          .from('partner_submissions')
          .select('*', { count: 'exact', head: true });

        const totalSpots = 100;
        setSpotsLeft(totalSpots - (submissionsCount || 0));
        setSpotsLoading(false);

        setActivePerksCount(submissionsCount || 0);
        setActivePerksLoading(false);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setSpotsLoading(false);
        setActivePerksLoading(false);
      }
    }

    fetchStats();
  }, []);

  const handleGetStarted = () => {
    navigate('/services');
  };

  return (
    <div>
      <Hero
        onGetStarted={handleGetStarted}
        spotsLeft={spotsLeft}
        spotsLoading={spotsLoading}
        activePerksCount={activePerksCount}
        activePerksLoading={activePerksLoading}
      />
    </div>
  );
}
