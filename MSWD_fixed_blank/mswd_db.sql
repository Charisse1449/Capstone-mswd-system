-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 27, 2026 at 12:16 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mswd_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `barangays`
--

CREATE TABLE `barangays` (
  `barangay_id` int(11) NOT NULL,
  `barangay_name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `barangays`
--

INSERT INTO `barangays` (`barangay_id`, `barangay_name`, `description`, `status`, `created_at`) VALUES
(1, 'Agay-ay', 'Agay-ay, San Juan, Southern Leyte', 'Active', '2026-06-26 08:10:55'),
(2, 'Basak', 'Basak, San Juan, Southern Leyte', 'Active', '2026-06-26 08:10:55'),
(3, 'Bobon A', 'Bobon A, San Juan, Southern Leyte', 'Active', '2026-06-26 08:10:55'),
(4, 'Bobon B', 'Bobon B, San Juan, Southern Leyte', 'Active', '2026-06-26 08:10:55'),
(5, 'Garrido', 'Garrido, San Juan, Southern Leyte', 'Active', '2026-06-26 08:10:55'),
(6, 'Minoyho', 'Minoyho, San Juan, Southern Leyte', 'Active', '2026-06-26 08:10:55'),
(7, 'Poblacion', 'Poblacion, San Juan, Southern Leyte', 'Active', '2026-06-26 08:10:55'),
(8, 'San Jose', 'San Jose, San Juan, Southern Leyte', 'Active', '2026-06-26 08:10:55'),
(9, 'Sua', 'Sua, San Juan, Southern Leyte', 'Active', '2026-06-26 08:10:55'),
(10, 'Timba', 'Timba, San Juan, Southern Leyte', 'Active', '2026-06-26 08:10:55');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `category_id` int(11) NOT NULL,
  `category_name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`category_id`, `category_name`, `description`, `status`, `created_at`) VALUES
(1, 'Indigent', 'Families with no regular source of income.', 'Active', '2026-06-26 08:10:55'),
(2, 'Senior Citizen', 'Residents who are 60 years old and above.', 'Active', '2026-06-26 08:10:55'),
(3, 'Person with Disability (PWD)', 'Residents with physical, mental, intellectual, or sensory impairments.', 'Active', '2026-06-26 08:10:55'),
(4, 'Solo Parent', 'Single parent who is the sole provider of the family.', 'Active', '2026-06-26 08:10:55'),
(5, 'Unemployed', 'Residents who are currently not employed.', 'Active', '2026-06-26 08:10:55');

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `permission_id` int(11) NOT NULL,
  `permission_name` varchar(100) NOT NULL,
  `module_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`permission_id`, `permission_name`, `module_name`) VALUES
(1, 'Dashboard', 'Dashboard'),
(2, 'Residents', 'Residents'),
(3, 'Beneficiaries', 'Beneficiaries'),
(4, 'Claims', 'Claims'),
(5, 'Reports', 'Reports'),
(6, 'Blockchain', 'Blockchain'),
(7, 'Master Data', 'Master Data'),
(8, 'User Management', 'User Management'),
(9, 'Audit Logs', 'Audit Logs'),
(10, 'Settings', 'Settings');

-- --------------------------------------------------------

--
-- Table structure for table `residents`
--

CREATE TABLE `residents` (
  `resident_id` int(11) NOT NULL,
  `resident_code` varchar(20) DEFAULT NULL,
  `first_name` varchar(100) NOT NULL,
  `middle_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) NOT NULL,
  `suffix` varchar(20) DEFAULT NULL,
  `sex` enum('Male','Female') NOT NULL,
  `birthdate` date DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `birthplace` varchar(255) DEFAULT NULL,
  `civil_status` varchar(50) DEFAULT NULL,
  `contact_number` varchar(30) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `barangay_id` int(11) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `educational_attainment` varchar(150) DEFAULT NULL,
  `occupation` varchar(150) DEFAULT NULL,
  `monthly_income` decimal(10,2) DEFAULT 0.00,
  `household_number` varchar(50) DEFAULT NULL,
  `type_of_beneficiary` varchar(100) DEFAULT NULL,
  `profile_photo` varchar(500) DEFAULT NULL,
  `fingerprint_status` enum('Not Enrolled','Enrolled') DEFAULT 'Not Enrolled',
  `family_composition_notes` text DEFAULT NULL,
  `problem_presented` text DEFAULT NULL,
  `brief_findings` text DEFAULT NULL,
  `recommendation` text DEFAULT NULL,
  `status` enum('Active','Inactive','Deactivated') DEFAULT 'Active',
  `intake_date` date DEFAULT NULL,
  `deactivated_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `residents`
--

INSERT INTO `residents` (`resident_id`, `resident_code`, `first_name`, `middle_name`, `last_name`, `suffix`, `sex`, `birthdate`, `age`, `birthplace`, `civil_status`, `contact_number`, `address`, `barangay_id`, `category_id`, `educational_attainment`, `occupation`, `monthly_income`, `household_number`, `type_of_beneficiary`, `profile_photo`, `fingerprint_status`, `family_composition_notes`, `problem_presented`, `brief_findings`, `recommendation`, `status`, `intake_date`, `deactivated_at`, `created_at`, `updated_at`) VALUES
(1, 'RES-0001', 'Leah', 'Bolasco', 'Ignacio', NULL, 'Female', '2003-09-16', 22, 'Maasin Hospital', 'Single', '09695160409', 'Purok 1, Brgy. Bobon A, San Juan, Southern Leyte', 3, 1, 'College Level', 'Student', 0.00, '002024', NULL, 'file:///C:/xampp/htdocs/MSWD_fixed_blank/resident-profile-photos/resident-1-1782546616755.jpg', 'Not Enrolled', '1. Beatriz B. Ignacio - Mother - 1978-10-02 - Age: 47 - Married - Elementary Graduate - Housewife\n2. Simeon B. Ignacio Jr. - Father - 1977-10-21 - Age: 48 - Married - Senior High School Graduate - School Guard', NULL, NULL, NULL, 'Active', '2026-06-26', NULL, '2026-06-26 11:13:03', '2026-06-27 07:50:16'),
(2, 'RES-0002', 'Irene Charisse', 'Divinagracia', 'Tolibas', NULL, 'Female', '2002-09-14', 23, 'Hinundayan', 'Single', '09752152346', 'Purok 2, Brgy. Agay-ay, San Juan, Southern Leyte', 1, 4, 'College Level', 'Student', 0.00, '002000', 'AICS', 'file:///C:/xampp/htdocs/MSWD_fixed_blank/resident-profile-photos/resident-2-1782547398151.jpg', 'Not Enrolled', '1. Arlen D. Tolibas - Mother - 1977-06-02 - Age: 49 - Married - College Level - Housewife\n2. Carlos D. Tolibas - Father - 1977-06-30 - Age: 48 - Married - College Level - Farmer', 'ajjauhwjdhwuhdjh', 'husyuhjdbjdhuh', 'xusyhdujhdj', 'Active', '2026-06-27', NULL, '2026-06-27 08:03:18', '2026-06-27 08:03:54'),
(3, 'RES-0003', 'Keren', NULL, 'Moines', NULL, 'Female', '2005-06-09', 21, 'Anahawan', 'Single', '09674532123', 'Purok 1, Brgy. San Jose, San Juan, Southern Leyte', 8, 3, 'Junior High School Level', 'None', 0.00, '009718', NULL, 'file:///C:/xampp/htdocs/MSWD_fixed_blank/resident-profile-photos/resident-3-1782547895361.jpg', 'Not Enrolled', '1. hhhhhh - hhhh - 1966-06-01 - Age: 60 - Married - Junior High School Graduate - kkkko', 'gggg', 'cccc', 'aaaaaaaaaaaaaa', 'Active', '2026-06-27', NULL, '2026-06-27 08:09:07', '2026-06-27 08:12:33'),
(4, 'RES-0004', 'Raniel', 'R', 'Fajardo', NULL, 'Male', '1965-06-03', 61, 'jajajaj', 'Widowed', '09675432162', 'Purok 1, Brgy. San Jose, San Juan, Southern Leyte', 8, 2, 'College Graduate', 'Retired Teacher', 0.00, 'u8778', NULL, 'file:///C:/xampp/htdocs/MSWD_fixed_blank/resident-profile-photos/resident-4-1782548926728.jpg', 'Not Enrolled', '1. rrrrrrr - rrrrrrrrr - 1999-08-08 - Age: 26 - Married - College Level - dsd', 'bb', 'bbbbbbb', 'bbbbbbb', 'Active', '2026-06-27', NULL, '2026-06-27 08:25:52', '2026-06-27 08:28:46'),
(5, 'RES-0005', 'tttttttt', 'ttttttttt', 'tttt', NULL, 'Female', '2000-06-10', 26, 'hhhhh', 'Married', '098776666666', 'Brgy. Select barangay, San Juan, Southern Leyte', NULL, 4, NULL, NULL, 0.00, NULL, NULL, NULL, 'Not Enrolled', NULL, NULL, NULL, NULL, 'Active', NULL, NULL, '2026-06-27 08:29:41', '2026-06-27 08:29:41'),
(6, 'RES-0006', 'Mark', 'Bhdhfjhfj', 'Caayohan', NULL, 'Male', '1999-06-18', 27, 'bbbbbb', 'Married', '09987878787', 'Purok 1, Brgy. Minoyho, San Juan, Southern Leyte', 6, 4, 'Junior High School Level', 'N/A', 0.00, '8881313`', 'Solo Parent Assistance', 'file:///C:/xampp/htdocs/MSWD_fixed_blank/resident-profile-photos/resident-6-1782550254474.jpg', 'Not Enrolled', '1. yyyyyyyy - yyyyyy - 1999-06-06 - Age: 27 - Married - College Level - nnnnn\n2. vvv - vvvv - 2000-07-07 - Age: 25 - Single - College Graduate - nnnnnnnnn', 'mmmm', 'b', 'bbb', 'Active', '2026-06-27', NULL, '2026-06-27 08:49:30', '2026-06-27 08:51:17'),
(7, 'RES-0007', 'iii', 'ii', 'iii', NULL, 'Male', '1966-06-06', 60, 'nnnnn', 'Widowed', '09877777777', 'ii1, Brgy. Basak, San Juan, Southern Leyte', 2, 2, 'Junior High School Level', 'nnn', 5000.00, '87878', 'Senior Citizen Assistance', 'file:///C:/xampp/htdocs/MSWD_fixed_blank/resident-profile-photos/resident-7-1782550644482.jpg', 'Not Enrolled', '1. nnn - nn - 1999-08-08 - Age: 26 - Married - Vocational / Technical - mmmm', 'nnnnnnnnnnnnnnn', 'nnnnnnnnn', 'nnnnnnnnnnnn', 'Active', '2026-06-27', NULL, '2026-06-27 08:57:24', '2026-06-27 08:57:24'),
(8, 'RES-0008', 'iiioioio', 'oiououou', 'iii', 'jr', 'Male', '1999-12-02', 26, 'iiiiiii', 'Married', '09775555555', 'oooooo, Brgy. Poblacion, San Juan, Southern Leyte', 7, 5, 'Senior High School Level', 'ooooo', 0.00, '9880', NULL, NULL, 'Not Enrolled', NULL, NULL, NULL, NULL, 'Active', '2026-06-27', NULL, '2026-06-27 08:58:40', '2026-06-27 08:58:40'),
(9, 'RES-0009', 'vvvv', 'vv', 'vvv', NULL, 'Male', '1999-09-09', 26, 'uuu1', 'Married', '09988888888', 'Brgy. Select barangay, San Juan, Southern Leyte', NULL, 1, NULL, NULL, 0.00, NULL, NULL, NULL, 'Not Enrolled', NULL, NULL, NULL, NULL, 'Active', NULL, NULL, '2026-06-27 08:59:19', '2026-06-27 08:59:19'),
(10, 'RES-0010', 'qqq', 'qq', 'qq', 'jr', 'Female', '1977-02-22', 49, 'nn', 'Married', '09767564554', 'Brgy. Select barangay, San Juan, Southern Leyte', NULL, 1, NULL, NULL, 0.00, NULL, NULL, NULL, 'Not Enrolled', NULL, NULL, NULL, NULL, 'Active', NULL, NULL, '2026-06-27 08:59:56', '2026-06-27 08:59:56'),
(11, 'RES-0011', 'tt', NULL, 'tt', NULL, 'Female', NULL, NULL, NULL, NULL, NULL, 'Brgy. Select barangay, San Juan, Southern Leyte', NULL, NULL, NULL, NULL, 0.00, NULL, NULL, NULL, 'Not Enrolled', NULL, NULL, NULL, NULL, 'Active', NULL, NULL, '2026-06-27 09:00:15', '2026-06-27 09:00:15'),
(12, 'RES-0012', 'hh', NULL, 'hh', NULL, 'Male', NULL, NULL, NULL, NULL, NULL, 'Brgy. Select barangay, San Juan, Southern Leyte', NULL, NULL, NULL, NULL, 0.00, NULL, NULL, NULL, 'Not Enrolled', NULL, NULL, NULL, NULL, 'Active', NULL, NULL, '2026-06-27 09:00:59', '2026-06-27 09:00:59'),
(13, 'RES-0013', 'yy', NULL, 'yy', NULL, 'Male', NULL, NULL, NULL, NULL, NULL, 'Brgy. Select barangay, San Juan, Southern Leyte', NULL, NULL, NULL, NULL, 0.00, NULL, NULL, 'file:///C:/xampp/htdocs/MSWD_fixed_blank/resident-profile-photos/resident-13-1782551281650.jpg', 'Not Enrolled', NULL, NULL, NULL, NULL, 'Active', NULL, NULL, '2026-06-27 09:08:01', '2026-06-27 09:08:01'),
(14, 'RES-0014', 'oo', NULL, 'oo', NULL, 'Male', NULL, NULL, NULL, NULL, NULL, 'Brgy. Select barangay, San Juan, Southern Leyte', NULL, NULL, NULL, NULL, 0.00, NULL, NULL, NULL, 'Not Enrolled', NULL, NULL, NULL, NULL, 'Active', NULL, NULL, '2026-06-27 09:08:30', '2026-06-27 09:08:30'),
(15, 'RES-0015', 'mm', NULL, 'll', NULL, 'Female', NULL, NULL, NULL, NULL, NULL, 'Brgy. Select barangay, San Juan, Southern Leyte', NULL, NULL, NULL, NULL, 0.00, NULL, NULL, NULL, 'Not Enrolled', NULL, NULL, NULL, NULL, 'Active', NULL, NULL, '2026-06-27 09:08:51', '2026-06-27 09:08:51'),
(16, 'RES-0016', 'pp', NULL, 'pp', NULL, 'Male', NULL, NULL, NULL, NULL, NULL, 'Brgy. Select barangay, San Juan, Southern Leyte', NULL, NULL, NULL, NULL, 0.00, NULL, NULL, NULL, 'Not Enrolled', NULL, NULL, NULL, NULL, 'Active', NULL, NULL, '2026-06-27 09:09:02', '2026-06-27 09:09:02'),
(17, 'RES-0017', 'b', NULL, 'bb', NULL, 'Male', NULL, NULL, NULL, NULL, NULL, 'Brgy. Select barangay, San Juan, Southern Leyte', NULL, NULL, NULL, NULL, 0.00, NULL, NULL, NULL, 'Not Enrolled', NULL, NULL, NULL, NULL, 'Active', NULL, NULL, '2026-06-27 09:09:13', '2026-06-27 09:09:13'),
(18, 'RES-0018', 'n', NULL, 'nnn', NULL, 'Female', NULL, NULL, NULL, NULL, NULL, 'Brgy. Select barangay, San Juan, Southern Leyte', NULL, NULL, NULL, NULL, 0.00, NULL, NULL, NULL, 'Not Enrolled', NULL, NULL, NULL, NULL, 'Active', NULL, NULL, '2026-06-27 09:09:25', '2026-06-27 09:09:25'),
(19, 'RES-0019', 'u', NULL, 'uu', NULL, 'Male', NULL, NULL, NULL, NULL, NULL, 'Brgy. Select barangay, San Juan, Southern Leyte', NULL, NULL, NULL, NULL, 0.00, NULL, NULL, NULL, 'Not Enrolled', NULL, NULL, NULL, NULL, 'Active', NULL, NULL, '2026-06-27 09:09:34', '2026-06-27 09:09:34'),
(20, 'RES-0020', 'uiui', NULL, 'oppop', NULL, 'Female', NULL, NULL, NULL, NULL, NULL, 'Brgy. Select barangay, San Juan, Southern Leyte', NULL, NULL, NULL, NULL, 0.00, NULL, NULL, 'file:///C:/xampp/htdocs/MSWD_fixed_blank/resident-profile-photos/resident-20-1782555263084.jpg', 'Not Enrolled', NULL, NULL, NULL, NULL, 'Active', NULL, NULL, '2026-06-27 10:13:56', '2026-06-27 10:14:23');

-- --------------------------------------------------------

--
-- Table structure for table `resident_family_members`
--

CREATE TABLE `resident_family_members` (
  `family_member_id` int(11) NOT NULL,
  `resident_id` int(11) NOT NULL,
  `full_name` varchar(150) NOT NULL,
  `relationship` varchar(100) DEFAULT NULL,
  `birthdate` date DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `civil_status` varchar(50) DEFAULT NULL,
  `educational_attainment` varchar(150) DEFAULT NULL,
  `occupation` varchar(150) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `resident_family_members`
--

INSERT INTO `resident_family_members` (`family_member_id`, `resident_id`, `full_name`, `relationship`, `birthdate`, `age`, `civil_status`, `educational_attainment`, `occupation`, `created_at`) VALUES
(13, 1, 'Beatriz B. Ignacio', 'Mother', '1978-10-02', 47, 'Married', 'Elementary Graduate', 'Housewife', '2026-06-27 07:50:16'),
(14, 1, 'Simeon B. Ignacio Jr.', 'Father', '1977-10-21', 48, 'Married', 'Senior High School Graduate', 'School Guard', '2026-06-27 07:50:16'),
(17, 2, 'Arlen D. Tolibas', 'Mother', '1977-06-02', 49, 'Married', 'College Level', 'Housewife', '2026-06-27 08:03:54'),
(18, 2, 'Carlos D. Tolibas', 'Father', '1977-06-30', 48, 'Married', 'College Level', 'Farmer', '2026-06-27 08:03:54'),
(21, 3, 'hhhhhh', 'hhhh', '1966-06-01', 60, 'Married', 'Junior High School Graduate', 'kkkko', '2026-06-27 08:12:33'),
(23, 4, 'rrrrrrr', 'rrrrrrrrr', '1999-08-08', 26, 'Married', 'College Level', 'dsd', '2026-06-27 08:28:46'),
(28, 6, 'yyyyyyyy', 'yyyyyy', '1999-06-06', 27, 'Married', 'College Level', 'nnnnn', '2026-06-27 08:51:17'),
(29, 6, 'vvv', 'vvvv', '2000-07-07', 25, 'Single', 'College Graduate', 'nnnnnnnnn', '2026-06-27 08:51:17'),
(30, 7, 'nnn', 'nn', '1999-08-08', 26, 'Married', 'Vocational / Technical', 'mmmm', '2026-06-27 08:57:24');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `role_id` int(11) NOT NULL,
  `role_name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`role_id`, `role_name`, `description`, `status`, `created_at`) VALUES
(1, 'Super Admin', 'Has full access to all modules and settings.', 'Active', '2026-06-26 08:10:55'),
(2, 'Admin', 'Can manage users, settings, and records.', 'Active', '2026-06-26 08:10:55'),
(3, 'Social Worker', 'Can manage residents, beneficiaries, and claims.', 'Active', '2026-06-26 08:10:55'),
(4, 'Encoder', 'Can encode and update resident records.', 'Active', '2026-06-26 08:10:55'),
(5, 'Auditor', 'Can view reports, audit logs, and verify transactions.', 'Active', '2026-06-26 08:10:55');

-- --------------------------------------------------------

--
-- Table structure for table `role_permissions`
--

CREATE TABLE `role_permissions` (
  `role_permission_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `system_users`
--

CREATE TABLE `system_users` (
  `user_id` int(11) NOT NULL,
  `full_name` varchar(150) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role_id` int(11) DEFAULT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `system_users`
--

INSERT INTO `system_users` (`user_id`, `full_name`, `username`, `password`, `role_id`, `status`, `created_at`) VALUES
(1, 'Super Admin', 'admin', 'admin123', 1, 'Active', '2026-06-26 08:10:56');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `barangays`
--
ALTER TABLE `barangays`
  ADD PRIMARY KEY (`barangay_id`),
  ADD UNIQUE KEY `barangay_name` (`barangay_name`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`),
  ADD UNIQUE KEY `category_name` (`category_name`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`permission_id`),
  ADD UNIQUE KEY `permission_name` (`permission_name`);

--
-- Indexes for table `residents`
--
ALTER TABLE `residents`
  ADD PRIMARY KEY (`resident_id`),
  ADD UNIQUE KEY `resident_code` (`resident_code`),
  ADD KEY `fk_barangays` (`barangay_id`),
  ADD KEY `fk_categories` (`category_id`);

--
-- Indexes for table `resident_family_members`
--
ALTER TABLE `resident_family_members`
  ADD PRIMARY KEY (`family_member_id`),
  ADD KEY `fk_residents` (`resident_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`role_id`),
  ADD UNIQUE KEY `role_name` (`role_name`);

--
-- Indexes for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD PRIMARY KEY (`role_permission_id`),
  ADD KEY `role_id` (`role_id`),
  ADD KEY `permission_id` (`permission_id`);

--
-- Indexes for table `system_users`
--
ALTER TABLE `system_users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `role_id` (`role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `barangays`
--
ALTER TABLE `barangays`
  MODIFY `barangay_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `permission_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `residents`
--
ALTER TABLE `residents`
  MODIFY `resident_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `resident_family_members`
--
ALTER TABLE `resident_family_members`
  MODIFY `family_member_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `role_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `role_permissions`
--
ALTER TABLE `role_permissions`
  MODIFY `role_permission_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `system_users`
--
ALTER TABLE `system_users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `residents`
--
ALTER TABLE `residents`
  ADD CONSTRAINT `fk_barangays` FOREIGN KEY (`barangay_id`) REFERENCES `barangays` (`barangay_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_categories` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `resident_family_members`
--
ALTER TABLE `resident_family_members`
  ADD CONSTRAINT `fk_residents` FOREIGN KEY (`resident_id`) REFERENCES `residents` (`resident_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD CONSTRAINT `role_permissions_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_permissions_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`permission_id`) ON DELETE CASCADE;

--
-- Constraints for table `system_users`
--
ALTER TABLE `system_users`
  ADD CONSTRAINT `system_users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
