-- ============================================
-- Transcendence Database Initialization
-- ============================================

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE transcendence TO transcendence;

-- Log initialization
DO $$
BEGIN
  RAISE NOTICE '✅ Database transcendence initialized successfully!';
END $$;
