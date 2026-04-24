export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      accountant_applications: {
        Row: {
          accepts_triage_role: string | null
          admin_notes: string | null
          availability: string | null
          bio: string | null
          created_at: string
          current_freelancer_clients: string | null
          email: string
          english_fluency: string | null
          experience_years: number | null
          foreign_client_percentage: string | null
          full_name: string
          has_occ: boolean | null
          id: number
          linkedin_url: string | null
          occ_number: string | null
          partnership_interest_level: string | null
          phone: string | null
          portuguese_fluency: string | null
          preferred_communication: string | null
          resume_path: string | null
          resume_url: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          specializations: string[] | null
          status: Database["public"]["Enums"]["application_status"]
          updated_at: string
          vat_scenario_answer: string | null
          website_url: string | null
          why_worktugal: string | null
        }
        Insert: {
          accepts_triage_role?: string | null
          admin_notes?: string | null
          availability?: string | null
          bio?: string | null
          created_at?: string
          current_freelancer_clients?: string | null
          email: string
          english_fluency?: string | null
          experience_years?: number | null
          foreign_client_percentage?: string | null
          full_name: string
          has_occ?: boolean | null
          id?: never
          linkedin_url?: string | null
          occ_number?: string | null
          partnership_interest_level?: string | null
          phone?: string | null
          portuguese_fluency?: string | null
          preferred_communication?: string | null
          resume_path?: string | null
          resume_url?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          specializations?: string[] | null
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
          vat_scenario_answer?: string | null
          website_url?: string | null
          why_worktugal?: string | null
        }
        Update: {
          accepts_triage_role?: string | null
          admin_notes?: string | null
          availability?: string | null
          bio?: string | null
          created_at?: string
          current_freelancer_clients?: string | null
          email?: string
          english_fluency?: string | null
          experience_years?: number | null
          foreign_client_percentage?: string | null
          full_name?: string
          has_occ?: boolean | null
          id?: never
          linkedin_url?: string | null
          occ_number?: string | null
          partnership_interest_level?: string | null
          phone?: string | null
          portuguese_fluency?: string | null
          preferred_communication?: string | null
          resume_path?: string | null
          resume_url?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          specializations?: string[] | null
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
          vat_scenario_answer?: string | null
          website_url?: string | null
          why_worktugal?: string | null
        }
        Relationships: []
      }
      accountant_profiles: {
        Row: {
          average_rating: number | null
          bank_account_name: string | null
          bank_bic: string | null
          bank_iban: string | null
          bio: string | null
          cal_api_key: string | null
          cal_link: string | null
          certifications: Json | null
          commission_rate: number
          created_at: string
          email: string
          full_name: string
          id: string
          languages: string[] | null
          minimum_monthly_guarantee: number | null
          phone: string | null
          preferred_payout_method:
            | Database["public"]["Enums"]["payout_method"]
            | null
          profile_picture_url: string | null
          specializations: string[] | null
          status: Database["public"]["Enums"]["accountant_status"]
          tax_id: string | null
          timezone: string | null
          total_consultations: number | null
          total_earnings: number | null
          updated_at: string
        }
        Insert: {
          average_rating?: number | null
          bank_account_name?: string | null
          bank_bic?: string | null
          bank_iban?: string | null
          bio?: string | null
          cal_api_key?: string | null
          cal_link?: string | null
          certifications?: Json | null
          commission_rate?: number
          created_at?: string
          email: string
          full_name: string
          id: string
          languages?: string[] | null
          minimum_monthly_guarantee?: number | null
          phone?: string | null
          preferred_payout_method?:
            | Database["public"]["Enums"]["payout_method"]
            | null
          profile_picture_url?: string | null
          specializations?: string[] | null
          status?: Database["public"]["Enums"]["accountant_status"]
          tax_id?: string | null
          timezone?: string | null
          total_consultations?: number | null
          total_earnings?: number | null
          updated_at?: string
        }
        Update: {
          average_rating?: number | null
          bank_account_name?: string | null
          bank_bic?: string | null
          bank_iban?: string | null
          bio?: string | null
          cal_api_key?: string | null
          cal_link?: string | null
          certifications?: Json | null
          commission_rate?: number
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          languages?: string[] | null
          minimum_monthly_guarantee?: number | null
          phone?: string | null
          preferred_payout_method?:
            | Database["public"]["Enums"]["payout_method"]
            | null
          profile_picture_url?: string | null
          specializations?: string[] | null
          status?: Database["public"]["Enums"]["accountant_status"]
          tax_id?: string | null
          timezone?: string | null
          total_consultations?: number | null
          total_earnings?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      accounting_clients: {
        Row: {
          business_type: string | null
          communication_preferences: Json | null
          company_name: string | null
          created_at: string
          id: number
          preferred_language: string | null
          tax_number: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          business_type?: string | null
          communication_preferences?: Json | null
          company_name?: string | null
          created_at?: string
          id?: never
          preferred_language?: string | null
          tax_number?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          business_type?: string | null
          communication_preferences?: Json | null
          company_name?: string | null
          created_at?: string
          id?: never
          preferred_language?: string | null
          tax_number?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      accounting_intakes: {
        Row: {
          accounting_software: string | null
          activity_code: string | null
          activity_date: string | null
          activity_opened: boolean | null
          biggest_worry: string | null
          came_from_checkup_id: number | null
          city: string | null
          claimed_at: string | null
          claimed_by: string | null
          compliance_report: string | null
          compliance_score_green: number | null
          compliance_score_red: number | null
          compliance_score_yellow: number | null
          country: string | null
          created_at: string
          days_in_portugal: number | null
          email: string
          email_marketing_consent: boolean | null
          estimated_annual_income: string | null
          files: Json | null
          first_submission_at: string | null
          has_electronic_notifications: boolean | null
          has_fiscal_representative: boolean | null
          has_iban: boolean | null
          has_nif: boolean | null
          has_niss: boolean | null
          has_vat_number: boolean | null
          iban_number: string | null
          id: number
          income_sources: Json | null
          is_latest_submission: boolean | null
          last_step_reached: number | null
          lead_email_hash: string
          lead_quality_score: number | null
          months_in_portugal: number | null
          name: string
          nif_number: string | null
          niss_number: string | null
          phone: string | null
          previous_accountant: boolean | null
          previous_submission_id: number | null
          residency_status: string | null
          source_type: string | null
          special_notes: string | null
          status: string
          submission_sequence: number | null
          tags: Json | null
          updated_at: string
          urgency_level: string
          user_id: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
          vat_regime: string | null
          work_type: string | null
        }
        Insert: {
          accounting_software?: string | null
          activity_code?: string | null
          activity_date?: string | null
          activity_opened?: boolean | null
          biggest_worry?: string | null
          came_from_checkup_id?: number | null
          city?: string | null
          claimed_at?: string | null
          claimed_by?: string | null
          compliance_report?: string | null
          compliance_score_green?: number | null
          compliance_score_red?: number | null
          compliance_score_yellow?: number | null
          country?: string | null
          created_at?: string
          days_in_portugal?: number | null
          email: string
          email_marketing_consent?: boolean | null
          estimated_annual_income?: string | null
          files?: Json | null
          first_submission_at?: string | null
          has_electronic_notifications?: boolean | null
          has_fiscal_representative?: boolean | null
          has_iban?: boolean | null
          has_nif?: boolean | null
          has_niss?: boolean | null
          has_vat_number?: boolean | null
          iban_number?: string | null
          id?: never
          income_sources?: Json | null
          is_latest_submission?: boolean | null
          last_step_reached?: number | null
          lead_email_hash: string
          lead_quality_score?: number | null
          months_in_portugal?: number | null
          name: string
          nif_number?: string | null
          niss_number?: string | null
          phone?: string | null
          previous_accountant?: boolean | null
          previous_submission_id?: number | null
          residency_status?: string | null
          source_type?: string | null
          special_notes?: string | null
          status?: string
          submission_sequence?: number | null
          tags?: Json | null
          updated_at?: string
          urgency_level?: string
          user_id?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          vat_regime?: string | null
          work_type?: string | null
        }
        Update: {
          accounting_software?: string | null
          activity_code?: string | null
          activity_date?: string | null
          activity_opened?: boolean | null
          biggest_worry?: string | null
          came_from_checkup_id?: number | null
          city?: string | null
          claimed_at?: string | null
          claimed_by?: string | null
          compliance_report?: string | null
          compliance_score_green?: number | null
          compliance_score_red?: number | null
          compliance_score_yellow?: number | null
          country?: string | null
          created_at?: string
          days_in_portugal?: number | null
          email?: string
          email_marketing_consent?: boolean | null
          estimated_annual_income?: string | null
          files?: Json | null
          first_submission_at?: string | null
          has_electronic_notifications?: boolean | null
          has_fiscal_representative?: boolean | null
          has_iban?: boolean | null
          has_nif?: boolean | null
          has_niss?: boolean | null
          has_vat_number?: boolean | null
          iban_number?: string | null
          id?: never
          income_sources?: Json | null
          is_latest_submission?: boolean | null
          last_step_reached?: number | null
          lead_email_hash?: string
          lead_quality_score?: number | null
          months_in_portugal?: number | null
          name?: string
          nif_number?: string | null
          niss_number?: string | null
          phone?: string | null
          previous_accountant?: boolean | null
          previous_submission_id?: number | null
          residency_status?: string | null
          source_type?: string | null
          special_notes?: string | null
          status?: string
          submission_sequence?: number | null
          tags?: Json | null
          updated_at?: string
          urgency_level?: string
          user_id?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          vat_regime?: string | null
          work_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accounting_intakes_came_from_checkup_fkey"
            columns: ["came_from_checkup_id"]
            isOneToOne: false
            referencedRelation: "tax_checkup_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounting_intakes_previous_submission_id_fkey"
            columns: ["previous_submission_id"]
            isOneToOne: false
            referencedRelation: "accounting_intakes"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_memories: {
        Row: {
          content: string
          created_at: string | null
          embedding: string | null
          id: string
          metadata: Json | null
          project: string | null
          tags: string[] | null
        }
        Insert: {
          content: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
          project?: string | null
          tags?: string[] | null
        }
        Update: {
          content?: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
          project?: string | null
          tags?: string[] | null
        }
        Relationships: []
      }
      appointments: {
        Row: {
          accountant_id: string | null
          accountant_payout_amount: number | null
          booking_id: number | null
          cal_attendees: Json | null
          cal_booking_uid: string | null
          cal_event_id: string | null
          cal_event_uid: string | null
          cal_metadata: Json | null
          cal_reschedule_uid: string | null
          cal_webhook_received_at: string | null
          client_approved_at: string | null
          client_feedback: string | null
          client_id: string
          client_notes: string | null
          client_rating: number | null
          consult_booking_id: number | null
          consultation_completed_at: string | null
          consultation_started_at: string | null
          created_at: string
          duration_minutes: number | null
          escrow_hold_until: string | null
          id: number
          meeting_notes: string | null
          meeting_url: string | null
          outcome_document_url: string | null
          outcome_submitted_at: string | null
          payment_amount: number | null
          platform_fee_amount: number | null
          preferred_date: string | null
          scheduled_date: string | null
          service_type: string
          status: Database["public"]["Enums"]["appointment_status"]
          stripe_payment_intent_id: string | null
          updated_at: string
        }
        Insert: {
          accountant_id?: string | null
          accountant_payout_amount?: number | null
          booking_id?: number | null
          cal_attendees?: Json | null
          cal_booking_uid?: string | null
          cal_event_id?: string | null
          cal_event_uid?: string | null
          cal_metadata?: Json | null
          cal_reschedule_uid?: string | null
          cal_webhook_received_at?: string | null
          client_approved_at?: string | null
          client_feedback?: string | null
          client_id: string
          client_notes?: string | null
          client_rating?: number | null
          consult_booking_id?: number | null
          consultation_completed_at?: string | null
          consultation_started_at?: string | null
          created_at?: string
          duration_minutes?: number | null
          escrow_hold_until?: string | null
          id?: never
          meeting_notes?: string | null
          meeting_url?: string | null
          outcome_document_url?: string | null
          outcome_submitted_at?: string | null
          payment_amount?: number | null
          platform_fee_amount?: number | null
          preferred_date?: string | null
          scheduled_date?: string | null
          service_type: string
          status?: Database["public"]["Enums"]["appointment_status"]
          stripe_payment_intent_id?: string | null
          updated_at?: string
        }
        Update: {
          accountant_id?: string | null
          accountant_payout_amount?: number | null
          booking_id?: number | null
          cal_attendees?: Json | null
          cal_booking_uid?: string | null
          cal_event_id?: string | null
          cal_event_uid?: string | null
          cal_metadata?: Json | null
          cal_reschedule_uid?: string | null
          cal_webhook_received_at?: string | null
          client_approved_at?: string | null
          client_feedback?: string | null
          client_id?: string
          client_notes?: string | null
          client_rating?: number | null
          consult_booking_id?: number | null
          consultation_completed_at?: string | null
          consultation_started_at?: string | null
          created_at?: string
          duration_minutes?: number | null
          escrow_hold_until?: string | null
          id?: never
          meeting_notes?: string | null
          meeting_url?: string | null
          outcome_document_url?: string | null
          outcome_submitted_at?: string | null
          payment_amount?: number | null
          platform_fee_amount?: number | null
          preferred_date?: string | null
          scheduled_date?: string | null
          service_type?: string
          status?: Database["public"]["Enums"]["appointment_status"]
          stripe_payment_intent_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_accountant_id_fkey"
            columns: ["accountant_id"]
            isOneToOne: false
            referencedRelation: "accountant_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "consult_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_consult_booking_id_fkey"
            columns: ["consult_booking_id"]
            isOneToOne: false
            referencedRelation: "consult_bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      checkup_feedback: {
        Row: {
          admin_notes: string | null
          checkup_lead_id: number | null
          comment: string | null
          created_at: string | null
          feedback_type: string
          flag_id: string | null
          flag_type: string | null
          id: number
          is_accurate: boolean | null
          metadata: Json | null
          resolved_at: string | null
          status: string | null
          user_email: string | null
          user_name: string | null
        }
        Insert: {
          admin_notes?: string | null
          checkup_lead_id?: number | null
          comment?: string | null
          created_at?: string | null
          feedback_type: string
          flag_id?: string | null
          flag_type?: string | null
          id?: number
          is_accurate?: boolean | null
          metadata?: Json | null
          resolved_at?: string | null
          status?: string | null
          user_email?: string | null
          user_name?: string | null
        }
        Update: {
          admin_notes?: string | null
          checkup_lead_id?: number | null
          comment?: string | null
          created_at?: string | null
          feedback_type?: string
          flag_id?: string | null
          flag_type?: string | null
          id?: number
          is_accurate?: boolean | null
          metadata?: Json | null
          resolved_at?: string | null
          status?: string | null
          user_email?: string | null
          user_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "checkup_feedback_checkup_lead_id_fkey"
            columns: ["checkup_lead_id"]
            isOneToOne: false
            referencedRelation: "tax_checkup_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_diagnostics: {
        Row: {
          country_target: string
          created_at: string
          diagnostic_version: string
          email: string
          exposure_index: number
          id: string
          payment_status: string
          raw_answers: Json
          ruleset_version: string
          segment: string
          setup_score: number
          trap_flags: Json
          user_id: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          country_target?: string
          created_at?: string
          diagnostic_version: string
          email: string
          exposure_index: number
          id?: string
          payment_status?: string
          raw_answers?: Json
          ruleset_version: string
          segment: string
          setup_score: number
          trap_flags?: Json
          user_id?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          country_target?: string
          created_at?: string
          diagnostic_version?: string
          email?: string
          exposure_index?: number
          id?: string
          payment_status?: string
          raw_answers?: Json
          ruleset_version?: string
          segment?: string
          setup_score?: number
          trap_flags?: Json
          user_id?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: []
      }
      consult_bookings: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: number
          notes: string | null
          outcome_url: string | null
          phone: string | null
          preferred_date: string | null
          scheduled_date: string | null
          service_type: string
          status: string
          stripe_session_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: never
          notes?: string | null
          outcome_url?: string | null
          phone?: string | null
          preferred_date?: string | null
          scheduled_date?: string | null
          service_type: string
          status?: string
          stripe_session_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: never
          notes?: string | null
          outcome_url?: string | null
          phone?: string | null
          preferred_date?: string | null
          scheduled_date?: string | null
          service_type?: string
          status?: string
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      contact_requests: {
        Row: {
          budget_range: string | null
          company_name: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          message: string | null
          notes: string | null
          priority: string | null
          purpose: string
          replied_at: string | null
          status: string | null
          timeline: string | null
          webhook_sent: boolean | null
          webhook_sent_at: string | null
          website_url: string | null
        }
        Insert: {
          budget_range?: string | null
          company_name?: string | null
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          message?: string | null
          notes?: string | null
          priority?: string | null
          purpose: string
          replied_at?: string | null
          status?: string | null
          timeline?: string | null
          webhook_sent?: boolean | null
          webhook_sent_at?: string | null
          website_url?: string | null
        }
        Update: {
          budget_range?: string | null
          company_name?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          message?: string | null
          notes?: string | null
          priority?: string | null
          purpose?: string
          replied_at?: string | null
          status?: string | null
          timeline?: string | null
          webhook_sent?: boolean | null
          webhook_sent_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      disputes: {
        Row: {
          accountant_id: string | null
          appointment_id: number
          client_id: string
          created_at: string
          id: number
          reason: string
          refund_amount: number | null
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          status: Database["public"]["Enums"]["dispute_status"]
          updated_at: string
        }
        Insert: {
          accountant_id?: string | null
          appointment_id: number
          client_id: string
          created_at?: string
          id?: never
          reason: string
          refund_amount?: number | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: Database["public"]["Enums"]["dispute_status"]
          updated_at?: string
        }
        Update: {
          accountant_id?: string | null
          appointment_id?: number
          client_id?: string
          created_at?: string
          id?: never
          reason?: string
          refund_amount?: number | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: Database["public"]["Enums"]["dispute_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "disputes_accountant_id_fkey"
            columns: ["accountant_id"]
            isOneToOne: false
            referencedRelation: "accountant_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disputes_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      leads_accounting: {
        Row: {
          additional_details: string | null
          consent: boolean
          country: string | null
          created_at: string
          email: string
          id: number
          main_need: string | null
          name: string
          source: string
          status: string
          urgency: string | null
        }
        Insert: {
          additional_details?: string | null
          consent?: boolean
          country?: string | null
          created_at?: string
          email: string
          id?: never
          main_need?: string | null
          name: string
          source?: string
          status?: string
          urgency?: string | null
        }
        Update: {
          additional_details?: string | null
          consent?: boolean
          country?: string | null
          created_at?: string
          email?: string
          id?: never
          main_need?: string | null
          name?: string
          source?: string
          status?: string
          urgency?: string | null
        }
        Relationships: []
      }
      paid_compliance_reviews: {
        Row: {
          access_token: string
          admin_notes: string | null
          ai_draft_report: string | null
          ai_research_results: Json | null
          ai_research_status: string | null
          ai_researched_at: string | null
          ambiguity_score: number | null
          created_at: string | null
          customer_email: string
          customer_name: string | null
          escalation_flags: Json | null
          form_data: Json | null
          form_progress: Json | null
          id: string
          review_delivered_at: string | null
          status: string
          stripe_payment_intent_id: string | null
          stripe_session_id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          access_token?: string
          admin_notes?: string | null
          ai_draft_report?: string | null
          ai_research_results?: Json | null
          ai_research_status?: string | null
          ai_researched_at?: string | null
          ambiguity_score?: number | null
          created_at?: string | null
          customer_email: string
          customer_name?: string | null
          escalation_flags?: Json | null
          form_data?: Json | null
          form_progress?: Json | null
          id?: string
          review_delivered_at?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          access_token?: string
          admin_notes?: string | null
          ai_draft_report?: string | null
          ai_research_results?: Json | null
          ai_research_status?: string | null
          ai_researched_at?: string | null
          ambiguity_score?: number | null
          created_at?: string | null
          customer_email?: string
          customer_name?: string | null
          escalation_flags?: Json | null
          form_data?: Json | null
          form_progress?: Json | null
          id?: string
          review_delivered_at?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      partner_submissions: {
        Row: {
          access_type: string
          business_category: string
          business_instagram: string | null
          business_name: string
          business_neighborhood: string
          business_website: string | null
          contact_email: string
          contact_name: string
          contact_phone: string
          created_at: string
          id: number
          perk_customer_name: string | null
          perk_customer_nif: string | null
          perk_description: string
          perk_images: string[] | null
          perk_is_portuguese_owned: boolean
          perk_logo: string | null
          perk_needs_nif: boolean
          perk_redemption_details: string
          perk_redemption_method: string
          perk_title: string
          status: Database["public"]["Enums"]["submission_status"]
          stripe_order_id: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_type?: string
          business_category: string
          business_instagram?: string | null
          business_name: string
          business_neighborhood: string
          business_website?: string | null
          contact_email: string
          contact_name: string
          contact_phone: string
          created_at?: string
          id?: number
          perk_customer_name?: string | null
          perk_customer_nif?: string | null
          perk_description: string
          perk_images?: string[] | null
          perk_is_portuguese_owned?: boolean
          perk_logo?: string | null
          perk_needs_nif?: boolean
          perk_redemption_details: string
          perk_redemption_method: string
          perk_title: string
          status?: Database["public"]["Enums"]["submission_status"]
          stripe_order_id?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_type?: string
          business_category?: string
          business_instagram?: string | null
          business_name?: string
          business_neighborhood?: string
          business_website?: string | null
          contact_email?: string
          contact_name?: string
          contact_phone?: string
          created_at?: string
          id?: number
          perk_customer_name?: string | null
          perk_customer_nif?: string | null
          perk_description?: string
          perk_images?: string[] | null
          perk_is_portuguese_owned?: boolean
          perk_logo?: string | null
          perk_needs_nif?: boolean
          perk_redemption_details?: string
          perk_redemption_method?: string
          perk_title?: string
          status?: Database["public"]["Enums"]["submission_status"]
          stripe_order_id?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_submissions_stripe_order_id_fkey"
            columns: ["stripe_order_id"]
            isOneToOne: false
            referencedRelation: "stripe_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      payouts: {
        Row: {
          accountant_id: string
          amount: number
          appointment_id: number | null
          bank_details_snapshot: Json | null
          completed_at: string | null
          created_at: string
          currency: string
          failed_at: string | null
          failure_reason: string | null
          id: number
          initiated_at: string | null
          initiated_by: string | null
          notes: string | null
          payout_method: Database["public"]["Enums"]["payout_method"]
          payout_reference: string | null
          status: Database["public"]["Enums"]["payout_status"]
          updated_at: string
        }
        Insert: {
          accountant_id: string
          amount: number
          appointment_id?: number | null
          bank_details_snapshot?: Json | null
          completed_at?: string | null
          created_at?: string
          currency?: string
          failed_at?: string | null
          failure_reason?: string | null
          id?: never
          initiated_at?: string | null
          initiated_by?: string | null
          notes?: string | null
          payout_method: Database["public"]["Enums"]["payout_method"]
          payout_reference?: string | null
          status?: Database["public"]["Enums"]["payout_status"]
          updated_at?: string
        }
        Update: {
          accountant_id?: string
          amount?: number
          appointment_id?: number | null
          bank_details_snapshot?: Json | null
          completed_at?: string | null
          created_at?: string
          currency?: string
          failed_at?: string | null
          failure_reason?: string | null
          id?: never
          initiated_at?: string | null
          initiated_by?: string | null
          notes?: string | null
          payout_method?: Database["public"]["Enums"]["payout_method"]
          payout_reference?: string | null
          status?: Database["public"]["Enums"]["payout_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payouts_accountant_id_fkey"
            columns: ["accountant_id"]
            isOneToOne: false
            referencedRelation: "accountant_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payouts_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      project_changelog: {
        Row: {
          affected_files: string[] | null
          category: string
          created_at: string
          created_by: string | null
          date: string
          details: string | null
          id: string
          is_public: boolean
          migration_files: string[] | null
          post_to_telegram: boolean
          pr_number: string | null
          telegram_image_url: string | null
          title: string
          version: string | null
        }
        Insert: {
          affected_files?: string[] | null
          category: string
          created_at?: string
          created_by?: string | null
          date?: string
          details?: string | null
          id?: string
          is_public?: boolean
          migration_files?: string[] | null
          post_to_telegram?: boolean
          pr_number?: string | null
          telegram_image_url?: string | null
          title: string
          version?: string | null
        }
        Update: {
          affected_files?: string[] | null
          category?: string
          created_at?: string
          created_by?: string | null
          date?: string
          details?: string | null
          id?: string
          is_public?: boolean
          migration_files?: string[] | null
          post_to_telegram?: boolean
          pr_number?: string | null
          telegram_image_url?: string | null
          title?: string
          version?: string | null
        }
        Relationships: []
      }
      regulatory_alerts: {
        Row: {
          content_drafted: boolean
          created_at: string
          detected_at: string | null
          id: string
          monitor_id: string | null
          notes: string | null
          raw_payload: Json | null
          rule: string | null
          source_url: string | null
          status: string
          summary: string | null
          topic: string | null
        }
        Insert: {
          content_drafted?: boolean
          created_at?: string
          detected_at?: string | null
          id?: string
          monitor_id?: string | null
          notes?: string | null
          raw_payload?: Json | null
          rule?: string | null
          source_url?: string | null
          status?: string
          summary?: string | null
          topic?: string | null
        }
        Update: {
          content_drafted?: boolean
          created_at?: string
          detected_at?: string | null
          id?: string
          monitor_id?: string | null
          notes?: string | null
          raw_payload?: Json | null
          rule?: string | null
          source_url?: string | null
          status?: string
          summary?: string | null
          topic?: string | null
        }
        Relationships: []
      }
      resend_email_events: {
        Row: {
          created_at: string
          email_id: string | null
          event_type: string
          from_email: string | null
          id: string
          payload: Json | null
          subject: string | null
          to_email: string | null
        }
        Insert: {
          created_at?: string
          email_id?: string | null
          event_type: string
          from_email?: string | null
          id?: string
          payload?: Json | null
          subject?: string | null
          to_email?: string | null
        }
        Update: {
          created_at?: string
          email_id?: string | null
          event_type?: string
          from_email?: string | null
          id?: string
          payload?: Json | null
          subject?: string | null
          to_email?: string | null
        }
        Relationships: []
      }
      stripe_customers: {
        Row: {
          created_at: string | null
          customer_id: string
          deleted_at: string | null
          id: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          deleted_at?: string | null
          id?: never
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          deleted_at?: string | null
          id?: never
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      stripe_orders: {
        Row: {
          amount_subtotal: number
          amount_total: number
          checkout_session_id: string
          created_at: string | null
          currency: string
          customer_id: string
          deleted_at: string | null
          id: number
          payment_intent_id: string
          payment_status: string
          status: Database["public"]["Enums"]["stripe_order_status"]
          updated_at: string | null
        }
        Insert: {
          amount_subtotal: number
          amount_total: number
          checkout_session_id: string
          created_at?: string | null
          currency: string
          customer_id: string
          deleted_at?: string | null
          id?: never
          payment_intent_id: string
          payment_status: string
          status?: Database["public"]["Enums"]["stripe_order_status"]
          updated_at?: string | null
        }
        Update: {
          amount_subtotal?: number
          amount_total?: number
          checkout_session_id?: string
          created_at?: string | null
          currency?: string
          customer_id?: string
          deleted_at?: string | null
          id?: never
          payment_intent_id?: string
          payment_status?: string
          status?: Database["public"]["Enums"]["stripe_order_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_stripe_orders_customer_id"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "stripe_customers"
            referencedColumns: ["customer_id"]
          },
        ]
      }
      stripe_subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string | null
          current_period_end: number | null
          current_period_start: number | null
          customer_id: string
          deleted_at: string | null
          id: number
          payment_method_brand: string | null
          payment_method_last4: string | null
          price_id: string | null
          status: Database["public"]["Enums"]["stripe_subscription_status"]
          subscription_id: string | null
          updated_at: string | null
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: number | null
          current_period_start?: number | null
          customer_id: string
          deleted_at?: string | null
          id?: never
          payment_method_brand?: string | null
          payment_method_last4?: string | null
          price_id?: string | null
          status: Database["public"]["Enums"]["stripe_subscription_status"]
          subscription_id?: string | null
          updated_at?: string | null
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: number | null
          current_period_start?: number | null
          customer_id?: string
          deleted_at?: string | null
          id?: never
          payment_method_brand?: string | null
          payment_method_last4?: string | null
          price_id?: string | null
          status?: Database["public"]["Enums"]["stripe_subscription_status"]
          subscription_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_stripe_subscriptions_customer_id"
            columns: ["customer_id"]
            isOneToOne: true
            referencedRelation: "stripe_customers"
            referencedColumns: ["customer_id"]
          },
        ]
      }
      tax_checkup_leads: {
        Row: {
          activity_opened: boolean | null
          compliance_report: string | null
          compliance_score_green: number | null
          compliance_score_red: number | null
          compliance_score_yellow: number | null
          converted_at: string | null
          converted_to_intake_id: number | null
          created_at: string
          email: string
          email_hash: string
          email_marketing_consent: boolean | null
          estimated_annual_income: string
          first_submission_at: string | null
          has_fiscal_representative: boolean | null
          has_nif: boolean | null
          has_niss: boolean | null
          has_vat_number: boolean | null
          id: number
          interested_in_accounting_services: boolean | null
          is_latest_submission: boolean | null
          lead_quality_score: number | null
          months_in_portugal: number
          name: string | null
          notes: string | null
          phone: string | null
          previous_submission_id: number | null
          residency_status: string | null
          status: string
          submission_sequence: number | null
          updated_at: string
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
          work_type: string
        }
        Insert: {
          activity_opened?: boolean | null
          compliance_report?: string | null
          compliance_score_green?: number | null
          compliance_score_red?: number | null
          compliance_score_yellow?: number | null
          converted_at?: string | null
          converted_to_intake_id?: number | null
          created_at?: string
          email: string
          email_hash: string
          email_marketing_consent?: boolean | null
          estimated_annual_income: string
          first_submission_at?: string | null
          has_fiscal_representative?: boolean | null
          has_nif?: boolean | null
          has_niss?: boolean | null
          has_vat_number?: boolean | null
          id?: never
          interested_in_accounting_services?: boolean | null
          is_latest_submission?: boolean | null
          lead_quality_score?: number | null
          months_in_portugal: number
          name?: string | null
          notes?: string | null
          phone?: string | null
          previous_submission_id?: number | null
          residency_status?: string | null
          status?: string
          submission_sequence?: number | null
          updated_at?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          work_type: string
        }
        Update: {
          activity_opened?: boolean | null
          compliance_report?: string | null
          compliance_score_green?: number | null
          compliance_score_red?: number | null
          compliance_score_yellow?: number | null
          converted_at?: string | null
          converted_to_intake_id?: number | null
          created_at?: string
          email?: string
          email_hash?: string
          email_marketing_consent?: boolean | null
          estimated_annual_income?: string
          first_submission_at?: string | null
          has_fiscal_representative?: boolean | null
          has_nif?: boolean | null
          has_niss?: boolean | null
          has_vat_number?: boolean | null
          id?: never
          interested_in_accounting_services?: boolean | null
          is_latest_submission?: boolean | null
          lead_quality_score?: number | null
          months_in_portugal?: number
          name?: string | null
          notes?: string | null
          phone?: string | null
          previous_submission_id?: number | null
          residency_status?: string | null
          status?: string
          submission_sequence?: number | null
          updated_at?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          work_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "tax_checkup_leads_converted_to_intake_fkey"
            columns: ["converted_to_intake_id"]
            isOneToOne: false
            referencedRelation: "accounting_intakes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tax_checkup_leads_previous_submission_fkey"
            columns: ["previous_submission_id"]
            isOneToOne: false
            referencedRelation: "tax_checkup_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          created_at: string | null
          display_name: string | null
          has_paid_compliance_review: boolean | null
          id: string
          paid_compliance_review_id: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_name?: string | null
          has_paid_compliance_review?: boolean | null
          id: string
          paid_compliance_review_id?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_name?: string | null
          has_paid_compliance_review?: boolean | null
          id?: string
          paid_compliance_review_id?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_paid_compliance_review_id_fkey"
            columns: ["paid_compliance_review_id"]
            isOneToOne: false
            referencedRelation: "paid_compliance_reviews"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_stalled_ai_research: { Args: never; Returns: undefined }
      generate_email_hash: { Args: { email_input: string }; Returns: string }
      get_all_accountant_profiles: {
        Args: never
        Returns: {
          average_rating: number | null
          bank_account_name: string | null
          bank_bic: string | null
          bank_iban: string | null
          bio: string | null
          cal_api_key: string | null
          cal_link: string | null
          certifications: Json | null
          commission_rate: number
          created_at: string
          email: string
          full_name: string
          id: string
          languages: string[] | null
          minimum_monthly_guarantee: number | null
          phone: string | null
          preferred_payout_method:
            | Database["public"]["Enums"]["payout_method"]
            | null
          profile_picture_url: string | null
          specializations: string[] | null
          status: Database["public"]["Enums"]["accountant_status"]
          tax_id: string | null
          timezone: string | null
          total_consultations: number | null
          total_earnings: number | null
          updated_at: string
        }[]
        SetofOptions: {
          from: "*"
          to: "accountant_profiles"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_all_accounting_intakes: {
        Args: never
        Returns: {
          accounting_software: string | null
          activity_code: string | null
          activity_date: string | null
          activity_opened: boolean | null
          biggest_worry: string | null
          came_from_checkup_id: number | null
          city: string | null
          claimed_at: string | null
          claimed_by: string | null
          compliance_report: string | null
          compliance_score_green: number | null
          compliance_score_red: number | null
          compliance_score_yellow: number | null
          country: string | null
          created_at: string
          days_in_portugal: number | null
          email: string
          email_marketing_consent: boolean | null
          estimated_annual_income: string | null
          files: Json | null
          first_submission_at: string | null
          has_electronic_notifications: boolean | null
          has_fiscal_representative: boolean | null
          has_iban: boolean | null
          has_nif: boolean | null
          has_niss: boolean | null
          has_vat_number: boolean | null
          iban_number: string | null
          id: number
          income_sources: Json | null
          is_latest_submission: boolean | null
          last_step_reached: number | null
          lead_email_hash: string
          lead_quality_score: number | null
          months_in_portugal: number | null
          name: string
          nif_number: string | null
          niss_number: string | null
          phone: string | null
          previous_accountant: boolean | null
          previous_submission_id: number | null
          residency_status: string | null
          source_type: string | null
          special_notes: string | null
          status: string
          submission_sequence: number | null
          tags: Json | null
          updated_at: string
          urgency_level: string
          user_id: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
          vat_regime: string | null
          work_type: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "accounting_intakes"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_all_applications: {
        Args: never
        Returns: {
          accepts_triage_role: string | null
          admin_notes: string | null
          availability: string | null
          bio: string | null
          created_at: string
          current_freelancer_clients: string | null
          email: string
          english_fluency: string | null
          experience_years: number | null
          foreign_client_percentage: string | null
          full_name: string
          has_occ: boolean | null
          id: number
          linkedin_url: string | null
          occ_number: string | null
          partnership_interest_level: string | null
          phone: string | null
          portuguese_fluency: string | null
          preferred_communication: string | null
          resume_path: string | null
          resume_url: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          specializations: string[] | null
          status: Database["public"]["Enums"]["application_status"]
          updated_at: string
          vat_scenario_answer: string | null
          website_url: string | null
          why_worktugal: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "accountant_applications"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_all_appointments: {
        Args: never
        Returns: {
          accountant_id: string | null
          accountant_payout_amount: number | null
          booking_id: number | null
          cal_attendees: Json | null
          cal_booking_uid: string | null
          cal_event_id: string | null
          cal_event_uid: string | null
          cal_metadata: Json | null
          cal_reschedule_uid: string | null
          cal_webhook_received_at: string | null
          client_approved_at: string | null
          client_feedback: string | null
          client_id: string
          client_notes: string | null
          client_rating: number | null
          consult_booking_id: number | null
          consultation_completed_at: string | null
          consultation_started_at: string | null
          created_at: string
          duration_minutes: number | null
          escrow_hold_until: string | null
          id: number
          meeting_notes: string | null
          meeting_url: string | null
          outcome_document_url: string | null
          outcome_submitted_at: string | null
          payment_amount: number | null
          platform_fee_amount: number | null
          preferred_date: string | null
          scheduled_date: string | null
          service_type: string
          status: Database["public"]["Enums"]["appointment_status"]
          stripe_payment_intent_id: string | null
          updated_at: string
        }[]
        SetofOptions: {
          from: "*"
          to: "appointments"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_all_contact_requests: {
        Args: never
        Returns: {
          budget_range: string | null
          company_name: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          message: string | null
          notes: string | null
          priority: string | null
          purpose: string
          replied_at: string | null
          status: string | null
          timeline: string | null
          webhook_sent: boolean | null
          webhook_sent_at: string | null
          website_url: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "contact_requests"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_all_payouts: {
        Args: never
        Returns: {
          accountant_id: string
          amount: number
          appointment_id: number | null
          bank_details_snapshot: Json | null
          completed_at: string | null
          created_at: string
          currency: string
          failed_at: string | null
          failure_reason: string | null
          id: number
          initiated_at: string | null
          initiated_by: string | null
          notes: string | null
          payout_method: Database["public"]["Enums"]["payout_method"]
          payout_reference: string | null
          status: Database["public"]["Enums"]["payout_status"]
          updated_at: string
        }[]
        SetofOptions: {
          from: "*"
          to: "payouts"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_flag_accuracy_stats:
        | {
            Args: never
            Returns: {
              accuracy_rate: number
              accurate_count: number
              flag_id: string
              flag_name: string
              inaccurate_count: number
              total_feedback: number
            }[]
          }
        | {
            Args: { p_flag_id: string }
            Returns: {
              accuracy_percentage: number
              flag_id: string
              helpful_count: number
              not_helpful_count: number
              total_feedback: number
            }[]
          }
      get_review_by_token: {
        Args: { token: string }
        Returns: {
          access_token: string
          admin_notes: string | null
          ai_draft_report: string | null
          ai_research_results: Json | null
          ai_research_status: string | null
          ai_researched_at: string | null
          ambiguity_score: number | null
          created_at: string | null
          customer_email: string
          customer_name: string | null
          escalation_flags: Json | null
          form_data: Json | null
          form_progress: Json | null
          id: string
          review_delivered_at: string | null
          status: string
          stripe_payment_intent_id: string | null
          stripe_session_id: string
          updated_at: string | null
          user_id: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "paid_compliance_reviews"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_user_by_email: {
        Args: { user_email: string }
        Returns: {
          email: string
          id: string
        }[]
      }
      is_admin:
        | { Args: never; Returns: boolean }
        | { Args: { user_id: string }; Returns: boolean }
      match_memories: {
        Args: {
          filter_project?: string
          match_count?: number
          match_threshold?: number
          query_embedding: string
        }
        Returns: {
          content: string
          id: string
          metadata: Json
          project: string
          similarity: number
          tags: string[]
        }[]
      }
      update_review_by_token: {
        Args: {
          new_ambiguity_score?: number
          new_escalation_flags?: Json
          new_form_data: Json
          new_form_progress: Json
          new_status?: string
          token: string
        }
        Returns: {
          access_token: string
          admin_notes: string | null
          ai_draft_report: string | null
          ai_research_results: Json | null
          ai_research_status: string | null
          ai_researched_at: string | null
          ambiguity_score: number | null
          created_at: string | null
          customer_email: string
          customer_name: string | null
          escalation_flags: Json | null
          form_data: Json | null
          form_progress: Json | null
          id: string
          review_delivered_at: string | null
          status: string
          stripe_payment_intent_id: string | null
          stripe_session_id: string
          updated_at: string | null
          user_id: string | null
        }
        SetofOptions: {
          from: "*"
          to: "paid_compliance_reviews"
          isOneToOne: true
          isSetofReturn: false
        }
      }
    }
    Enums: {
      accountant_status:
        | "active"
        | "inactive"
        | "pending_approval"
        | "suspended"
      application_status:
        | "pending"
        | "reviewing"
        | "interview_scheduled"
        | "accepted"
        | "rejected"
      appointment_status:
        | "scheduled"
        | "completed"
        | "cancelled"
        | "no_show"
        | "rescheduled"
        | "pending_assignment"
      dispute_status:
        | "open"
        | "investigating"
        | "resolved_refund"
        | "resolved_no_refund"
        | "closed"
      payout_method: "wise" | "revolut" | "stripe" | "sepa"
      payout_status: "pending" | "processing" | "completed" | "failed"
      stripe_order_status: "pending" | "completed" | "canceled"
      stripe_subscription_status:
        | "not_started"
        | "incomplete"
        | "incomplete_expired"
        | "trialing"
        | "active"
        | "past_due"
        | "canceled"
        | "unpaid"
        | "paused"
      submission_status:
        | "pending_payment"
        | "completed_payment"
        | "abandoned"
        | "approved"
        | "rejected"
      user_role: "user" | "partner" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      accountant_status: [
        "active",
        "inactive",
        "pending_approval",
        "suspended",
      ],
      application_status: [
        "pending",
        "reviewing",
        "interview_scheduled",
        "accepted",
        "rejected",
      ],
      appointment_status: [
        "scheduled",
        "completed",
        "cancelled",
        "no_show",
        "rescheduled",
        "pending_assignment",
      ],
      dispute_status: [
        "open",
        "investigating",
        "resolved_refund",
        "resolved_no_refund",
        "closed",
      ],
      payout_method: ["wise", "revolut", "stripe", "sepa"],
      payout_status: ["pending", "processing", "completed", "failed"],
      stripe_order_status: ["pending", "completed", "canceled"],
      stripe_subscription_status: [
        "not_started",
        "incomplete",
        "incomplete_expired",
        "trialing",
        "active",
        "past_due",
        "canceled",
        "unpaid",
        "paused",
      ],
      submission_status: [
        "pending_payment",
        "completed_payment",
        "abandoned",
        "approved",
        "rejected",
      ],
      user_role: ["user", "partner", "admin"],
    },
  },
} as const
A new version of Supabase CLI is available: v2.90.0 (currently installed v2.75.0)
We recommend updating regularly for new features and bug fixes: https://supabase.com/docs/guides/cli/getting-started#updating-the-supabase-cli
