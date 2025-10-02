import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function updateSecondHomeContact() {
  console.log('🔄 Updating Second Home contact information...');
  
  try {
    // Update Second Home Lisboa with correct email
    const { data, error } = await supabase
      .from('partner_submissions')
      .update({
        contact_email: 'ola.lisboa@secondhome.io',
        updated_at: new Date().toISOString(),
      })
      .eq('business_name', 'Second Home Lisboa')
      .select();

    if (error) {
      console.error('❌ Error updating Second Home contact:', error);
      return;
    }

    if (data && data.length > 0) {
      console.log('✅ Successfully updated Second Home contact email to: ola.lisboa@secondhome.io');
      console.log('📧 Now the "Email for Free Trial" button will work correctly');
    } else {
      console.log('⚠️ No Second Home Lisboa entry found in database');
    }
    
  } catch (err) {
    console.error('💥 Unexpected error:', err);
  }
}

// Run the update
updateSecondHomeContact();