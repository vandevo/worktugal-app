```sql
ALTER TABLE public.partner_submissions
ADD COLUMN access_type TEXT DEFAULT 'lifetime' NOT NULL;

-- Optional: If you want to make it an ENUM type for stricter validation
-- First, create the ENUM type:
-- CREATE TYPE access_type_enum AS ENUM ('lifetime', 'subscription');
-- Then, alter the column to use the ENUM type:
-- ALTER TABLE public.partner_submissions
-- ALTER COLUMN access_type TYPE access_type_enum USING access_type::text::access_type_enum;
```