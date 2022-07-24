-- Extension to get UUID:
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
SELECT uuid_generate_v4 ()