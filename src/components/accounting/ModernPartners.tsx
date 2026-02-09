import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Instagram, ArrowRight, Building2, Map as MapIcon, User } from 'lucide-react';

export const ModernPartners: React.FC = () => {
  return (
    <section className="py-24 bg-obsidian-light border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-serif text-white text-center"
          >
            Trusted by Lisbon's best
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-2 text-gray-500 text-center max-w-2xl font-light"
          >
            We work alongside established accountants, coworking spaces, and service providers who support remote professionals in Portugal.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PartnerCard 
            image="https://jbmfneyofhqlwnnfuqbd.supabase.co/storage/v1/object/public/perk-assets/business-logos/outsite-logo.webp"
            icon={<MapIcon className="w-5 h-5" />}
            name="Outsite"
            location="Cais do Sodré"
            title="Last minute and long term Outsite deals"
            description="Outsite is a global network of coliving spaces built for remote professionals. Members get access to a private deals portal with up to 40% off."
            delay={0}
          />
          <PartnerCard 
            image="https://jbmfneyofhqlwnnfuqbd.supabase.co/storage/v1/object/public/perk-assets/perk-images/secondhome-logo-mint-background.png"
            icon={<Building2 className="w-5 h-5" />}
            name="Second Home"
            location="Mercado da Ribeira"
            title="Free day pass at design-led workspace"
            description="Second Home is Lisbon's iconic creative hub, known for its plant-filled architecture and global community."
            delay={0.1}
          />
          <PartnerCard 
            image="https://jbmfneyofhqlwnnfuqbd.supabase.co/storage/v1/object/public/perk-assets/perk-images/guilherme-perk-image.png"
            icon={<User className="w-5 h-5" />}
            name="Guilherme"
            location="Nomad Relocate"
            title="Free 30-min visa & tax call"
            description="Expert legal, tax, and relocation help for foreign freelancers, nomads, investors, and remote workers moving to Portugal."
            delay={0.2}
          />
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <a href="/partners" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500 hover:text-white transition-colors group">
            See all partners 
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

interface PartnerCardProps {
  icon?: React.ReactNode;
  image?: string;
  name: string;
  location: string;
  title: string;
  description: string;
  delay: number;
}

const PartnerCard = ({ icon, image, name, location, title, description, delay }: PartnerCardProps) => {
  const [imageError, setImageError] = React.useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="group relative bg-[#121212] rounded-xl border border-white/5 p-6 hover:border-white/10 transition-all duration-300 hover:shadow-2xl hover:shadow-black"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          {image && !imageError ? (
            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center overflow-hidden">
              <img 
                alt={name} 
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                src={image} 
                onError={() => setImageError(true)}
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-gray-500 group-hover:text-blue-400 transition-colors">
              {icon}
            </div>
          )}
          <div>
            <h4 className="font-medium text-white text-sm">{name}</h4>
            <p className="text-xs text-gray-500">{location}</p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">Verified</span>
      </div>
      
      <h5 className="font-medium text-gray-200 text-sm mb-2">{title}</h5>
      <p className="text-xs text-gray-500 mb-4 line-clamp-3 font-light">
        {description}
      </p>
      
      <div className="pt-4 border-t border-white/5 flex gap-4 text-xs font-medium text-gray-600 group-hover:text-gray-400 transition-colors">
        <a href="#" className="flex items-center gap-1 hover:text-white transition-colors"><Globe className="w-3 h-3" /> Website</a>
        <a href="#" className="flex items-center gap-1 hover:text-white transition-colors"><Instagram className="w-3 h-3" /> Instagram</a>
      </div>
    </motion.div>
  );
};
