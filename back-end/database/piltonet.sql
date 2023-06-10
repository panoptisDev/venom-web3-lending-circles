-- waiting_list_emails
CREATE TABLE public.waiting_list_emails(
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP DEFAULT '0001-01-01'
);
CREATE UNIQUE INDEX waiting_list_emails_email_upper_idx ON public.waiting_list_emails (UPPER(email), deleted_at);

-- accounts
CREATE TABLE public.accounts(
  id BIGSERIAL PRIMARY KEY,
  account_address VARCHAR(100) NOT NULL,
  account_status VARCHAR(10) NOT NULL DEFAULT 'fresh', -- 'creating', 'main', 'waiting', 'linked'
  main_account_address VARCHAR(100) DEFAULT NULL,
  first_connect TIMESTAMP NOT NULL DEFAULT NOW(),
  last_connect TIMESTAMP NOT NULL DEFAULT NOW(),
  is_suspended BOOLEAN NOT NULL DEFAULT FALSE,
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP DEFAULT '0001-01-01',
  UNIQUE (account_address, deleted_at)
);

-- main_accounts
CREATE TABLE public.main_accounts(
  id BIGSERIAL PRIMARY KEY,
  main_account_address VARCHAR(100) NOT NULL,
  account_username VARCHAR(20) DEFAULT NULL,
  account_verified BOOLEAN NOT NULL DEFAULT FALSE,
  account_fullname VARCHAR(255) DEFAULT NULL,
  account_email VARCHAR(255) DEFAULT NULL,
  account_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  account_phone VARCHAR(20) DEFAULT NULL,
  account_phone_verified BOOLEAN NOT NULL DEFAULT FALSE,
  account_bio TEXT DEFAULT NULL,
  account_social_twitter VARCHAR(50) DEFAULT NULL,
  account_social_facebook VARCHAR(50) DEFAULT NULL,
  account_social_instagram VARCHAR(50) DEFAULT NULL,
  account_social_linkedin VARCHAR(50) DEFAULT NULL,
  account_social_telegram VARCHAR(50) DEFAULT NULL,
  account_image_url VARCHAR(255) DEFAULT NULL,
  account_cover_url VARCHAR(255) DEFAULT NULL,
  account_invite_code CHAR(6) DEFAULT NULL,
  account_invite_code_ed TIMESTAMP DEFAULT NULL,
  account_eula BOOLEAN NOT NULL DEFAULT FALSE,
  registered_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_login TIMESTAMP NOT NULL DEFAULT NOW(),
  is_suspended BOOLEAN NOT NULL DEFAULT FALSE,
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP DEFAULT '0001-01-01',
  UNIQUE (main_account_address, deleted_at),
  UNIQUE (account_invite_code)
);
CREATE UNIQUE INDEX account_username_upper_idx ON public.main_accounts (UPPER(account_username), deleted_at);

-- contacts
CREATE TABLE public.contacts(
  id BIGSERIAL PRIMARY KEY,
  contact_id CHAR(32) NOT NULL,
  main_account_address VARCHAR(100) NOT NULL,
  contact_account_address VARCHAR(100) NOT NULL,
  contact_trust_level BIGINT NOT NULL DEFAULT 0,
  contact_status VARCHAR(10) NOT NULL DEFAULT 'waiting', -- 'connected', 'rejected', 'blocked'
  is_suspended BOOLEAN NOT NULL DEFAULT FALSE,
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP DEFAULT '0001-01-01',
  UNIQUE (contact_id),
  UNIQUE (main_account_address, contact_account_address, deleted_at)
);

-- circles
-- CREATE TYPE CIRCLESTATUS AS ENUM ('deployed', 'setuped', 'launched', 'started', 'paused', 'stoped', 'completed');
CREATE TABLE public.circles(
  id BIGSERIAL PRIMARY KEY,
  circle_id VARCHAR(100) NOT NULL,
  circle_contract VARCHAR(50) DEFAULT NULL,
  circle_chain_id BIGINT NOT NULL DEFAULT 0,
  circle_payment_token VARCHAR(100) NOT NULL DEFAULT '0x0000000000000000000000000000000000000000',
  circle_creator VARCHAR(100) NOT NULL,
  circle_creator_main VARCHAR(100) NOT NULL,
  circle_creator_earnings DECIMAL(5,4) NOT NULL DEFAULT 0.0000,
  circle_round_days BIGINT NOT NULL DEFAULT 0,
  circle_payment_type VARCHAR(10) NOT NULL DEFAULT 'fixed_pay', -- 'fixed_loan'
  circle_service_charge DECIMAL(5,4) NOT NULL DEFAULT 0.0000,
  circle_service_address VARCHAR(100) DEFAULT NULL,
  circle_name VARCHAR(255) DEFAULT NULL,
  circle_fixed_amount NUMERIC NOT NULL DEFAULT 0,
  circle_min_members BIGINT NOT NULL DEFAULT 0,
  circle_max_members BIGINT NOT NULL DEFAULT 0,
  circle_winners_order VARCHAR(10) NOT NULL DEFAULT 'random', -- 'fixed', 'auction'
  circle_winners_number BIGINT NOT NULL DEFAULT 1,
  circle_patience_benefit DECIMAL(5,4) NOT NULL DEFAULT 0.0000,
  circle_insured BOOLEAN NOT NULL DEFAULT FALSE,
  circle_insurance_share DECIMAL(5,4) NOT NULL DEFAULT 0.0000,
  circle_insurance_address VARCHAR(100) DEFAULT NULL,
  circle_verified BOOLEAN NOT NULL DEFAULT FALSE,
  circle_start_date TIMESTAMP DEFAULT NULL,
  circle_status CIRCLESTATUS DEFAULT NULL,
  circle_deployed_at TIMESTAMP DEFAULT NULL,
  circle_launched_at TIMESTAMP DEFAULT NULL,
  circle_started_at TIMESTAMP DEFAULT NULL,
  is_suspended BOOLEAN NOT NULL DEFAULT FALSE,
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP DEFAULT '0001-01-01',
  UNIQUE (circle_id)
);

-- circles_whitelists
CREATE TABLE public.circles_whitelists(
  id BIGSERIAL PRIMARY KEY,
  circle_id VARCHAR(100) NOT NULL,
  whitelist_account_address VARCHAR(100) NOT NULL,
  whitelist_moderator_address VARCHAR(100) NOT NULL,
  whitelist_is_alive BOOLEAN NOT NULL DEFAULT FALSE,
  whitelist_is_joined BOOLEAN NOT NULL DEFAULT FALSE,
  whitelist_is_rejected BOOLEAN NOT NULL DEFAULT FALSE,
  is_suspended BOOLEAN NOT NULL DEFAULT FALSE,
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP DEFAULT '0001-01-01',
  UNIQUE (circle_id, whitelist_account_address, deleted_at)
);

-- circles_members
CREATE TABLE public.circles_members(
  id BIGSERIAL PRIMARY KEY,
  member_id CHAR(32) NOT NULL,
  circle_id VARCHAR(100) NOT NULL,
  main_account_address VARCHAR(100) NOT NULL,
  member_account_address VARCHAR(100) NOT NULL,
  member_is_moderator BOOLEAN NOT NULL DEFAULT FALSE,
  member_selected_round BIGINT NOT NULL DEFAULT 0,
  member_total_payments NUMERIC NOT NULL DEFAULT 0,
  member_loan_amount NUMERIC NOT NULL DEFAULT 0,
  member_status VARCHAR(10) NOT NULL DEFAULT 'joined', -- 'left', 'debtor'
  is_suspended BOOLEAN NOT NULL DEFAULT FALSE,
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP DEFAULT '0001-01-01',
  UNIQUE (member_id),
  UNIQUE (circle_id, member_account_address, deleted_at)
);
