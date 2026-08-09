import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const runtime = "edge";

export async function GET() {
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: "Missing Supabase configuration" }, { status: 500 });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get total leads
    const { count: totalLeads } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true });
      
    // Get partner leads
    const { count: totalPartnerLeads } = await supabase
      .from('partner_leads')
      .select('*', { count: 'exact', head: true });

    // Calculate dates for last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const dateString = sevenDaysAgo.toISOString();

    // Get 7d leads
    const { count: recentLeads } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', dateString);
      
    // Get 7d partner leads
    const { count: recentPartnerLeads } = await supabase
      .from('partner_leads')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', dateString);

    const total = (totalLeads || 0) + (totalPartnerLeads || 0);
    const last_7_days = (recentLeads || 0) + (recentPartnerLeads || 0);

    return NextResponse.json({ 
      total, 
      last_7_days,
      breakdown: {
        total: { leads: totalLeads || 0, partner_leads: totalPartnerLeads || 0 },
        last_7_days: { leads: recentLeads || 0, partner_leads: recentPartnerLeads || 0 }
      }
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch leads count", details: String(error) }, { status: 500 });
  }
}
