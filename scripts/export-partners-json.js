import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Check if required environment variables are available
if (!process.env.VITE_SUPABASE_URL) {
  console.error('❌ Error: VITE_SUPABASE_URL is missing from .env file');
  console.error('Please create a .env file in the project root with:');
  console.error('VITE_SUPABASE_URL=your-supabase-url');
  console.error('VITE_SUPABASE_ANON_KEY=your-anon-key');
  process.exit(1);
}

if (!process.env.VITE_SUPABASE_ANON_KEY) {
  console.error('❌ Error: VITE_SUPABASE_ANON_KEY is missing from .env file');
  console.error('Please create a .env file in the project root with:');
  console.error('VITE_SUPABASE_URL=your-supabase-url');
  console.error('VITE_SUPABASE_ANON_KEY=your-anon-key');
  process.exit(1);
}

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function fetchAllPartners() {
  console.log('🔍 Fetching all approved partners from Supabase...');
  
  try {
    const { data, error } = await supabase
      .from('partner_submissions')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching partner data:', error);
      return;
    }

    console.log(`✅ Found ${data.length} approved partners`);
    
    // Create comprehensive JSON structure
    const partnersJson = {
      total_count: data.length,
      last_updated: new Date().toISOString(),
      partners_and_perks: data.map(partner => ({
        id: partner.id,
        user_id: partner.user_id,
        business_name: partner.business_name,
        business_website: partner.business_website,
        business_instagram: partner.business_instagram,
        contact_name: partner.contact_name,
        contact_email: partner.contact_email,
        contact_phone: partner.contact_phone,
        business_category: partner.business_category,
        business_neighborhood: partner.business_neighborhood,
        perk_title: partner.perk_title,
        perk_description: partner.perk_description,
        perk_redemption_method: partner.perk_redemption_method,
        perk_redemption_details: partner.perk_redemption_details,
        perk_images: partner.perk_images || [],
        perk_logo: partner.perk_logo,
        perk_is_portuguese_owned: partner.perk_is_portuguese_owned,
        perk_needs_nif: partner.perk_needs_nif,
        perk_customer_nif: partner.perk_customer_nif,
        perk_customer_name: partner.perk_customer_name,
        status: partner.status,
        access_type: partner.access_type,
        stripe_order_id: partner.stripe_order_id,
        created_at: partner.created_at,
        updated_at: partner.updated_at
      })),
      business_categories: [
        "Cafés & Restaurants",
        "Coworking & Studios", 
        "Gyms & Wellness",
        "Events & Social Spaces",
        "Experts & Services",
        "Travel & Experiences"
      ],
      lisbon_neighborhoods: {
        "Central Lisbon": [
          "Chiado",
          "Príncipe Real",
          "Baixa / Rossio",
          "Cais do Sodré",
          "Bairro Alto",
          "Avenida da Liberdade"
        ],
        "West Lisbon": [
          "Campo de Ourique",
          "Estrela / Lapa",
          "Alcântara",
          "Belém / Ajuda",
          "Amoreiras / Campolide"
        ],
        "North & Business Districts": [
          "Avenidas Novas",
          "Saldanha / Picoas",
          "Marquês de Pombal",
          "Lumiar / Telheiras"
        ],
        "East & Creative Zones": [
          "Intendente / Anjos / Arroios",
          "Beato / Marvila",
          "Parque das Nações"
        ],
        "Other": [
          "Online Services",
          "Other / Not Listed"
        ]
      },
      redemption_methods: [
        {
          "value": "verbal",
          "label": "Verbal mention: \"I have Worktugal Pass\""
        },
        {
          "value": "show_pass",
          "label": "Show digital Worktugal Pass"
        },
        {
          "value": "promo_code",
          "label": "Use promo code"
        },
        {
          "value": "qr_code",
          "label": "Scan QR code"
        },
        {
          "value": "other",
          "label": "Other method (explain)"
        }
      ],
      pricing_info: {
        early_access_price: 49,
        currency: "EUR",
        payment_type: "one_time",
        total_early_access_spots: 25,
        access_type: "lifetime"
      },
      project_metadata: {
        name: "Worktugal Pass - Partner Portal",
        version: "v1.5.0",
        live_url: "https://pass.worktugal.com",
        target_audience: "Local businesses in Lisbon wanting to attract remote workers",
        value_proposition: "Connects local businesses with quality remote professionals through a trusted marketplace",
        location: "Lisbon, Portugal",
        contact: {
          email: "hello@worktugal.com",
          whatsapp: "+351 928 090 121",
          website: "https://worktugal.com",
          instagram: "@worktugal",
          telegram: "https://t.me/worktugal"
        }
      }
    };

    // Output the JSON (you can copy this)
    console.log('\n📋 COMPLETE PARTNERS JSON:');
    console.log('=' .repeat(80));
    console.log(JSON.stringify(partnersJson, null, 2));
    console.log('=' .repeat(80));
    
    // Also save to file for easy access
    const jsonString = JSON.stringify(partnersJson, null, 2);
    await Deno.writeTextFile('./partners-export.json', jsonString);
    console.log('\n💾 Data also saved to: partners-export.json');
    
    // Summary
    console.log('\n📊 SUMMARY:');
    console.log(`   • Total approved partners: ${data.length}`);
    console.log(`   • Portuguese-owned: ${data.filter(p => p.perk_is_portuguese_owned).length}`);
    console.log(`   • Categories represented: ${[...new Set(data.map(p => p.business_category))].length}`);
    console.log(`   • Neighborhoods covered: ${[...new Set(data.map(p => p.business_neighborhood))].length}`);
    
    return partnersJson;
    
  } catch (err) {
    console.error('💥 Unexpected error:', err);
  }
}

// Run the export
fetchAllPartners();