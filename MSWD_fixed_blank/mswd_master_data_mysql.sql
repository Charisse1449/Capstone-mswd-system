CREATE DATABASE IF NOT EXISTS mswd_db;
USE mswd_db;

CREATE TABLE IF NOT EXISTS categories (
  category_id INT AUTO_INCREMENT PRIMARY KEY,
  category_name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  status ENUM('Active','Inactive') DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS barangays (
  barangay_id INT AUTO_INCREMENT PRIMARY KEY,
  barangay_name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  status ENUM('Active','Inactive') DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS roles (
  role_id INT AUTO_INCREMENT PRIMARY KEY,
  role_name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  status ENUM('Active','Inactive') DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS permissions (
  permission_id INT AUTO_INCREMENT PRIMARY KEY,
  permission_name VARCHAR(100) NOT NULL UNIQUE,
  module_name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS role_permissions (
  role_permission_id INT AUTO_INCREMENT PRIMARY KEY,
  role_id INT NOT NULL,
  permission_id INT NOT NULL,
  FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions(permission_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS system_users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role_id INT,
  status ENUM('Active','Inactive') DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE SET NULL
);

INSERT IGNORE INTO categories (category_name, description) VALUES
('Indigent','Families with no regular source of income.'),
('Senior Citizen','Residents who are 60 years old and above.'),
('Person with Disability (PWD)','Residents with physical, mental, intellectual, or sensory impairments.'),
('Solo Parent','Single parent who is the sole provider of the family.'),
('Unemployed','Residents who are currently not employed.');

INSERT IGNORE INTO barangays (barangay_name, description) VALUES
('Agay-ay','Agay-ay, San Juan, Southern Leyte'),
('Basak','Basak, San Juan, Southern Leyte'),
('Bobon A','Bobon A, San Juan, Southern Leyte'),
('Bobon B','Bobon B, San Juan, Southern Leyte'),
('Garrido','Garrido, San Juan, Southern Leyte'),
('Minoyho','Minoyho, San Juan, Southern Leyte'),
('Poblacion','Poblacion, San Juan, Southern Leyte'),
('San Jose','San Jose, San Juan, Southern Leyte'),
('Sua','Sua, San Juan, Southern Leyte'),
('Timba','Timba, San Juan, Southern Leyte');

INSERT IGNORE INTO roles (role_name, description) VALUES
('Super Admin','Has full access to all modules and settings.'),
('Admin','Can manage users, settings, and records.'),
('Social Worker','Can manage residents, beneficiaries, and claims.'),
('Encoder','Can encode and update resident records.'),
('Auditor','Can view reports, audit logs, and verify transactions.');

INSERT IGNORE INTO permissions (permission_name, module_name) VALUES
('Dashboard','Dashboard'),('Residents','Residents'),('Beneficiaries','Beneficiaries'),('Claims','Claims'),('Reports','Reports'),('Blockchain','Blockchain'),('Master Data','Master Data'),('User Management','User Management'),('Audit Logs','Audit Logs'),('Settings','Settings');

INSERT IGNORE INTO system_users (full_name, username, password, role_id)
SELECT 'Super Admin','admin','admin123', role_id FROM roles WHERE role_name='Super Admin';
