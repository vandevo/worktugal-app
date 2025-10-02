import { type ProductName } from '../stripe-config';

interface ServicesPageProps {
  onServiceSelect: (productName: ProductName) => void;
}

export function ServicesPage({ onServiceSelect }: ServicesPageProps) {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Our Services</h1>
        <p className="text-lg text-gray-600">Select a service to continue.</p>
      </div>
    </div>
  );
}
