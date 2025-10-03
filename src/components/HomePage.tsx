import { FC } from 'react';

export const HomePage: FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [spotsLeft, setSpotsLeft] = useState<number | null>(null);
  const [spotsLoading, setSpotsLoading] = useState(true);
  const [activePerksCount, setActivePerksCount] = useState<number | null>(null);
  const [activePerksLoading, setActivePerksLoading] = useState(true);

  useEffect(() => {
    const fetchSpotsLeft = async () => {
      try {
        setSpotsLoading(true);
        const { count, error } = await supabase
          .from('partner_submissions')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'approved');

        if (error) throw error;

        const total = 25;
        const remaining = Math.max(0, total - (count || 0));
        setSpotsLeft(remaining);
      } catch (err) {
        console.error('Error fetching spots:', err);
        setSpotsLeft(null);
      } finally {
        setSpotsLoading(false);
      }
    };

    const fetchActivePerks = async () => {
      try {
        setActivePerksLoading(true);
        const { count, error } = await supabase
          .from('partner_submissions')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'approved');

        if (error) throw error;
        setActivePerksCount(count || 0);
      } catch (err) {
        console.error('Error fetching active perks:', err);
        setActivePerksCount(null);
      } finally {
        setActivePerksLoading(false);
      }
    };

    fetchSpotsLeft();
    fetchActivePerks();
  }, []);

  const handleGetStarted = () => {
    setShowForm(true);
  };

  const handleFormComplete = () => {
    setShowForm(false);
    document.getElementById('directory')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {!showForm ? (
        <>
          <Hero
            onGetStarted={handleGetStarted}
            spotsLeft={spotsLeft}
            spotsLoading={spotsLoading}
            activePerksCount={activePerksCount}
            activePerksLoading={activePerksLoading}
          />
          <PerksDirectory />
          <PartnerPricingHero onGetStarted={handleGetStarted} />
        </>
      ) : (
        <div className="py-20">
          <FormWizard onComplete={handleFormComplete} />
        </div>
      )}
    </>
  );
};
