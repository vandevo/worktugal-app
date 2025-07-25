import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Use service role key for admin operations
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // You'll need to add this to your .env

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error(`   VITE_SUPABASE_URL: ${supabaseUrl ? '✅' : '❌'}`);
  console.error(`   SUPABASE_SERVICE_ROLE_KEY: ${supabaseServiceKey ? '✅' : '❌'}`);
  console.error('\nPlease add your Supabase service role key to your .env file:');
  console.error('SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const partnerData = [
  {
    user_id: "d9096f5f-7768-4edb-8387-97997871b808",
    business_name: "Escala25",
    business_website: "https://escala25.com",
    business_instagram: "https://www.instagram.com/escala25_lisboa",
    contact_name: "Patrick Mills",
    contact_email: "patrick.mills@pitonadventure.com",
    contact_phone: "+351964129244",
    business_category: "Gyms & Wellness",
    business_neighborhood: "Alcântara",
    perk_title: "Exclusive rates on climbing packs & workshops",
    perk_description: "Climb Lisbon's most iconic bridge wall. Bouldering, belay, and guided climbs under the 25 de Abril Bridge.",
    perk_redemption_method: "other",
    perk_redemption_details: "WhatsApp Patrick mentioning \"Worktugal Pass\"",
    perk_images: ["https://jbmfneyofhqlwnnfuqbd.supabase.co/storage/v1/object/public/perk-assets/perk-images/escala-25-trust-monitor.jpg"],
    perk_logo: "https://jbmfneyofhqlwnnfuqbd.supabase.co/storage/v1/object/public/perk-assets/perk-images/escala-25-trust-monitor.jpg",
    perk_is_portuguese_owned: true,
    perk_needs_nif: false,
    status: "approved",
    access_type: "lifetime"
  },
  {
    user_id: "d4e7afd5-0c08-48aa-a340-0d1069523cae",
    business_name: "Kübe Coworking",
    business_website: "https://kubecowork.com",
    business_instagram: "https://www.instagram.com/kube.coworking/",
    contact_name: "Daniela Gonçalves",
    contact_email: "daniela.goncalves@kubecowork.com",
    contact_phone: "+351000000000", // Placeholder - update with real number
    business_category: "Coworking & Studios",
    business_neighborhood: "Alvalade",
    perk_title: "Free coworking trial day + seasonal member perks",
    perk_description: "Lisbon's most loved coworking space where tropical calm meets startup focus. Full amenities, vibrant community, and modern facilities. Perfect for remote workers, freelancers, and hybrid teams seeking productivity and connection.",
    perk_redemption_method: "other",
    perk_redemption_details: "Email for free trial day and seasonal member perks",
    perk_images: ["https://jbmfneyofhqlwnnfuqbd.supabase.co/storage/v1/object/public/perk-assets/perk-images/kube-coworking-all-spaces.webp"],
    perk_logo: "https://jbmfneyofhqlwnnfuqbd.supabase.co/storage/v1/object/public/perk-assets/perk-images/kube-coworking-all-spaces.webp",
    perk_is_portuguese_owned: true,
    perk_needs_nif: false,
    status: "approved",
    access_type: "lifetime"
  },
  {
    user_id: "6bf7f7bc-3777-4c10-bfe7-5072629c3c2c",
    business_name: "Suzana Mendes",
    business_website: "https://www.suzanamendes.com/",
    business_instagram: "https://www.instagram.com/fengshui_suzanamendes/",
    contact_name: "Suzana Mendes",
    contact_email: "contact@suzanamendes.com",
    contact_phone: "+351918789177",
    business_category: "Experts & Services",
    business_neighborhood: "Cascais",
    perk_title: "20% off Feng Shui + 10% off Self-Knowledge consultations",
    perk_description: "We study, harmonize and make the most of the energy in the spaces where people live and work. I guide and inspire people to be the best version of themselves.",
    perk_redemption_method: "promo_code",
    perk_redemption_details: "Use code: WORKTUGAL20",
    perk_images: ["https://jbmfneyofhqlwnnfuqbd.supabase.co/storage/v1/object/public/perk-assets/perk-images/suzana-mendes-feng-shui-upper-body-photo.jpg"],
    perk_logo: "https://jbmfneyofhqlwnnfuqbd.supabase.co/storage/v1/object/public/perk-assets/perk-images/suzana-mendes-feng-shui-upper-body-photo.jpg",
    perk_is_portuguese_owned: true,
    perk_needs_nif: false,
    status: "approved",
    access_type: "lifetime"
  },
  {
    user_id: "8160fd0d-d125-4126-af77-9b4ca5159825",
    business_name: "IFLI Foreign Language Immersion",
    business_website: "https://iflimmersion.com/en/home/",
    business_instagram: null,
    contact_name: "Giselle Alvarez",
    contact_email: "info@iflimmersion.com",
    contact_phone: "+351933292112",
    business_category: "Experts & Services",
    business_neighborhood: "Online Services",
    perk_title: "€5 off monthly language immersion + €2 off private sessions",
    perk_description: "Revolutionary online language learning focused on real conversations, not grammar drills. Flexible Portuguese & English immersion programs perfect for remote professionals and expats seeking practical fluency.",
    perk_redemption_method: "other",
    perk_redemption_details: "WhatsApp Giselle mentioning \"Worktugal Pass\" for discount",
    perk_images: ["https://jbmfneyofhqlwnnfuqbd.supabase.co/storage/v1/object/public/perk-assets/perk-images/ifli-language-immersion-giselle-alvarez.png"],
    perk_logo: "https://jbmfneyofhqlwnnfuqbd.supabase.co/storage/v1/object/public/perk-assets/perk-images/ifli-language-immersion-giselle-alvarez.png",
    perk_is_portuguese_owned: false,
    perk_needs_nif: false,
    status: "approved",
    access_type: "lifetime"
  },
  {
    user_id: "9bf79ba1-7704-4749-b6c8-350f4fe96ac9",
    business_name: "Tribe Social Club",
    business_website: "https://tribeirl.com/tribesocial",
    business_instagram: "https://www.instagram.com/tribe.irl/",
    contact_name: "Emily",
    contact_email: "emily@findyourtribe.app",
    contact_phone: "+351000000000", // Placeholder - update with real number
    business_category: "Events & Social Spaces",
    business_neighborhood: "Chiado",
    perk_title: "Free event creation on Tribe app + community access",
    perk_description: "Join Lisbon's largest community platform where remote workers, entrepreneurs, and creatives connect IRL. Create and discover events, access coworking spaces in Chiado & Caparica, and be part of a thriving ecosystem designed to end loneliness through meaningful connections.",
    perk_redemption_method: "other",
    perk_redemption_details: "Create your free event at tribeirl.com and join the community",
    perk_images: ["https://jbmfneyofhqlwnnfuqbd.supabase.co/storage/v1/object/public/perk-assets/perk-images/tribe-social-perk-image.png"],
    perk_logo: "https://jbmfneyofhqlwnnfuqbd.supabase.co/storage/v1/object/public/perk-assets/perk-images/tribe-social-perk-image.png",
    perk_is_portuguese_owned: false,
    perk_needs_nif: false,
    status: "approved",
    access_type: "lifetime"
  },
  {
    user_id: "120a8207-007a-4393-9914-38bbd8ef64f4",
    business_name: "Expat Insurance Agent - Damian Roach - Abbeygate",
    business_website: "https://www.abbeygate.pt/",
    business_instagram: "@hnw.expat.insurances.damian",
    contact_name: "Damian Roach",
    contact_email: "damianr@abbeygate.pt",
    contact_phone: "+351932927074",
    business_category: "Experts & Services",
    business_neighborhood: "Online Services",
    perk_title: "Exclusive insurance rates for remote workers",
    perk_description: "For remote workers and expats living in Portugal, getting reliable insurance is often confusing and slow. Damian Roach helps you skip the stress. As an expat insurance expert with Abbeygate, he provides fast quotes and helpful advice across car, home, health, travel, and business insurance. Everything in English. No call centers. Just WhatsApp Damian and he'll guide you through the process step-by-step.",
    perk_redemption_method: "other",
    perk_redemption_details: "WhatsApp Damian mentioning \"Worktugal Pass\"",
    perk_images: [
      "https://jbmfneyofhqlwnnfuqbd.supabase.co/storage/v1/object/public/perk-assets/perk-images/1753398456954-sjufw8ah4u8.jpg",
      "https://jbmfneyofhqlwnnfuqbd.supabase.co/storage/v1/object/public/perk-assets/perk-images/1753398510684-zs4ldzbskt.jpg"
    ],
    perk_logo: "https://jbmfneyofhqlwnnfuqbd.supabase.co/storage/v1/object/public/perk-assets/perk-images/damian-roach-abbeygate-profile-pic.jpg",
    perk_is_portuguese_owned: false,
    perk_needs_nif: false,
    status: "approved",
    access_type: "lifetime"
  }
];

async function testConnection() {
  console.log('🔌 Testing Supabase connection...');
  
  try {
    const { data, error } = await supabase
      .from('partner_submissions')
      .select('count', { count: 'exact', head: true });

    if (error) {
      console.error('❌ Connection failed:', error.message);
      return false;
    }

    console.log('✅ Connection successful! Current rows:', data);
    return true;
  } catch (err) {
    console.error('❌ Connection error:', err);
    return false;
  }
}

async function populatePartners() {
  console.log('🚀 Starting partner data population...');
  
  // Test connection first
  const connectionOk = await testConnection();
  if (!connectionOk) {
    console.error('💥 Aborting due to connection issues');
    return;
  }
  
  try {
    // Insert all partner submissions
    console.log(`📝 Inserting ${partnerData.length} partner submissions...`);
    
    const { data, error } = await supabase
      .from('partner_submissions')
      .insert(partnerData)
      .select();

    if (error) {
      console.error('❌ Error inserting partner submissions:', error);
      console.error('Error details:', error.details);
      console.error('Error hint:', error.hint);
      return;
    }

    console.log('✅ Successfully inserted partner submissions:', data.length);
    
    // Update user profiles to set role as 'partner'
    console.log('🔄 Updating user roles to "partner"...');
    
    for (const partner of partnerData) {
      const { error: roleError } = await supabase
        .from('user_profiles')
        .upsert({
          id: partner.user_id,
          role: 'partner'
        }, {
          onConflict: 'id'
        });

      if (roleError) {
        console.error(`❌ Error updating role for user ${partner.user_id}:`, roleError);
      } else {
        console.log(`✅ Updated role for ${partner.business_name}`);
      }
    }

    console.log('🎉 All partner data populated successfully!');
    console.log('📊 Summary:');
    console.log(`   • ${data.length} partner submissions created`);
    console.log(`   • ${partnerData.length} user roles updated to "partner"`);
    console.log('');
    console.log('🔍 Check your Supabase dashboard to verify the data.');
    
  } catch (err) {
    console.error('💥 Unexpected error:', err);
  }
}

// Run the population script
populatePartners();