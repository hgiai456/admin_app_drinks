-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: mysql:3306
-- Generation Time: Jan 16, 2026 at 08:07 AM
-- Server version: 9.3.0
-- PHP Version: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_hgstore`
--

-- --------------------------------------------------------

--
-- Table structure for table `bannerdetails`
--

CREATE TABLE `bannerdetails` (
  `id` int NOT NULL,
  `product_id` int DEFAULT NULL,
  `banner_id` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `banners`
--

CREATE TABLE `banners` (
  `id` int NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `image` text,
  `status` int NOT NULL DEFAULT '0' COMMENT '0: Inactive, 1: Active, 2: Scheduled, 3: Expired',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `banners`
--

INSERT INTO `banners` (`id`, `name`, `image`, `status`, `createdAt`, `updatedAt`) VALUES
(5, 'Banner 1', 'https://firebasestorage.googleapis.com/v0/b/hg-store-a11c5.firebasestorage.app/o/images%2F1755156597619-Giftcard_webiste_banner_22_home_banner.png?alt=media&token=88a995d1-07c8-4a83-b9dd-6ce61e2aac82', 1, '2025-08-14 07:30:52', '2026-01-02 09:23:55'),
(6, 'Banner 2', 'https://firebasestorage.googleapis.com/v0/b/hg-store-a11c5.firebasestorage.app/o/images%2F1755156700848-HCO-7793-MILK-TEA-SOCIAL-WEB-BANNER-1440X460.jpg?alt=media&token=62a02038-1dfb-43e0-9242-4c5d741a3cf2', 1, '2025-08-14 07:32:04', '2025-08-14 07:32:04'),
(7, 'Banner 3', 'https://firebasestorage.googleapis.com/v0/b/hg-store-a11c5.firebasestorage.app/o/images%2F1755156670124-HCO-7788-MONTH-OF-VIETNAM-SOCIAL-website-lto.jpg?alt=media&token=2111a683-ac9f-4f3a-a70d-50cadf449941', 1, '2025-08-14 07:32:14', '2025-08-14 07:32:14'),
(8, 'Banner 4', 'https://firebasestorage.googleapis.com/v0/b/hg-store-a11c5.firebasestorage.app/o/images%2F1755156744386-HCO-7797-HIGHLANDS-REWARDS-WEB-BANNER_1.jpg?alt=media&token=6704d4ab-5028-4729-935e-69c1a57f682d', 1, '2025-08-14 07:32:40', '2025-08-14 07:32:40');

-- --------------------------------------------------------

--
-- Table structure for table `brands`
--

CREATE TABLE `brands` (
  `id` int NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `image` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `brands`
--

INSERT INTO `brands` (`id`, `name`, `image`, `createdAt`, `updatedAt`) VALUES
(1, 'HG coffee', 'https://firebasestorage.googleapis.com/v0/b/hg-store-a11c5.firebasestorage.app/o/images%2F1751092040674-logo.png?alt=media&token=4b72bf76-9c9c-4257-9290-808098ceac2f', '2025-06-28 05:59:02', '2025-06-28 06:28:57');

-- --------------------------------------------------------

--
-- Table structure for table `carts`
--

CREATE TABLE `carts` (
  `id` int NOT NULL,
  `session_id` varchar(255) DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `carts`
--

INSERT INTO `carts` (`id`, `session_id`, `user_id`, `created_at`, `updated_at`) VALUES
(18, NULL, 8, '2025-07-21 17:49:45', '2025-07-21 17:49:45'),
(33, '1753602035243', NULL, '2025-07-27 07:43:05', '2025-07-27 07:43:05'),
(34, '1753687397178', NULL, '2025-07-28 07:24:54', '2025-07-28 07:24:54'),
(35, '1753688162783', NULL, '2025-07-28 07:36:40', '2025-07-28 07:36:40'),
(37, '1753808827077', NULL, '2025-07-29 17:08:10', '2025-07-29 17:08:10'),
(38, '1753844820688', NULL, '2025-07-30 03:07:56', '2025-07-30 03:07:56'),
(46, '1755517420616', NULL, '2025-08-20 09:56:53', '2025-08-20 09:56:53'),
(48, 'alskdjlkasdjalks', NULL, '2025-08-21 07:43:43', '2025-08-21 07:43:43'),
(49, '1756025932932s2wbozuyx', NULL, '2025-08-24 09:15:50', '2025-08-24 09:15:50'),
(54, NULL, 14, '2025-09-30 07:03:02', '2025-09-30 07:03:02'),
(69, '1766659555005zy251ch21', NULL, '2025-12-25 10:45:55', '2025-12-25 10:45:55'),
(100, NULL, 17, '2026-01-02 08:58:03', '2026-01-02 08:58:03'),
(102, '1768037966290oxuqb0le2', NULL, '2026-01-10 09:39:26', '2026-01-10 09:39:26'),
(112, NULL, 9, '2026-01-14 16:41:26', '2026-01-14 16:41:26'),
(113, NULL, 15, '2026-01-15 05:24:34', '2026-01-15 05:24:34');

-- --------------------------------------------------------

--
-- Table structure for table `cart_items`
--

CREATE TABLE `cart_items` (
  `id` int NOT NULL,
  `cart_id` int NOT NULL,
  `product_detail_id` int DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `cart_items`
--

INSERT INTO `cart_items` (`id`, `cart_id`, `product_detail_id`, `quantity`, `created_at`, `updated_at`) VALUES
(59, 34, 7, 1, '2025-07-28 07:24:54', '2025-07-28 07:24:54'),
(60, 35, 12, 1, '2025-07-28 07:36:40', '2025-07-28 07:36:40'),
(62, 37, 8, 1, '2025-07-29 17:08:10', '2025-07-29 17:08:10'),
(160, 102, 12, 1, '2026-01-14 15:47:36', '2026-01-14 15:47:36'),
(162, 113, 12, 1, '2026-01-15 06:30:26', '2026-01-15 06:30:26'),
(163, 113, 7, 1, '2026-01-15 06:34:30', '2026-01-15 06:34:30'),
(164, 112, 12, 1, '2026-01-16 07:30:10', '2026-01-16 07:30:10');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `image` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `image`, `createdAt`, `updatedAt`) VALUES
(1, 'Cà phê', 'https://firebasestorage.googleapis.com/v0/b/hg-store-a11c5.firebasestorage.app/o/images%2F1751719896766-cat-coffee-no-bg.png?alt=media&token=42bbe709-3811-4d2c-95cd-94bbd5c99311', '2025-06-08 09:35:38', '2025-07-06 07:40:44'),
(2, 'Trà', 'https://firebasestorage.googleapis.com/v0/b/hg-store-a11c5.firebasestorage.app/o/images%2F1751719957775-cat-tea-no-bg.png?alt=media&token=de7805e1-90e3-4ede-a7ef-13447ff1d908', '2025-06-08 09:36:18', '2025-07-06 07:41:05'),
(3, 'Bánh mì', 'https://firebasestorage.googleapis.com/v0/b/hg-store-a11c5.firebasestorage.app/o/images%2F1751719857826-cat-bread-no-bg.png?alt=media&token=97af5c45-f021-48ce-bef3-deaae4f17996', '2025-06-08 09:36:49', '2025-07-06 07:41:43'),
(4, 'Đá xay', 'https://firebasestorage.googleapis.com/v0/b/hg-store-a11c5.firebasestorage.app/o/images%2F1751720044128-cat-freeza-no-bg.png?alt=media&token=c0d1f7d4-799a-4b33-8660-0279ec354c6b', '2025-06-08 09:37:09', '2025-07-06 07:43:19'),
(8, 'Latte', 'https://firebasestorage.googleapis.com/v0/b/hg-store-a11c5.firebasestorage.app/o/images%2F1751720374270-cat-latte-no-bg.png?alt=media&token=42e0d499-407f-42a3-984d-fba3bc88e2b9', '2025-06-28 07:03:59', '2025-07-05 12:59:57'),
(10, 'Trà sữa', 'https://firebasestorage.googleapis.com/v0/b/hg-store-a11c5.firebasestorage.app/o/images%2F1751720227870-milk-tea-no-bg.png?alt=media&token=090ccdf1-b628-4353-b769-990c87e1e20a', '2025-07-05 12:57:41', '2025-07-05 12:57:41');

-- --------------------------------------------------------

--
-- Table structure for table `feedbacks`
--

CREATE TABLE `feedbacks` (
  `id` int NOT NULL,
  `product_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `content` text,
  `star` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `media_library`
--

CREATE TABLE `media_library` (
  `id` int NOT NULL,
  `file_name` varchar(255) NOT NULL COMMENT 'Tên file gốc',
  `file_url` text NOT NULL COMMENT 'URL đầy đủ từ Firebase Storage',
  `file_size` int DEFAULT NULL COMMENT 'Kích thước file (bytes)',
  `mime_type` varchar(255) DEFAULT NULL COMMENT 'image/jpeg, image/png, etc.',
  `width` int DEFAULT NULL COMMENT 'Chiều rộng ảnh (px)',
  `height` int DEFAULT NULL COMMENT 'Chiều cao ảnh (px)',
  `uploaded_by` int DEFAULT NULL COMMENT 'User ID người upload',
  `usage_count` int DEFAULT '0' COMMENT 'Số lần ảnh được sử dụng',
  `tags` text COMMENT 'Tags để tìm kiếm (JSON array)',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `media_library`
--

INSERT INTO `media_library` (`id`, `file_name`, `file_url`, `file_size`, `mime_type`, `width`, `height`, `uploaded_by`, `usage_count`, `tags`, `createdAt`, `updatedAt`) VALUES
(4, 'matcha.png', 'https://firebasestorage.googleapis.com/v0/b/hg-store-a11c5.firebasestorage.app/o/media-library%2F1767765971080-matcha.png?alt=media&token=be5b2292-6654-4f27-a26c-528ca90e6016', 269748, 'image/png', 426, 515, 8, 0, '[]', '2026-01-07 06:06:15', '2026-01-07 06:06:15'),
(5, 'banh-mi-pate.png', 'https://firebasestorage.googleapis.com/v0/b/hg-store-a11c5.firebasestorage.app/o/media-library%2F1767859145030-banh-mi-pate.png?alt=media&token=8e44f72c-7618-4b7d-92a7-a5f47f4ffc01', 440825, 'image/png', 551, 501, 8, 0, '\"[]\"', '2026-01-08 07:59:10', '2026-01-08 07:59:10'),
(6, 'banh-mi-thit.png', 'https://firebasestorage.googleapis.com/v0/b/hg-store-a11c5.firebasestorage.app/o/media-library%2F1767859150476-banh-mi-thit.png?alt=media&token=0d766cf4-71bb-44be-a084-8667c6163a5f', 1117527, 'image/png', 834, 788, 8, 0, '\"[]\"', '2026-01-08 07:59:16', '2026-01-08 07:59:16'),
(7, 'trasua.jpg', 'https://firebasestorage.googleapis.com/v0/b/hg-store-a11c5.firebasestorage.app/o/media-library%2F1767859156662-trasua.jpg?alt=media&token=6b364a99-9428-42e6-8b0c-945454175f43', 49318, 'image/jpeg', 600, 670, 8, 0, '\"[]\"', '2026-01-08 07:59:17', '2026-01-08 07:59:17'),
(8, 'Iced-Hojicha-Latte-3625-III-a.jpg', 'https://firebasestorage.googleapis.com/v0/b/hg-store-a11c5.firebasestorage.app/o/media-library%2F1767864685210-Iced-Hojicha-Latte-3625-III-a.jpg?alt=media&token=8513ed7d-134e-45f2-8a35-008a8e20adff', 151278, 'image/jpeg', 1200, 1259, 8, 0, '\"[]\"', '2026-01-08 09:31:28', '2026-01-08 09:31:28'),
(9, 'matcha-latte.jpg', 'https://firebasestorage.googleapis.com/v0/b/hg-store-a11c5.firebasestorage.app/o/media-library%2F1767864688579-matcha-latte.jpg?alt=media&token=527cc98c-de34-4bdf-9fd3-2e2ee9d5ac36', 546715, 'image/jpeg', 1280, 1280, 8, 0, '\"[]\"', '2026-01-08 09:31:34', '2026-01-08 09:31:34'),
(10, 'ca-phe-da.jpg', 'https://firebasestorage.googleapis.com/v0/b/hg-store-a11c5.firebasestorage.app/o/media-library%2F1768021438236-ca-phe-da.jpg?alt=media&token=0c6e477d-cf5c-4696-b8cf-39a77803a05b', 48832, 'image/jpeg', 512, 512, 8, 0, '\"[]\"', '2026-01-10 05:03:59', '2026-01-10 05:03:59'),
(11, 'ca-phe-sua.jpg', 'https://firebasestorage.googleapis.com/v0/b/hg-store-a11c5.firebasestorage.app/o/media-library%2F1768021439576-ca-phe-sua.jpg?alt=media&token=37e49329-1e48-44e3-b3ea-b050986d2c43', 89109, 'image/jpeg', 1024, 800, 8, 0, '\"[]\"', '2026-01-10 05:04:01', '2026-01-10 05:04:01'),
(12, 'tra-dao-cam-xa.jpg', 'https://firebasestorage.googleapis.com/v0/b/hg-store-a11c5.firebasestorage.app/o/media-library%2F1768021441212-tra-dao-cam-xa.jpg?alt=media&token=9e524a9d-a277-442b-a925-e5a2cab48e21', 183855, 'image/jpeg', 1280, 1000, 8, 0, '\"[]\"', '2026-01-10 05:04:02', '2026-01-10 05:04:02'),
(13, 'tra-vai.webp', 'https://firebasestorage.googleapis.com/v0/b/hg-store-a11c5.firebasestorage.app/o/media-library%2F1768021442817-tra-vai.webp?alt=media&token=c3032391-f054-48cd-a81d-b80a9d52c05d', 48212, 'image/webp', 750, 750, 8, 0, '\"[]\"', '2026-01-10 05:04:03', '2026-01-10 05:04:03'),
(14, 'ca-pu-chia-no.jpg', 'https://firebasestorage.googleapis.com/v0/b/hg-store-a11c5.firebasestorage.app/o/media-library%2F1768022353425-ca-pu-chia-no.jpg?alt=media&token=1938bdda-4ea0-4b03-9bac-31cd1b9e9d1a', 57570, 'image/jpeg', 1200, 900, 8, 0, '\"[]\"', '2026-01-10 05:19:14', '2026-01-10 05:19:14'),
(15, 'Tra-sen-vang.webp', 'https://firebasestorage.googleapis.com/v0/b/hg-store-a11c5.firebasestorage.app/o/media-library%2F1768022354347-Tra-sen-vang.webp?alt=media&token=f17550e8-cdad-4cea-9097-067d22c6b6b2', 61523, 'image/webp', 800, 800, 8, 0, '\"[]\"', '2026-01-10 05:19:15', '2026-01-10 05:19:15'),
(16, 'tra-xanh-sua.webp', 'https://firebasestorage.googleapis.com/v0/b/hg-store-a11c5.firebasestorage.app/o/media-library%2F1768022355084-tra-xanh-sua.webp?alt=media&token=4fb9f6d1-fbc7-43b3-a65e-67f114387916', 93858, 'image/webp', 800, 800, 8, 0, '\"[]\"', '2026-01-10 05:19:16', '2026-01-10 05:19:16'),
(17, 'Screenshot 2026-01-10 170059.png', 'https://firebasestorage.googleapis.com/v0/b/hg-store-a11c5.firebasestorage.app/o/media-library%2F1768039427745-Screenshot%202026-01-10%20170059.png?alt=media&token=1a02cfdb-ceeb-411e-93ad-d91b123b2e42', 104814, 'image/png', 310, 354, 8, 0, '\"[]\"', '2026-01-10 10:03:49', '2026-01-10 10:03:49');

-- --------------------------------------------------------

--
-- Table structure for table `news`
--

CREATE TABLE `news` (
  `id` int NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `image` text,
  `content` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `news`
--

INSERT INTO `news` (`id`, `title`, `image`, `content`, `createdAt`, `updatedAt`) VALUES
(10, 'Cà Phê Phin – Hương vị truyền thống không bao giờ lỗi thời', 'https://firebasestorage.googleapis.com/v0/b/hg-store-a11c5.firebasestorage.app/o/media-library%2F1768021439576-ca-phe-sua.jpg?alt=media&token=37e49329-1e48-44e3-b3ea-b050986d2c43', '<p>Cà phê phin luôn là biểu tượng quen thuộc trong văn hóa thưởng thức cà phê của người Việt. Tại HG Coffee, từng giọt cà phê được chiết xuất chậm rãi từ hạt Robusta rang mộc, giữ trọn vị đậm đà và hương thơm tự nhiên.\\n\\nCà Phê Sữa là sự kết hợp hài hòa giữa cà phê phin đậm vị và sữa đặc béo ngọt, mang đến cảm giác cân bằng, dễ uống và đầy năng lượng. Trong khi đó, Cà Phê Đá lại chinh phục người uống bởi vị cà phê nguyên bản, mạnh mẽ và sảng khoái.\\n\\nDù là buổi sáng tỉnh táo hay những lúc cần tiếp thêm động lực trong ngày, cà phê phin HG Coffee luôn là lựa chọn đáng tin cậy.</p>', '2026-01-05 07:09:20', '2026-01-11 13:08:35'),
(11, 'Trà đào là món được ưu thích nhất HG Coffee', 'https://firebasestorage.googleapis.com/v0/b/hg-store-a11c5.firebasestorage.app/o/media-library%2F1768021441212-tra-dao-cam-xa.jpg?alt=media&token=9e524a9d-a277-442b-a925-e5a2cab48e21', '<p>Các dòng trà trái cây tại HG Coffee mang đến cảm giác thanh mát và dễ chịu, đặc biệt phù hợp cho những ngày nắng nóng. Trà Đào là sự kết hợp giữa vị trà dịu nhẹ và miếng đào giòn ngọt. Trà Sen Vàng lại nổi bật với hương sen bùi bùi, giúp thư giãn tinh thần. Trong khi đó, Trà Vải mang đến vị ngọt thanh tự nhiên và mùi thơm đặc trưng của trái vải tươi. Không chỉ ngon miệng, các dòng trà này còn là lựa chọn lý tưởng để giải nhiệt và nạp lại năng lượng cho cơ thể.</p>', '2026-01-05 07:12:49', '2026-01-11 13:01:10'),
(12, 'Trà Trái Cây – Giải nhiệt ngày hè theo cách nhẹ nhàng', 'https://firebasestorage.googleapis.com/v0/b/hg-store-a11c5.firebasestorage.app/o/media-library%2F1768021442817-tra-vai.webp?alt=media&token=c3032391-f054-48cd-a81d-b80a9d52c05d', '<p>Các dòng trà trái cây tại HG Coffee mang đến cảm giác thanh mát và dễ chịu, đặc biệt phù hợp cho những ngày nắng nóng. Trà Đào là sự kết hợp giữa vị trà dịu nhẹ và miếng đào giòn ngọt. Trà Sen Vàng lại nổi bật với hương sen bùi bùi, giúp thư giãn tinh thần. Trong khi đó, Trà Vải mang đến vị ngọt thanh tự nhiên và mùi thơm đặc trưng của trái vải tươi. Không chỉ ngon miệng, các dòng trà này còn là lựa chọn lý tưởng để giải nhiệt và nạp lại năng lượng cho cơ thể.</p>', '2026-01-05 07:22:30', '2026-01-11 13:00:05'),
(14, 'Matcha Latte – Nguồn năng lượng xanh giúp tỉnh táo và thư giãn', 'https://firebasestorage.googleapis.com/v0/b/hg-store-a11c5.firebasestorage.app/o/media-library%2F1767765971080-matcha.png?alt=media&token=be5b2292-6654-4f27-a26c-528ca90e6016', '<p>Matcha Latte là sự kết hợp giữa bột trà xanh matcha nguyên chất và sữa, tạo nên một thức uống. Không chỉ thơm ngon mà còn mang lại nhiều lợi ích cho sức khỏe. Matcha chứa hàm lượng chất chống oxy hóa cao, đặc biệt là EGCG, giúp làm chậm quá trình lão hóa và tăng cường hệ miễn dịch.</p><p><img src=\"https://firebasestorage.googleapis.com/v0/b/hg-store-a11c5.firebasestorage.app/o/media-library%2F1767765971080-matcha.png?alt=media&amp;token=be5b2292-6654-4f27-a26c-528ca90e6016\"></p><p>Không giống như cà phê, caffeine trong matcha được giải phóng từ từ, giúp cơ thể tỉnh táo lâu hơn mà. Không gây cảm giác bồn chồn. Ngoài ra, Matcha Latte còn giúp cải thiện khả năng tập trung, giảm căng thẳng và hỗ trợ quá trình đốt cháy mỡ thừa.</p><p><img src=\"https://firebasestorage.googleapis.com/v0/b/hg-store-a11c5.firebasestorage.app/o/media-library%2F1767864688579-matcha-latte.jpg?alt=media&amp;token=527cc98c-de34-4bdf-9fd3-2e2ee9d5ac36\"></p>', '2026-01-11 07:32:48', '2026-01-11 13:00:36');

-- --------------------------------------------------------

--
-- Table structure for table `newsdetails`
--

CREATE TABLE `newsdetails` (
  `id` int NOT NULL,
  `product_id` int DEFAULT NULL,
  `news_id` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `newsdetails`
--

INSERT INTO `newsdetails` (`id`, `product_id`, `news_id`, `createdAt`, `updatedAt`) VALUES
(38, 12, 12, '2026-01-05 07:22:30', '2026-01-05 07:22:30'),
(39, 5, 11, '2026-01-05 07:23:40', '2026-01-05 07:23:40'),
(41, 6, 14, '2026-01-11 07:32:48', '2026-01-11 07:32:48'),
(42, 5, 12, '2026-01-11 12:59:03', '2026-01-11 12:59:03'),
(43, 11, 11, '2026-01-11 12:59:42', '2026-01-11 12:59:42'),
(44, 12, 11, '2026-01-11 12:59:42', '2026-01-11 12:59:42'),
(45, 11, 12, '2026-01-11 13:00:05', '2026-01-11 13:00:05'),
(47, 1, 10, '2026-01-11 13:07:52', '2026-01-11 13:07:52'),
(48, 4, 10, '2026-01-11 13:07:52', '2026-01-11 13:07:52');

-- --------------------------------------------------------

--
-- Table structure for table `orderdetails`
--

CREATE TABLE `orderdetails` (
  `id` int NOT NULL,
  `order_id` int DEFAULT NULL,
  `product_detail_id` int DEFAULT NULL,
  `price` int DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `orderdetails`
--

INSERT INTO `orderdetails` (`id`, `order_id`, `product_detail_id`, `price`, `quantity`, `created_at`, `updated_at`) VALUES
(1, 4, 2, 30000, 5, '2025-07-04 16:23:39', '2025-07-04 16:23:39'),
(2, 4, 3, 30000, 5, '2025-07-04 16:23:39', '2025-07-04 16:23:39'),
(3, 5, 2, 30000, 5, '2025-07-04 16:52:31', '2025-07-04 16:52:31'),
(4, 6, 2, 30000, 5, '2025-07-08 11:49:29', '2025-07-08 11:49:29'),
(5, 6, 3, 30000, 5, '2025-07-08 11:49:29', '2025-07-08 11:49:29'),
(6, 7, 3, 30000, 5, '2025-07-10 03:54:17', '2025-07-10 03:54:17'),
(7, 7, 2, 30000, 5, '2025-07-10 03:54:17', '2025-07-10 03:54:17'),
(8, 8, 3, 30000, 5, '2025-07-17 05:07:33', '2025-07-17 05:07:33'),
(9, 11, 3, 30000, 5, '2025-07-18 07:59:44', '2025-07-18 07:59:44'),
(10, 11, 2, 30000, 5, '2025-07-18 07:59:44', '2025-07-18 07:59:44'),
(11, 12, 3, 30000, 5, '2025-07-18 08:03:02', '2025-07-18 08:03:02'),
(12, 13, 3, 30000, 5, '2025-07-24 16:19:30', '2025-07-24 16:19:30'),
(13, 13, 7, 25000, 5, '2025-07-24 16:19:30', '2025-07-24 16:19:30'),
(14, 14, 7, 25000, 5, '2025-07-25 07:34:03', '2025-07-25 07:34:03'),
(15, 14, 8, 35000, 5, '2025-07-25 07:34:03', '2025-07-25 07:34:03'),
(16, 15, 8, 35000, 5, '2025-07-25 07:43:03', '2025-07-25 07:43:03'),
(17, 16, 8, 35000, 5, '2025-07-25 07:44:32', '2025-07-25 07:44:32'),
(18, 17, 8, 35000, 5, '2025-07-25 12:39:02', '2025-07-25 12:39:02'),
(19, 17, 10, 20000, 5, '2025-07-25 12:39:02', '2025-07-25 12:39:02'),
(20, 18, 10, 20000, 5, '2025-07-25 12:42:15', '2025-07-25 12:42:15'),
(21, 18, 11, 25000, 5, '2025-07-25 12:42:15', '2025-07-25 12:42:15'),
(22, 19, 11, 25000, 5, '2025-07-25 12:48:21', '2025-07-25 12:48:21'),
(23, 19, 10, 20000, 5, '2025-07-25 12:48:21', '2025-07-25 12:48:21'),
(24, 20, 10, 20000, 5, '2025-07-25 12:55:05', '2025-07-25 12:55:05'),
(25, 20, 11, 25000, 5, '2025-07-25 12:55:05', '2025-07-25 12:55:05'),
(26, 21, 11, 25000, 5, '2025-07-25 12:56:49', '2025-07-25 12:56:49'),
(27, 22, 11, 25000, 5, '2025-07-25 12:58:14', '2025-07-25 12:58:14'),
(28, 23, 11, 25000, 5, '2025-07-25 13:00:12', '2025-07-25 13:00:12'),
(29, 23, 9, 35000, 5, '2025-07-25 13:00:12', '2025-07-25 13:00:12'),
(30, 24, 12, 30000, 1, '2025-07-27 06:23:23', '2025-07-27 06:23:23'),
(31, 24, 10, 20000, 1, '2025-07-27 06:23:23', '2025-07-27 06:23:23'),
(32, 25, 12, 30000, 1, '2025-07-27 06:32:25', '2025-07-27 06:32:25'),
(33, 25, 34, 25000, 1, '2025-07-27 06:32:25', '2025-07-27 06:32:25'),
(34, 26, 7, 25000, 1, '2025-07-29 17:00:43', '2025-07-29 17:00:43'),
(35, 27, 34, 25000, 4, '2025-08-26 09:17:47', '2025-08-26 09:17:47'),
(36, 28, 12, 30000, 1, '2025-08-26 09:21:07', '2025-08-26 09:21:07'),
(37, 29, 35, 30000, 2, '2025-09-30 07:02:59', '2025-09-30 07:02:59'),
(38, 30, 9, 35000, 1, '2025-12-10 07:45:51', '2025-12-10 07:45:51'),
(39, 30, 6, 40000, 1, '2025-12-10 07:45:51', '2025-12-10 07:45:51'),
(40, 31, 7, 25000, 1, '2025-12-22 09:32:01', '2025-12-22 09:32:01'),
(41, 32, 35, 30000, 1, '2025-12-22 09:36:57', '2025-12-22 09:36:57'),
(42, 32, 25, 32000, 1, '2025-12-22 09:36:57', '2025-12-22 09:36:57'),
(43, 33, 35, 30000, 1, '2025-12-23 07:29:27', '2025-12-23 07:29:27'),
(44, 33, 38, 29000, 1, '2025-12-23 07:29:27', '2025-12-23 07:29:27'),
(46, 35, 34, 25000, 3, '2025-12-25 08:34:53', '2025-12-25 08:34:53'),
(47, 36, 34, 25000, 1, '2025-12-25 09:28:43', '2025-12-25 09:28:43'),
(48, 37, 34, 25000, 1, '2025-12-25 09:28:43', '2025-12-25 09:28:43'),
(49, 38, 8, 35000, 1, '2025-12-25 09:57:08', '2025-12-25 09:57:08'),
(50, 39, 8, 35000, 1, '2025-12-25 09:57:08', '2025-12-25 09:57:08'),
(51, 40, 10, 20000, 1, '2025-12-25 10:16:47', '2025-12-25 10:16:47'),
(52, 41, 10, 20000, 1, '2025-12-25 10:37:43', '2025-12-25 10:37:43'),
(53, 42, 10, 20000, 1, '2025-12-25 10:46:23', '2025-12-25 10:46:23'),
(54, 43, 10, 20000, 1, '2025-12-25 10:49:03', '2025-12-25 10:49:03'),
(55, 44, 10, 20000, 1, '2025-12-25 10:50:35', '2025-12-25 10:50:35'),
(57, 46, 10, 20000, 1, '2025-12-25 11:00:51', '2025-12-25 11:00:51'),
(58, 47, 10, 20000, 1, '2025-12-25 11:01:58', '2025-12-25 11:01:58'),
(59, 48, 33, 42000, 1, '2025-12-25 11:12:26', '2025-12-25 11:12:26'),
(60, 49, 33, 42000, 1, '2025-12-25 11:13:18', '2025-12-25 11:13:18'),
(61, 50, 33, 42000, 1, '2025-12-25 11:19:58', '2025-12-25 11:19:58'),
(62, 51, 34, 25000, 1, '2025-12-25 11:20:50', '2025-12-25 11:20:50'),
(63, 52, 34, 25000, 1, '2025-12-25 11:21:16', '2025-12-25 11:21:16'),
(64, 53, 34, 25000, 1, '2025-12-25 11:21:45', '2025-12-25 11:21:45'),
(65, 54, 34, 25000, 3, '2025-12-25 11:22:33', '2025-12-25 11:22:33'),
(66, 55, 34, 25000, 1, '2025-12-25 11:24:38', '2025-12-25 11:24:38'),
(67, 56, 34, 25000, 5, '2025-12-25 11:25:33', '2025-12-25 11:25:33'),
(68, 57, 34, 25000, 5, '2025-12-25 11:26:54', '2025-12-25 11:26:54'),
(69, 58, 34, 25000, 1, '2025-12-27 06:43:15', '2025-12-27 06:43:15'),
(70, 59, 38, 29000, 1, '2025-12-27 06:56:49', '2025-12-27 06:56:49'),
(71, 60, 33, 42000, 1, '2025-12-27 06:58:48', '2025-12-27 06:58:48'),
(72, 61, 34, 25000, 1, '2025-12-27 07:02:16', '2025-12-27 07:02:16'),
(73, 62, 34, 25000, 1, '2025-12-27 07:03:19', '2025-12-27 07:03:19'),
(74, 62, 33, 42000, 1, '2025-12-27 07:03:19', '2025-12-27 07:03:19'),
(75, 63, 34, 25000, 1, '2025-12-27 07:13:05', '2025-12-27 07:13:05'),
(76, 63, 33, 42000, 1, '2025-12-27 07:13:05', '2025-12-27 07:13:05'),
(77, 64, 31, 32000, 1, '2025-12-27 07:16:25', '2025-12-27 07:16:25'),
(78, 65, 34, 25000, 1, '2025-12-27 07:19:33', '2025-12-27 07:19:33'),
(79, 66, 35, 30000, 1, '2025-12-27 07:26:21', '2025-12-27 07:26:21'),
(80, 67, 34, 25000, 1, '2025-12-27 07:27:41', '2025-12-27 07:27:41'),
(81, 68, 34, 25000, 1, '2025-12-27 07:35:57', '2025-12-27 07:35:57'),
(82, 69, 34, 25000, 1, '2025-12-27 07:41:18', '2025-12-27 07:41:18'),
(83, 70, 34, 25000, 1, '2025-12-27 07:52:24', '2025-12-27 07:52:24'),
(84, 71, 10, 20000, 1, '2025-12-27 08:33:29', '2025-12-27 08:33:29'),
(85, 72, 34, 25000, 1, '2025-12-31 06:48:30', '2025-12-31 06:48:30'),
(86, 73, 34, 25000, 3, '2025-12-31 07:08:51', '2025-12-31 07:08:51'),
(88, 75, 34, 25000, 3, '2025-12-31 14:59:03', '2025-12-31 14:59:03'),
(89, 75, 35, 30000, 1, '2025-12-31 14:59:03', '2025-12-31 14:59:03'),
(90, 75, 38, 29000, 1, '2025-12-31 14:59:03', '2025-12-31 14:59:03'),
(91, 76, 8, 29000, 5, '2026-01-10 08:44:21', '2026-01-10 08:44:21'),
(92, 77, 9, 35000, 1, '2026-01-13 16:25:58', '2026-01-13 16:25:58'),
(93, 78, 12, 30000, 1, '2026-01-13 16:37:36', '2026-01-13 16:37:36'),
(94, 79, 34, 25000, 3, '2026-01-13 16:46:38', '2026-01-13 16:46:38'),
(95, 80, 12, 30000, 5, '2026-01-13 16:50:12', '2026-01-13 16:50:12'),
(96, 81, 6, 40000, 1, '2026-01-13 16:52:45', '2026-01-13 16:52:45'),
(97, 82, 11, 25000, 1, '2026-01-13 16:59:46', '2026-01-13 16:59:46'),
(98, 83, 3, 29000, 1, '2026-01-13 17:06:06', '2026-01-13 17:06:06'),
(99, 84, 13, 22000, 1, '2026-01-13 17:08:16', '2026-01-13 17:08:16'),
(100, 85, 13, 22000, 10, '2026-01-13 17:12:12', '2026-01-13 17:12:12'),
(101, 86, 13, 22000, 3, '2026-01-14 16:41:24', '2026-01-14 16:41:24'),
(102, 87, 12, 30000, 1, '2026-01-15 05:24:32', '2026-01-15 05:24:32'),
(103, 88, 12, 30000, 1, '2026-01-16 07:30:51', '2026-01-16 07:30:51'),
(104, 89, 12, 30000, 1, '2026-01-16 07:31:32', '2026-01-16 07:31:32'),
(105, 90, 12, 30000, 1, '2026-01-16 08:04:50', '2026-01-16 08:04:50');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `status` int DEFAULT NULL COMMENT '1: Pending, 2: Processing, 3: Shipped, 4: Delivered, 5: Cancelled, 6: Refunded, 7: Failed',
  `note` text,
  `total` int DEFAULT NULL,
  `address` text,
  `phone` varchar(11) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `session_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `status`, `note`, `total`, `address`, `phone`, `createdAt`, `updatedAt`, `session_id`) VALUES
(4, NULL, 7, 'Hàng dễ vỡ hãy cẩn thận', 300000, NULL, NULL, '2025-07-04 16:23:39', '2025-07-08 11:36:16', NULL),
(5, NULL, 4, 'Hàng dễ vỡ hãy cẩn thận', 150000, '50 Lò Siêu, P.16, Q.11', '0774162631', '2025-07-04 16:52:31', '2025-12-10 07:39:20', NULL),
(6, NULL, 4, 'Hàng dễ vỡ hãy cẩn thận', 300000, '50 Lò Siêu, P.16, Q.11', '0774162631', '2025-07-08 11:49:29', '2025-08-07 09:11:37', 'youtube1239999@'),
(7, NULL, 4, 'Hàng dễ vỡ hãy cẩn thận', 300000, '50 Lò Siêu, P.16, Q.11', '0774162631', '2025-07-10 03:54:17', '2025-08-10 07:20:25', 'youtube1239999@'),
(8, NULL, 1, 'Hàng dễ vỡ hãy cẩn thận', 150000, '50 Lò Siêu, P.16, Q.11', '0774162631', '2025-07-17 05:07:33', '2025-07-17 05:07:33', 'youtube1239999@'),
(11, 8, 1, 'Hàng dễ vỡ hãy cẩn thận', 300000, '50 Lò Siêu, P.16, Q.11', '0774162631', '2025-07-18 07:59:44', '2025-07-18 07:59:44', NULL),
(12, 9, 1, 'Hàng dễ vỡ hãy cẩn thận', 150000, '50 Lò Siêu, P.16, Q.11', '0774162631', '2025-07-18 08:03:02', '2025-07-18 08:03:02', NULL),
(13, 8, 1, 'Hàng dễ vỡ hãy cẩn thận', 275000, '50 Lò Siêu, P.16, Q.11', '0774162631', '2025-07-24 16:19:30', '2025-07-24 16:19:30', 'hgiai300001231'),
(14, 8, 1, 'Hàng dễ vỡ hãy cẩn thận', 300000, '50 Lò Siêu, P.16, Q.11', '0774162631', '2025-07-25 07:34:03', '2025-07-25 07:34:03', 'hgiai300002131231'),
(15, 8, 1, 'Hàng dễ vỡ hãy cẩn thận', 175000, '50 Lò Siêu, P.16, Q.11', '0774162631', '2025-07-25 07:43:03', '2025-07-25 07:43:03', 'hgiai300002131231'),
(16, 9, 1, 'Hàng dễ vỡ hãy cẩn thận', 175000, '50 Lò Siêu, P.16, Q.11', '0774162631', '2025-07-25 07:44:32', '2025-07-25 07:44:32', 'hgiai300002131231'),
(17, 10, 1, 'Hàng dễ vỡ hãy cẩn thận', 275000, '50 Lò Siêu, P.16, Q.11', '0774162631', '2025-07-25 12:39:02', '2025-07-25 12:39:02', 'hgiai3000021312311'),
(18, 9, 1, 'Hàng dễ vỡ hãy cẩn thận', 225000, '50 Lò Siêu, P.16, Q.11', '0774162631', '2025-07-25 12:42:15', '2025-07-25 12:42:15', 'hgiai3000021312311'),
(19, 9, 1, 'Hàng dễ vỡ hãy cẩn thận', 225000, '50 Lò Siêu, P.16, Q.11', '0774162631', '2025-07-25 12:48:21', '2025-07-25 12:48:21', 'hgiai3000021312311'),
(20, 9, 1, 'Hàng dễ vỡ hãy cẩn thận', 225000, '50 Lò Siêu, P.16, Q.11', '0774162631', '2025-07-25 12:55:05', '2025-07-25 12:55:05', 'hgiai3000021312311'),
(21, 9, 1, 'Hàng dễ vỡ hãy cẩn thận', 125000, '50 Lò Siêu, P.16, Q.11', '0774162631', '2025-07-25 12:56:49', '2025-07-25 12:56:49', 'hgiai3000021312311'),
(22, 9, 1, 'Hàng dễ vỡ hãy cẩn thận', 125000, '50 Lò Siêu, P.16, Q.11', '0774162631', '2025-07-25 12:58:14', '2025-07-25 12:58:14', 'hgiai3000021312311'),
(23, 10, 1, 'Hàng dễ vỡ hãy cẩn thận', 300000, 'Long An - Tây Ninh núi bà già', '0774162631', '2025-07-25 13:00:12', '2025-07-25 13:00:12', 'hieungu'),
(24, 10, 1, 'Đơn hàng từ app', 50000, 'Long An - Tây Ninh', '0774162631', '2025-07-27 06:23:23', '2025-07-27 06:23:23', '1753597302823'),
(25, 9, 1, 'Đơn hàng từ app', 55000, '50 Lò Siêu, P.16, Q.11', '0774162631', '2025-07-27 06:32:25', '2025-07-27 06:32:25', '1753597774884'),
(26, 9, 1, 'Đơn hàng từ app - Ma don hang: 229397', 25000, '50 Lò Siêu, P.16, Q.11', '0774162631', '2025-07-29 17:00:43', '2025-07-29 17:00:43', '1753808308716'),
(27, 14, 1, '123', 100000, '50 Lò Siêu, Quận 11', '0774162600', '2025-08-26 09:17:47', '2025-08-26 09:17:47', NULL),
(28, 9, 1, 'Ít ngọt', 30000, '50 Lò Siêu, P.16, Q.11, TP.HCM', '0774162631', '2025-08-26 09:21:07', '2025-08-26 09:21:07', NULL),
(29, 14, 1, 'it ngot', 60000, '50 lo sieu', '0774162600', '2025-09-30 07:02:59', '2025-09-30 07:02:59', NULL),
(30, 9, 7, 'Đơn hàng từ app - Ma don hang: 586403', 75000, '50 Lò Siêu, P.16, Q.11', '0774162631', '2025-12-10 07:45:51', '2025-12-10 07:48:01', '1765352541708'),
(31, 15, 1, NULL, 25000, '172 tạ uyên', '0764699676', '2025-12-22 09:32:01', '2025-12-22 09:32:01', NULL),
(32, 15, 1, '123', 62000, '172 tạ uyên', '0764699676', '2025-12-22 09:36:57', '2025-12-22 09:36:57', NULL),
(33, 15, 5, 'Muốn cappuccino uống giống sữa tươi', 59000, '50 lò siêu, Phường 16, Quận 11, TPHCM', '0764699676', '2025-12-23 07:29:27', '2025-12-23 08:07:08', NULL),
(35, 13, 1, 'Test payos payment', 75000, '123 Test Street, HCM City', '0123456789', '2025-12-25 08:34:53', '2025-12-25 08:34:53', NULL),
(36, 9, 1, 'không lấy hành', 25000, '412 Nguyễn Văn Quá', '0774162631', '2025-12-25 09:28:43', '2025-12-25 09:28:43', NULL),
(37, 9, 1, 'không lấy hành', 25000, '412 Nguyễn Văn Quá', '0774162631', '2025-12-25 09:28:43', '2025-12-25 09:28:43', NULL),
(38, 9, 1, 'ít ngọt', 35000, '50 Lò Siêu', '0774162631', '2025-12-25 09:57:08', '2025-12-25 09:57:08', NULL),
(39, 9, 1, 'ít ngọt', 35000, '50 Lò Siêu', '0774162631', '2025-12-25 09:57:08', '2025-12-25 09:57:08', NULL),
(40, 9, 1, '', 20000, '50 lo Sieu', '0774162631', '2025-12-25 10:16:47', '2025-12-25 10:16:47', NULL),
(41, 9, 1, '', 20000, '50 lò siêu', '0774162631', '2025-12-25 10:37:43', '2025-12-25 10:37:43', NULL),
(42, 9, 1, '', 20000, '50 lò siêu', '0774162631', '2025-12-25 10:46:23', '2025-12-25 10:46:23', NULL),
(43, 9, 1, '', 20000, '50 lo sieu', '0774162631', '2025-12-25 10:49:03', '2025-12-25 10:49:03', NULL),
(44, 9, 1, '', 20000, 'Lò siêu 50', '0774162631', '2025-12-25 10:50:35', '2025-12-25 10:50:35', NULL),
(46, 9, 1, '', 20000, '50 lo siêu 111', '0774162631', '2025-12-25 11:00:51', '2025-12-25 11:00:51', NULL),
(47, 9, 1, '', 20000, 'lo sieu516546163', '0774162631', '2025-12-25 11:01:58', '2025-12-25 11:01:58', NULL),
(48, 9, 1, '', 42000, '50 Lo Sieu', '0774162631', '2025-12-25 11:12:26', '2025-12-25 11:12:26', NULL),
(49, 9, 1, '', 42000, '50 lo sieu', '0774162631', '2025-12-25 11:13:18', '2025-12-25 11:13:18', NULL),
(50, 9, 1, '', 42000, '50 Lò siêu', '0774162631', '2025-12-25 11:19:58', '2025-12-25 11:19:58', NULL),
(51, 9, 1, '', 25000, '50 Lò siêu', '0774162631', '2025-12-25 11:20:50', '2025-12-25 11:20:50', NULL),
(52, 9, 1, '', 25000, '50 Lò siêu', '0774162631', '2025-12-25 11:21:16', '2025-12-25 11:21:16', NULL),
(53, 9, 1, '', 25000, '50 Lò siêu', '0774162631', '2025-12-25 11:21:45', '2025-12-25 11:21:45', NULL),
(54, 9, 1, '', 75000, '50 Lò siêu', '0774162631', '2025-12-25 11:22:33', '2025-12-25 11:22:33', NULL),
(55, 9, 1, '', 25000, '50 lo sieu', '0774162631', '2025-12-25 11:24:38', '2025-12-25 11:24:38', NULL),
(56, 9, 1, '', 125000, '50 Lo sieu', '0774162631', '2025-12-25 11:25:33', '2025-12-25 11:25:33', NULL),
(57, 9, 1, '', 125000, '50 lo sieu', '0774162631', '2025-12-25 11:26:54', '2025-12-25 11:26:54', NULL),
(58, 9, 1, NULL, 25000, '412 Nguyễn Văn Quá', '0774162631', '2025-12-27 06:43:15', '2025-12-27 06:43:15', NULL),
(59, 9, 1, NULL, 29000, '412 lo sieu', '0774162631', '2025-12-27 06:56:49', '2025-12-27 06:56:49', NULL),
(60, 9, 1, '1234', 42000, '50 Lo Sieu', '0774162631', '2025-12-27 06:58:48', '2025-12-27 06:58:48', NULL),
(61, 9, 1, '', 25000, '412 Nguyen Văn qua', '0774162631', '2025-12-27 07:02:16', '2025-12-27 07:02:16', NULL),
(62, 9, 1, 'Test COD', 67000, '12312412412', '0774162631', '2025-12-27 07:03:19', '2025-12-27 07:03:19', NULL),
(63, 9, 1, 'Ít ngọt COD', 67000, '50 Lò Siêu', '0774162631', '2025-12-27 07:13:05', '2025-12-27 07:13:05', NULL),
(64, 9, 1, NULL, 32000, '50 Lò Siêu', '0774162631', '2025-12-27 07:16:25', '2025-12-27 07:16:25', NULL),
(65, 9, 1, 'COD test', 25000, '50 Lò Siêu 123', '0774162631', '2025-12-27 07:19:33', '2025-12-27 07:19:33', NULL),
(66, 9, 1, 'TEST COD', 30000, '50 Lò SIêu', '0774162631', '2025-12-27 07:26:21', '2025-12-27 07:26:21', NULL),
(67, 9, 1, 'Test VNPAY', 25000, '50 Lò Siêu', '0774162631', '2025-12-27 07:27:41', '2025-12-27 07:27:41', NULL),
(68, 9, 1, 'TEST VNPAY', 25000, '50 lo sieu', '0774162631', '2025-12-27 07:35:57', '2025-12-27 07:35:57', NULL),
(69, 9, 1, 'TEst VNPAY', 25000, '50 Lò Siêu', '0774162631', '2025-12-27 07:41:18', '2025-12-27 07:41:18', NULL),
(70, 9, 2, 'test VNPAY', 25000, '50 Lo Sieu', '0774162631', '2025-12-27 07:52:24', '2025-12-27 07:57:49', NULL),
(71, 9, 4, 'Test VNPAY 1', 20000, '50 Lò Siêu', '0774162631', '2025-12-27 08:33:29', '2025-12-31 08:34:10', NULL),
(72, 9, 3, 'Ít ngọt', 25000, '50 Lò Siêu', '0774162631', '2025-12-31 06:48:30', '2025-12-31 08:33:57', NULL),
(73, 9, 3, 'it ngot', 75000, '50 Lo sieu', '0774162631', '2025-12-31 07:08:51', '2025-12-31 08:32:32', NULL),
(75, 9, 1, 'Ít ngọt', 134000, '50 Lò Siêu', '0774162631', '2025-12-31 14:59:03', '2025-12-31 14:59:03', NULL),
(76, 1, 1, 'Hàng dễ vỡ hãy cẩn thận', 145000, '50 Lò Siêu, P.16, Q.11', '0774162631', '2026-01-10 08:44:21', '2026-01-10 08:44:21', NULL),
(77, 9, 1, 'Hàng dễ vỡ hãy cẩn thận', 35000, '50 Lò Siêu, P.16, Q.11', '0774162631', '2026-01-13 16:25:58', '2026-01-13 16:25:58', NULL),
(78, 9, 1, 'ít đá', 30000, '50 Lò Siêu', '0774162631', '2026-01-13 16:37:36', '2026-01-13 16:37:36', NULL),
(79, 13, 1, 'Hàng dễ vỡ hãy cẩn thận', 75000, '50 Lò Siêu, P.16, Q.11', '0774162631', '2026-01-13 16:46:38', '2026-01-13 16:46:38', NULL),
(80, 9, 1, NULL, 150000, '412 Nguyễn Văn Quá', '0774162631', '2026-01-13 16:50:12', '2026-01-13 16:50:12', NULL),
(81, 9, 1, NULL, 40000, '50 Lò SIêu', '0774162631', '2026-01-13 16:52:45', '2026-01-13 16:52:45', NULL),
(82, 9, 1, NULL, 25000, '50 Lò Siêu', '0774162631', '2026-01-13 16:59:46', '2026-01-13 16:59:46', NULL),
(83, 9, 1, '123123', 29000, '50 lo sieu', '0774162631', '2026-01-13 17:06:06', '2026-01-13 17:06:06', NULL),
(84, 9, 7, '', 22000, '50 lo siêu', '0774162631', '2026-01-13 17:08:16', '2026-01-14 07:32:25', NULL),
(85, 9, 4, '', 220000, '100 lò gốm', '0774162631', '2026-01-13 17:12:12', '2026-01-14 06:58:44', NULL),
(86, 9, 1, '', 66000, '50 Lò Siêu, Phường Phú Thọ, Thành phố Hồ Chí Minh', '0774162631', '2026-01-14 16:41:24', '2026-01-14 16:41:24', NULL),
(87, 15, 1, '', 30000, '1 Nguyễn Chí Thanh, Phường Chợ Lớn, Thành phố Hồ Chí Minh', '0764699676', '2026-01-15 05:24:32', '2026-01-15 05:24:32', NULL),
(88, 9, 1, '', 30000, '1375 Đường 3 Tháng 2, Phường Minh Phụng, Thành phố Hồ Chí Minh', '0774162631', '2026-01-16 07:30:51', '2026-01-16 07:30:51', NULL),
(89, 9, 1, '', 30000, 'Lò Siêu, Phường Minh Phụng, Thành phố Hồ Chí Minh', '0774162631', '2026-01-16 07:31:32', '2026-01-16 07:31:32', NULL),
(90, 9, 1, '', 30000, '50 Lò Siêu, Phường Phú Thọ, Thành phố Hồ Chí Minh', '0774162631', '2026-01-16 08:04:50', '2026-01-16 08:04:50', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `orders_backup`
--

CREATE TABLE `orders_backup` (
  `id` int NOT NULL DEFAULT '0',
  `user_id` int DEFAULT NULL,
  `status` int DEFAULT NULL,
  `note` text,
  `total` int DEFAULT NULL,
  `address` text,
  `phone` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int NOT NULL,
  `order_id` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('pending','processing','completed','failed','cancelled') DEFAULT 'pending',
  `transaction_id` varchar(255) DEFAULT NULL,
  `payment_url` text,
  `payos_order_code` bigint DEFAULT NULL,
  `callback_data` json DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `payment_method` enum('cod','sepay','vnpay','momo') NOT NULL DEFAULT 'cod'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `order_id`, `amount`, `status`, `transaction_id`, `payment_url`, `payos_order_code`, `callback_data`, `created_at`, `updated_at`, `payment_method`) VALUES
(1, 35, 75000.00, 'pending', '35', 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=75000&vnp_Command=pay&vnp_CreateDate=20251225153453&vnp_CurrCode=VND&vnp_ExpireDate=20251225154953&vnp_IpAddr=%3A%3A1&vnp_Locale=vn&vnp_OrderInfo=Thanh%20toan%20don%20hang%20%2335%20-%20HG%20Coffee&vnp_OrderType=billpayment&vnp_ReturnUrl=http%3A%2F%2Flocalhost%3A5173%2Fpayment-result&vnp_TmnCode=undefined&vnp_TxnRef=35&vnp_Version=2.1.0&vnp_SecureHash=a77fadd5523fab7633ce82e9bc23ea7c4b3c914e9b976f410c396210d8b64f15178c4ada1dd668316aabe411919aa2d270d974aca35a296c71fe1b5bb3b905e5', NULL, '\"{\\\"success\\\":true,\\\"paymentUrl\\\":\\\"https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=75000&vnp_Command=pay&vnp_CreateDate=20251225153453&vnp_CurrCode=VND&vnp_ExpireDate=20251225154953&vnp_IpAddr=%3A%3A1&vnp_Locale=vn&vnp_OrderInfo=Thanh%20toan%20don%20hang%20%2335%20-%20HG%20Coffee&vnp_OrderType=billpayment&vnp_ReturnUrl=http%3A%2F%2Flocalhost%3A5173%2Fpayment-result&vnp_TmnCode=undefined&vnp_TxnRef=35&vnp_Version=2.1.0&vnp_SecureHash=a77fadd5523fab7633ce82e9bc23ea7c4b3c914e9b976f410c396210d8b64f15178c4ada1dd668316aabe411919aa2d270d974aca35a296c71fe1b5bb3b905e5\\\",\\\"orderCode\\\":35}\"', '2025-12-25 08:34:53', '2025-12-25 08:34:53', 'vnpay'),
(2, 36, 25000.00, 'pending', '36', 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=25000&vnp_Command=pay&vnp_CreateDate=20251225162843&vnp_CurrCode=VND&vnp_ExpireDate=20251225164343&vnp_IpAddr=%3A%3A1&vnp_Locale=vn&vnp_OrderInfo=Thanh%20toan%20don%20hang%20%2336%20-%20HG%20Coffee&vnp_OrderType=billpayment&vnp_ReturnUrl=http%3A%2F%2Flocalhost%3A5173%2Fpayment-result&vnp_TmnCode=undefined&vnp_TxnRef=36&vnp_Version=2.1.0&vnp_SecureHash=09d12ff75a30cbd1a2493da603fc87d7b9aa9bfa4a97af2cc22c0213548aa4849157b3a2f6ad425ffffb2a061256cb24b397be57b4bcce208f164ddbc6bf1ca3', NULL, '\"{\\\"success\\\":true,\\\"paymentUrl\\\":\\\"https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=25000&vnp_Command=pay&vnp_CreateDate=20251225162843&vnp_CurrCode=VND&vnp_ExpireDate=20251225164343&vnp_IpAddr=%3A%3A1&vnp_Locale=vn&vnp_OrderInfo=Thanh%20toan%20don%20hang%20%2336%20-%20HG%20Coffee&vnp_OrderType=billpayment&vnp_ReturnUrl=http%3A%2F%2Flocalhost%3A5173%2Fpayment-result&vnp_TmnCode=undefined&vnp_TxnRef=36&vnp_Version=2.1.0&vnp_SecureHash=09d12ff75a30cbd1a2493da603fc87d7b9aa9bfa4a97af2cc22c0213548aa4849157b3a2f6ad425ffffb2a061256cb24b397be57b4bcce208f164ddbc6bf1ca3\\\",\\\"orderCode\\\":36}\"', '2025-12-25 09:28:43', '2025-12-25 09:28:43', 'vnpay'),
(3, 38, 35000.00, 'pending', '38', 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=35000&vnp_Command=pay&vnp_CreateDate=20251225165708&vnp_CurrCode=VND&vnp_ExpireDate=20251225171208&vnp_IpAddr=%3A%3A1&vnp_Locale=vn&vnp_OrderInfo=Thanh%20toan%20don%20hang%20%2338%20-%20HG%20Coffee&vnp_OrderType=billpayment&vnp_ReturnUrl=http%3A%2F%2Flocalhost%3A5173%2Fpayment-result&vnp_TmnCode=undefined&vnp_TxnRef=38&vnp_Version=2.1.0&vnp_SecureHash=65af1d9e49b61b6ba313f21ad14a54fc6018a2171f9bf0207f7037f95717646a7cbeefa1f15d7c327f17e52b55359546bfc88af8e6e36b22b624a8335a80d5c2', NULL, '\"{\\\"success\\\":true,\\\"paymentUrl\\\":\\\"https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=35000&vnp_Command=pay&vnp_CreateDate=20251225165708&vnp_CurrCode=VND&vnp_ExpireDate=20251225171208&vnp_IpAddr=%3A%3A1&vnp_Locale=vn&vnp_OrderInfo=Thanh%20toan%20don%20hang%20%2338%20-%20HG%20Coffee&vnp_OrderType=billpayment&vnp_ReturnUrl=http%3A%2F%2Flocalhost%3A5173%2Fpayment-result&vnp_TmnCode=undefined&vnp_TxnRef=38&vnp_Version=2.1.0&vnp_SecureHash=65af1d9e49b61b6ba313f21ad14a54fc6018a2171f9bf0207f7037f95717646a7cbeefa1f15d7c327f17e52b55359546bfc88af8e6e36b22b624a8335a80d5c2\\\",\\\"orderCode\\\":38}\"', '2025-12-25 09:57:08', '2025-12-25 09:57:08', 'vnpay'),
(4, 40, 20000.00, 'pending', '40', 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=20000&vnp_Command=pay&vnp_CreateDate=20251225171647&vnp_CurrCode=VND&vnp_ExpireDate=20251225173147&vnp_IpAddr=%3A%3A1&vnp_Locale=vn&vnp_OrderInfo=Thanh%20toan%20don%20hang%20%2340%20-%20HG%20Coffee&vnp_OrderType=billpayment&vnp_ReturnUrl=http%3A%2F%2Flocalhost%3A5173%2Fpayment-result&vnp_TmnCode=undefined&vnp_TxnRef=40&vnp_Version=2.1.0&vnp_SecureHash=d42db0ec243fd2cc6097972d0ff5c8e104f84550b306b3eb8d04209ae646e2be89fa0e663edb001a5357854a59d0601d7926017696ecb28ecfda654fd76d35f3', NULL, '\"{\\\"success\\\":true,\\\"paymentUrl\\\":\\\"https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=20000&vnp_Command=pay&vnp_CreateDate=20251225171647&vnp_CurrCode=VND&vnp_ExpireDate=20251225173147&vnp_IpAddr=%3A%3A1&vnp_Locale=vn&vnp_OrderInfo=Thanh%20toan%20don%20hang%20%2340%20-%20HG%20Coffee&vnp_OrderType=billpayment&vnp_ReturnUrl=http%3A%2F%2Flocalhost%3A5173%2Fpayment-result&vnp_TmnCode=undefined&vnp_TxnRef=40&vnp_Version=2.1.0&vnp_SecureHash=d42db0ec243fd2cc6097972d0ff5c8e104f84550b306b3eb8d04209ae646e2be89fa0e663edb001a5357854a59d0601d7926017696ecb28ecfda654fd76d35f3\\\",\\\"orderCode\\\":40}\"', '2025-12-25 10:16:47', '2025-12-25 10:16:47', 'vnpay'),
(5, 41, 20000.00, 'pending', '41', 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=20000&vnp_Command=pay&vnp_CreateDate=20251225173743&vnp_CurrCode=VND&vnp_ExpireDate=20251225175243&vnp_IpAddr=%3A%3A1&vnp_Locale=vn&vnp_OrderInfo=Thanh%20toan%20don%20hang%20%2341%20-%20HG%20Coffee&vnp_OrderType=billpayment&vnp_ReturnUrl=http%3A%2F%2Flocalhost%3A5173%2Fpayment-result&vnp_TmnCode=undefined&vnp_TxnRef=41&vnp_Version=2.1.0&vnp_SecureHash=de76deaa8ac128ce2c9a692fa0e03dd40bf75b5e74d737f85d48153195db3a5d4abb27b0ba48f4f758a2e98daf3063a32a2395471e16b99ff04423efc0b142f6', NULL, '\"{\\\"success\\\":true,\\\"paymentUrl\\\":\\\"https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=20000&vnp_Command=pay&vnp_CreateDate=20251225173743&vnp_CurrCode=VND&vnp_ExpireDate=20251225175243&vnp_IpAddr=%3A%3A1&vnp_Locale=vn&vnp_OrderInfo=Thanh%20toan%20don%20hang%20%2341%20-%20HG%20Coffee&vnp_OrderType=billpayment&vnp_ReturnUrl=http%3A%2F%2Flocalhost%3A5173%2Fpayment-result&vnp_TmnCode=undefined&vnp_TxnRef=41&vnp_Version=2.1.0&vnp_SecureHash=de76deaa8ac128ce2c9a692fa0e03dd40bf75b5e74d737f85d48153195db3a5d4abb27b0ba48f4f758a2e98daf3063a32a2395471e16b99ff04423efc0b142f6\\\",\\\"orderCode\\\":41}\"', '2025-12-25 10:37:43', '2025-12-25 10:37:43', 'vnpay'),
(6, 42, 20000.00, 'pending', '42', 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=2000000&vnp_Command=pay&vnp_CreateDate=20251225174623&vnp_CurrCode=VND&vnp_ExpireDate=20251225180123&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=Thanh%20toan%20don%20hang%2042%20HG%20Coffee&vnp_OrderType=billpayment&vnp_ReturnUrl=http%3A%2F%2Flocalhost%3A3003%2Fapi%2Fpayments%2Fvnpay%2Freturn&vnp_TmnCode=CGXZLS0Z&vnp_TxnRef=42&vnp_Version=2.1.0&vnp_SecureHash=b62ed20404726c8b611ec4f9ced21803a7417970e9ddcaa14de382119ebbddf7dea65b7fc3293abbc14a91f2eef82f2494bf800e47484a48b9c27727ed3262f6', NULL, '\"{\\\"success\\\":true,\\\"paymentUrl\\\":\\\"https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=2000000&vnp_Command=pay&vnp_CreateDate=20251225174623&vnp_CurrCode=VND&vnp_ExpireDate=20251225180123&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=Thanh%20toan%20don%20hang%2042%20HG%20Coffee&vnp_OrderType=billpayment&vnp_ReturnUrl=http%3A%2F%2Flocalhost%3A3003%2Fapi%2Fpayments%2Fvnpay%2Freturn&vnp_TmnCode=CGXZLS0Z&vnp_TxnRef=42&vnp_Version=2.1.0&vnp_SecureHash=b62ed20404726c8b611ec4f9ced21803a7417970e9ddcaa14de382119ebbddf7dea65b7fc3293abbc14a91f2eef82f2494bf800e47484a48b9c27727ed3262f6\\\",\\\"orderCode\\\":42}\"', '2025-12-25 10:46:23', '2025-12-25 10:46:23', 'vnpay'),
(7, 43, 20000.00, 'pending', '43', 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?[object Object]&vnp_SecureHash=f815f319708a1999fe090c0fe00840921e439e7f11fd5c796efda29b648206eb612d36acf0db5f09fe953a5511cda64a5f5f003314920f964847552f20da557e', NULL, '\"{\\\"success\\\":true,\\\"paymentUrl\\\":\\\"https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?[object Object]&vnp_SecureHash=f815f319708a1999fe090c0fe00840921e439e7f11fd5c796efda29b648206eb612d36acf0db5f09fe953a5511cda64a5f5f003314920f964847552f20da557e\\\",\\\"orderCode\\\":43}\"', '2025-12-25 10:49:03', '2025-12-25 10:49:03', 'vnpay'),
(8, 44, 20000.00, 'pending', '44', 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?[object Object]&vnp_SecureHash=0eab4ff2be8c78424be7a63eabebce6313f5dc8d8bea72288b11f96ceb833105ce4d847049a73271b9e56550d127e5a421236e25e613d94a9aae6be22a44c919', NULL, '\"{\\\"success\\\":true,\\\"paymentUrl\\\":\\\"https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?[object Object]&vnp_SecureHash=0eab4ff2be8c78424be7a63eabebce6313f5dc8d8bea72288b11f96ceb833105ce4d847049a73271b9e56550d127e5a421236e25e613d94a9aae6be22a44c919\\\",\\\"orderCode\\\":44}\"', '2025-12-25 10:50:35', '2025-12-25 10:50:35', 'vnpay'),
(9, 46, 20000.00, 'pending', '46', 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=2000000&vnp_Command=pay&vnp_CreateDate=20251225180051&vnp_CurrCode=VND&vnp_ExpireDate=20251225181551&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=Thanh%20toan%20don%20hang%20%2346%20-%20HG%20Coffee&vnp_OrderType=billpayment&vnp_ReturnUrl=http%3A%2F%2Flocalhost%3A3003%2Fapi%2Fpayments%2Fvnpay%2Freturn&vnp_TmnCode=H1SX11WS&vnp_TxnRef=46&vnp_Version=2.1.0&vnp_SecureHash=98ea9075b85904b4907348e38df4af489779cfe588eaa060fd6a0416c737db5e6a6bda490c3a32ded9c8ccb323deedce639499448d4cb9280d55514209410988', NULL, '\"{\\\"success\\\":true,\\\"paymentUrl\\\":\\\"https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=2000000&vnp_Command=pay&vnp_CreateDate=20251225180051&vnp_CurrCode=VND&vnp_ExpireDate=20251225181551&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=Thanh%20toan%20don%20hang%20%2346%20-%20HG%20Coffee&vnp_OrderType=billpayment&vnp_ReturnUrl=http%3A%2F%2Flocalhost%3A3003%2Fapi%2Fpayments%2Fvnpay%2Freturn&vnp_TmnCode=H1SX11WS&vnp_TxnRef=46&vnp_Version=2.1.0&vnp_SecureHash=98ea9075b85904b4907348e38df4af489779cfe588eaa060fd6a0416c737db5e6a6bda490c3a32ded9c8ccb323deedce639499448d4cb9280d55514209410988\\\",\\\"orderCode\\\":46}\"', '2025-12-25 11:00:51', '2025-12-25 11:00:51', 'vnpay'),
(10, 47, 20000.00, 'pending', '47', 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=2000000&vnp_Command=pay&vnp_CreateDate=20251225180158&vnp_CurrCode=VND&vnp_ExpireDate=20251225181658&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=Thanh%20toan%20don%20hang%20%2347%20-%20HG%20Coffee&vnp_OrderType=billpayment&vnp_ReturnUrl=http%3A%2F%2Flocalhost%3A3003%2Fapi%2Fpayments%2Fvnpay%2Freturn&vnp_TmnCode=H1SX11WS&vnp_TxnRef=47&vnp_Version=2.1.0&vnp_SecureHash=604d8af11014a8d416f19e3f1fcab06c86926d2d16c526f14ef414280c3538c29c0e6b8bc1bf512088ed55db3e5ca221a96b578a360c8aba014d85c5489d1464', NULL, '\"{\\\"success\\\":true,\\\"paymentUrl\\\":\\\"https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=2000000&vnp_Command=pay&vnp_CreateDate=20251225180158&vnp_CurrCode=VND&vnp_ExpireDate=20251225181658&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=Thanh%20toan%20don%20hang%20%2347%20-%20HG%20Coffee&vnp_OrderType=billpayment&vnp_ReturnUrl=http%3A%2F%2Flocalhost%3A3003%2Fapi%2Fpayments%2Fvnpay%2Freturn&vnp_TmnCode=H1SX11WS&vnp_TxnRef=47&vnp_Version=2.1.0&vnp_SecureHash=604d8af11014a8d416f19e3f1fcab06c86926d2d16c526f14ef414280c3538c29c0e6b8bc1bf512088ed55db3e5ca221a96b578a360c8aba014d85c5489d1464\\\",\\\"orderCode\\\":47}\"', '2025-12-25 11:01:58', '2025-12-25 11:01:58', 'vnpay'),
(11, 48, 42000.00, 'pending', '48', 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=4200000&vnp_Command=pay&vnp_CreateDate=20251225181226&vnp_CurrCode=VND&vnp_ExpireDate=20251225182726&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=Thanh toan don hang #48 - HG Coffee&vnp_OrderType=billpayment&vnp_ReturnUrl=http://localhost:3003/api/payments/vnpay/return&vnp_TmnCode=H1SX11WS&vnp_TxnRef=48&vnp_Version=2.1.0&vnp_SecureHash=fca566340c9b0d924672114387c2718a75be0bfd3c9304e6b55329658c88ca633c1648a17dd05e4c54bd16b83cd54eaaa1cbb3acaf459a2b8289fdc666eca634', NULL, '\"{\\\"success\\\":true,\\\"paymentUrl\\\":\\\"https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=4200000&vnp_Command=pay&vnp_CreateDate=20251225181226&vnp_CurrCode=VND&vnp_ExpireDate=20251225182726&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=Thanh toan don hang #48 - HG Coffee&vnp_OrderType=billpayment&vnp_ReturnUrl=http://localhost:3003/api/payments/vnpay/return&vnp_TmnCode=H1SX11WS&vnp_TxnRef=48&vnp_Version=2.1.0&vnp_SecureHash=fca566340c9b0d924672114387c2718a75be0bfd3c9304e6b55329658c88ca633c1648a17dd05e4c54bd16b83cd54eaaa1cbb3acaf459a2b8289fdc666eca634\\\",\\\"orderCode\\\":48}\"', '2025-12-25 11:12:26', '2025-12-25 11:12:26', 'vnpay'),
(12, 49, 42000.00, 'pending', '49', 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=4200000&vnp_Command=pay&vnp_CreateDate=20251225181318&vnp_CurrCode=VND&vnp_ExpireDate=20251225182818&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=Thanh+toan+don+hang+49+HG+Coffee&vnp_OrderType=billpayment&vnp_ReturnUrl=http%3A%2F%2Flocalhost%3A3003%2Fapi%2Fpayments%2Fvnpay%2Freturn&vnp_TmnCode=H1SX11WS&vnp_TxnRef=49&vnp_Version=2.1.0&vnp_SecureHash=c1da742f556d8fb33b7e3beda4b2c6372c7a4d0ba1e1735b69789a9c19049fca736c9076ea8d6b1bf38175713fd502a43525110f971b5d2cee716b98a1685e21', NULL, '\"{\\\"success\\\":true,\\\"paymentUrl\\\":\\\"https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=4200000&vnp_Command=pay&vnp_CreateDate=20251225181318&vnp_CurrCode=VND&vnp_ExpireDate=20251225182818&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=Thanh+toan+don+hang+49+HG+Coffee&vnp_OrderType=billpayment&vnp_ReturnUrl=http%3A%2F%2Flocalhost%3A3003%2Fapi%2Fpayments%2Fvnpay%2Freturn&vnp_TmnCode=H1SX11WS&vnp_TxnRef=49&vnp_Version=2.1.0&vnp_SecureHash=c1da742f556d8fb33b7e3beda4b2c6372c7a4d0ba1e1735b69789a9c19049fca736c9076ea8d6b1bf38175713fd502a43525110f971b5d2cee716b98a1685e21\\\",\\\"orderCode\\\":49}\"', '2025-12-25 11:13:18', '2025-12-25 11:13:18', 'vnpay'),
(13, 50, 42000.00, 'pending', '50', NULL, NULL, '\"{\\\"success\\\":true,\\\"orderCode\\\":50}\"', '2025-12-25 11:19:58', '2025-12-25 11:19:58', 'cod'),
(14, 51, 25000.00, 'pending', '51', 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=2500000&vnp_Command=pay&vnp_CreateDate=20251225182050&vnp_CurrCode=VND&vnp_ExpireDate=20251225183550&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=Thanh+toan+don+hang+51+HG+Coffee&vnp_OrderType=billpayment&vnp_ReturnUrl=http%3A%2F%2Flocalhost%3A3003%2Fapi%2Fpayments%2Fvnpay%2Freturn&vnp_TmnCode=H1SX11WS&vnp_TxnRef=51&vnp_Version=2.1.0&vnp_SecureHash=d2c300843aa14bda846abffd59c304a240e9aa032799c19597d7676ecad6a7b888a464973022fd440e9b20bca7837fea8aeae723e09bf6c4fb068ad68da8fc83', NULL, '\"{\\\"success\\\":true,\\\"paymentUrl\\\":\\\"https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=2500000&vnp_Command=pay&vnp_CreateDate=20251225182050&vnp_CurrCode=VND&vnp_ExpireDate=20251225183550&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=Thanh+toan+don+hang+51+HG+Coffee&vnp_OrderType=billpayment&vnp_ReturnUrl=http%3A%2F%2Flocalhost%3A3003%2Fapi%2Fpayments%2Fvnpay%2Freturn&vnp_TmnCode=H1SX11WS&vnp_TxnRef=51&vnp_Version=2.1.0&vnp_SecureHash=d2c300843aa14bda846abffd59c304a240e9aa032799c19597d7676ecad6a7b888a464973022fd440e9b20bca7837fea8aeae723e09bf6c4fb068ad68da8fc83\\\",\\\"orderCode\\\":51}\"', '2025-12-25 11:20:50', '2025-12-25 11:20:50', 'vnpay'),
(15, 52, 25000.00, 'pending', '52', 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=2500000&vnp_Command=pay&vnp_CreateDate=20251225182116&vnp_CurrCode=VND&vnp_ExpireDate=20251225183616&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=Thanh+toan+don+hang+52+HG+Coffee&vnp_OrderType=billpayment&vnp_ReturnUrl=http%3A%2F%2Flocalhost%3A3003%2Fapi%2Fpayments%2Fvnpay%2Freturn&vnp_TmnCode=H1SX11WS&vnp_TxnRef=52&vnp_Version=2.1.0&vnp_SecureHash=075c05cb142438520f67eaf64ca5dfac62c4d25f0e71e9239ebec68b3e6beb844dccbff4b93f82648eb6bf5c0de1f3d51fbf672a6c0cf9a5d9a9e95e5714ec2a', NULL, '\"{\\\"success\\\":true,\\\"paymentUrl\\\":\\\"https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=2500000&vnp_Command=pay&vnp_CreateDate=20251225182116&vnp_CurrCode=VND&vnp_ExpireDate=20251225183616&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=Thanh+toan+don+hang+52+HG+Coffee&vnp_OrderType=billpayment&vnp_ReturnUrl=http%3A%2F%2Flocalhost%3A3003%2Fapi%2Fpayments%2Fvnpay%2Freturn&vnp_TmnCode=H1SX11WS&vnp_TxnRef=52&vnp_Version=2.1.0&vnp_SecureHash=075c05cb142438520f67eaf64ca5dfac62c4d25f0e71e9239ebec68b3e6beb844dccbff4b93f82648eb6bf5c0de1f3d51fbf672a6c0cf9a5d9a9e95e5714ec2a\\\",\\\"orderCode\\\":52}\"', '2025-12-25 11:21:16', '2025-12-25 11:21:16', 'vnpay'),
(16, 53, 25000.00, 'pending', '53', NULL, NULL, '\"{\\\"success\\\":true,\\\"orderCode\\\":53}\"', '2025-12-25 11:21:45', '2025-12-25 11:21:45', 'cod'),
(17, 54, 75000.00, 'pending', '54', NULL, NULL, '\"{\\\"success\\\":true,\\\"orderCode\\\":54}\"', '2025-12-25 11:22:33', '2025-12-25 11:22:33', 'cod'),
(18, 55, 25000.00, 'pending', '55', NULL, NULL, '\"{\\\"success\\\":true,\\\"orderCode\\\":55}\"', '2025-12-25 11:24:38', '2025-12-25 11:24:38', 'cod'),
(19, 56, 125000.00, 'pending', '56', NULL, NULL, '\"{\\\"success\\\":true,\\\"orderCode\\\":56}\"', '2025-12-25 11:25:33', '2025-12-25 11:25:33', 'cod'),
(20, 57, 125000.00, 'pending', '57', NULL, NULL, '\"{\\\"success\\\":true,\\\"orderCode\\\":57}\"', '2025-12-25 11:26:54', '2025-12-25 11:26:54', 'cod'),
(21, 61, 25000.00, 'pending', '61', NULL, NULL, '\"{\\\"success\\\":true,\\\"orderCode\\\":61}\"', '2025-12-27 07:02:16', '2025-12-27 07:02:16', 'cod'),
(22, 62, 67000.00, 'pending', '62', NULL, NULL, '\"{\\\"success\\\":true,\\\"orderCode\\\":62}\"', '2025-12-27 07:03:19', '2025-12-27 07:03:19', 'cod'),
(23, 67, 25000.00, 'pending', '67', 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=2500000&vnp_Command=pay&vnp_CreateDate=20251227142741&vnp_CurrCode=VND&vnp_ExpireDate=20251227144241&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=Thanh+toan+don+hang+67+HG+Coffee&vnp_OrderType=billpayment&vnp_ReturnUrl=http%3A%2F%2Flocalhost%3A3003%2Fapi%2Fpayments%2Fvnpay%2Freturn&vnp_TmnCode=H1SX11WS&vnp_TxnRef=67&vnp_Version=2.1.0&vnp_SecureHash=09c36908a41e68a7a97b9dce67c428c0cddfdb0bf5dfab75d37025ef77cfe0bbef64a35b9ca5c67ea057983fbe92434e2c1c1583a2f5b147df900bd9a36760ce', NULL, '\"{\\\"success\\\":true,\\\"paymentUrl\\\":\\\"https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=2500000&vnp_Command=pay&vnp_CreateDate=20251227142741&vnp_CurrCode=VND&vnp_ExpireDate=20251227144241&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=Thanh+toan+don+hang+67+HG+Coffee&vnp_OrderType=billpayment&vnp_ReturnUrl=http%3A%2F%2Flocalhost%3A3003%2Fapi%2Fpayments%2Fvnpay%2Freturn&vnp_TmnCode=H1SX11WS&vnp_TxnRef=67&vnp_Version=2.1.0&vnp_SecureHash=09c36908a41e68a7a97b9dce67c428c0cddfdb0bf5dfab75d37025ef77cfe0bbef64a35b9ca5c67ea057983fbe92434e2c1c1583a2f5b147df900bd9a36760ce\\\",\\\"orderCode\\\":67}\"', '2025-12-27 07:27:41', '2025-12-27 07:27:41', 'vnpay'),
(24, 68, 25000.00, 'pending', '68', 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=2500000&vnp_Command=pay&vnp_CreateDate=20251227143557&vnp_CurrCode=VND&vnp_ExpireDate=20251227145057&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=Thanh+toan+don+hang+68+HG+Coffee&vnp_OrderType=billpayment&vnp_ReturnUrl=http%3A%2F%2Flocalhost%3A3003%2Fapi%2Fpayments%2Fvnpay%2Freturn&vnp_TmnCode=H1SX11WS&vnp_TxnRef=68&vnp_Version=2.1.0&vnp_SecureHash=9dd5b62dd000c72e4d3cb68601a774ee3d43890f1097931a87c85620e1d96e8899f5723102f22e50af6f07afcf3f761a28b95fca3e400061385cc356a7e2e74a', NULL, '\"{\\\"success\\\":true,\\\"paymentUrl\\\":\\\"https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=2500000&vnp_Command=pay&vnp_CreateDate=20251227143557&vnp_CurrCode=VND&vnp_ExpireDate=20251227145057&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=Thanh+toan+don+hang+68+HG+Coffee&vnp_OrderType=billpayment&vnp_ReturnUrl=http%3A%2F%2Flocalhost%3A3003%2Fapi%2Fpayments%2Fvnpay%2Freturn&vnp_TmnCode=H1SX11WS&vnp_TxnRef=68&vnp_Version=2.1.0&vnp_SecureHash=9dd5b62dd000c72e4d3cb68601a774ee3d43890f1097931a87c85620e1d96e8899f5723102f22e50af6f07afcf3f761a28b95fca3e400061385cc356a7e2e74a\\\",\\\"orderCode\\\":68}\"', '2025-12-27 07:35:57', '2025-12-27 07:35:57', 'vnpay'),
(25, 69, 25000.00, 'pending', '69', 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=2500000&vnp_Command=pay&vnp_CreateDate=20251227144118&vnp_CurrCode=VND&vnp_ExpireDate=20251227145618&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=Thanh+toan+don+hang+69+HG+Coffee&vnp_OrderType=billpayment&vnp_ReturnUrl=http%3A%2F%2Flocalhost%3A3003%2Fapi%2Fpayments%2Fvnpay%2Freturn&vnp_TmnCode=H1SX11WS&vnp_TxnRef=69&vnp_Version=2.1.0&vnp_SecureHash=84f04389970b1f98aff9555f76d848db5483b200cbf07268f73c037b51b64c6dc8e438f211b3fba5505674049c7ac3e38cafc8863bed9d12b113f8b5350e7811', NULL, '\"{\\\"success\\\":true,\\\"paymentUrl\\\":\\\"https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=2500000&vnp_Command=pay&vnp_CreateDate=20251227144118&vnp_CurrCode=VND&vnp_ExpireDate=20251227145618&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=Thanh+toan+don+hang+69+HG+Coffee&vnp_OrderType=billpayment&vnp_ReturnUrl=http%3A%2F%2Flocalhost%3A3003%2Fapi%2Fpayments%2Fvnpay%2Freturn&vnp_TmnCode=H1SX11WS&vnp_TxnRef=69&vnp_Version=2.1.0&vnp_SecureHash=84f04389970b1f98aff9555f76d848db5483b200cbf07268f73c037b51b64c6dc8e438f211b3fba5505674049c7ac3e38cafc8863bed9d12b113f8b5350e7811\\\",\\\"orderCode\\\":69}\"', '2025-12-27 07:41:18', '2025-12-27 07:41:18', 'vnpay'),
(26, 70, 25000.00, 'completed', '15371462', 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=2500000&vnp_Command=pay&vnp_CreateDate=20251227145224&vnp_CurrCode=VND&vnp_ExpireDate=20251227150724&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=Thanh+toan+don+hang+70+HG+Coffee&vnp_OrderType=billpayment&vnp_ReturnUrl=http%3A%2F%2Flocalhost%3A3003%2Fapi%2Fpayments%2Fvnpay%2Freturn&vnp_TmnCode=H1SX11WS&vnp_TxnRef=70&vnp_Version=2.1.0&vnp_SecureHash=0471f6d828e07dbd1369dbed305ca6b03ef60b3a728f5416eb26a75db059cb33490fb62f0274d5c98b199995c8de377ec2dab09bd3f659eaad044777f61b19da', NULL, '\"{\\\"vnp_Amount\\\":\\\"2500000\\\",\\\"vnp_BankCode\\\":\\\"NCB\\\",\\\"vnp_BankTranNo\\\":\\\"VNP15371462\\\",\\\"vnp_CardType\\\":\\\"ATM\\\",\\\"vnp_OrderInfo\\\":\\\"Thanh toan don hang 70 HG Coffee\\\",\\\"vnp_PayDate\\\":\\\"20251227145718\\\",\\\"vnp_ResponseCode\\\":\\\"00\\\",\\\"vnp_TmnCode\\\":\\\"H1SX11WS\\\",\\\"vnp_TransactionNo\\\":\\\"15371462\\\",\\\"vnp_TransactionStatus\\\":\\\"00\\\",\\\"vnp_TxnRef\\\":\\\"70\\\",\\\"vnp_SecureHash\\\":\\\"98944dee7227d9dbffb246237a7222ff4bbaa8ddc7ae5071ecb120d2a6bbed781fd19c27aa13ccefa6db014664be0dac18a5419b2d3b1ca362a49bc733fa2493\\\"}\"', '2025-12-27 07:52:24', '2025-12-27 07:57:49', 'vnpay'),
(27, 71, 20000.00, 'completed', '15371497', 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=2000000&vnp_Command=pay&vnp_CreateDate=20251227153329&vnp_CurrCode=VND&vnp_ExpireDate=20251227154829&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=Thanh+toan+don+hang+71+HG+Coffee&vnp_OrderType=billpayment&vnp_ReturnUrl=http%3A%2F%2Flocalhost%3A3003%2Fapi%2Fpayments%2Fvnpay%2Freturn&vnp_TmnCode=H1SX11WS&vnp_TxnRef=71&vnp_Version=2.1.0&vnp_SecureHash=4418b56efaf8b7f00f82b76206c0303f383e83aadedae0a646bfb209adea128cb5e03b1c9faa8ec3db6e00b3217ffa7bb602c92da0959a70642bed2510bac389', NULL, '\"{\\\"vnp_Amount\\\":\\\"2000000\\\",\\\"vnp_BankCode\\\":\\\"NCB\\\",\\\"vnp_BankTranNo\\\":\\\"VNP15371497\\\",\\\"vnp_CardType\\\":\\\"ATM\\\",\\\"vnp_OrderInfo\\\":\\\"Thanh toan don hang 71 HG Coffee\\\",\\\"vnp_PayDate\\\":\\\"20251227153356\\\",\\\"vnp_ResponseCode\\\":\\\"00\\\",\\\"vnp_TmnCode\\\":\\\"H1SX11WS\\\",\\\"vnp_TransactionNo\\\":\\\"15371497\\\",\\\"vnp_TransactionStatus\\\":\\\"00\\\",\\\"vnp_TxnRef\\\":\\\"71\\\",\\\"vnp_SecureHash\\\":\\\"7149a1ddef1c080442b630a4d769186fadd7f43ea40392cf84e1eacef5f9618e53382598271255b4874cf783e2ff1651ec92aa94e79cee397389bd5c5fefa25d\\\"}\"', '2025-12-27 08:33:29', '2025-12-27 08:34:03', 'vnpay'),
(28, 72, 25000.00, 'completed', '15376729', 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=2500000&vnp_Command=pay&vnp_CreateDate=20251231134830&vnp_CurrCode=VND&vnp_ExpireDate=20251231140330&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=Thanh+toan+don+hang+72+HG+Coffee&vnp_OrderType=billpayment&vnp_ReturnUrl=http%3A%2F%2Flocalhost%3A3003%2Fapi%2Fpayments%2Fvnpay%2Freturn&vnp_TmnCode=H1SX11WS&vnp_TxnRef=72&vnp_Version=2.1.0&vnp_SecureHash=12bc6e9187fccb6e29d61f911d9f57f453fb5f0932ec224063b8555956cd49bd39a011b44fd3667fc2fe212c412d5ae484317af32960dba9e86d2324c20992e6', NULL, '\"{\\\"vnp_Amount\\\":\\\"2500000\\\",\\\"vnp_BankCode\\\":\\\"NCB\\\",\\\"vnp_BankTranNo\\\":\\\"VNP15376729\\\",\\\"vnp_CardType\\\":\\\"ATM\\\",\\\"vnp_OrderInfo\\\":\\\"Thanh toan don hang 72 HG Coffee\\\",\\\"vnp_PayDate\\\":\\\"20251231134932\\\",\\\"vnp_ResponseCode\\\":\\\"00\\\",\\\"vnp_TmnCode\\\":\\\"H1SX11WS\\\",\\\"vnp_TransactionNo\\\":\\\"15376729\\\",\\\"vnp_TransactionStatus\\\":\\\"00\\\",\\\"vnp_TxnRef\\\":\\\"72\\\",\\\"vnp_SecureHash\\\":\\\"87defa3024c2558bc5a961cc5365032af64b7f9a0e291867221f8bcdb43dc5bdc9511796fd90e8bfe0f084df10bc27d5b33cbe0546dd065d9b032b373eac0fce\\\"}\"', '2025-12-31 06:48:30', '2025-12-31 06:49:42', 'vnpay'),
(29, 73, 75000.00, 'completed', '15376762', 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=7500000&vnp_Command=pay&vnp_CreateDate=20251231140851&vnp_CurrCode=VND&vnp_ExpireDate=20251231142351&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=Thanh+toan+don+hang+73+HG+Coffee&vnp_OrderType=billpayment&vnp_ReturnUrl=http%3A%2F%2Flocalhost%3A3003%2Fapi%2Fpayments%2Fvnpay%2Freturn&vnp_TmnCode=H1SX11WS&vnp_TxnRef=73&vnp_Version=2.1.0&vnp_SecureHash=e2d4562ba6f74096783cc69689e38e4fe2b6014d93e00438edc655616b458c8b9f445e999b2b9a171eaeb9da3c75b77c560f1652216f10834267492993d7266a', NULL, '\"{\\\"vnp_Amount\\\":\\\"7500000\\\",\\\"vnp_BankCode\\\":\\\"NCB\\\",\\\"vnp_BankTranNo\\\":\\\"VNP15376762\\\",\\\"vnp_CardType\\\":\\\"ATM\\\",\\\"vnp_OrderInfo\\\":\\\"Thanh toan don hang 73 HG Coffee\\\",\\\"vnp_PayDate\\\":\\\"20251231140941\\\",\\\"vnp_ResponseCode\\\":\\\"00\\\",\\\"vnp_TmnCode\\\":\\\"H1SX11WS\\\",\\\"vnp_TransactionNo\\\":\\\"15376762\\\",\\\"vnp_TransactionStatus\\\":\\\"00\\\",\\\"vnp_TxnRef\\\":\\\"73\\\",\\\"vnp_SecureHash\\\":\\\"1de3c858ccc02a363ab8799bc52fbd565f51f3afe328d0d50ee661061dd74e45f66ec1f7c043a803705e1da730e84bc16d6509f647db0d0819ead839e88cad3a\\\"}\"', '2025-12-31 07:08:51', '2025-12-31 07:09:45', 'vnpay'),
(30, 88, 30000.00, 'pending', '88', 'https://dl.vietqr.io/pay?app=tpb&bank=970423&account=00000112751&amount=30000&memo=HG%2088', NULL, '\"{\\\"success\\\":true,\\\"qrCode\\\":\\\"https://img.vietqr.io/image/970423-00000112751-compact.png?amount=30000&addInfo=HG%2088&accountName=HG%20COFFEE\\\",\\\"transferContent\\\":\\\"HG 88\\\",\\\"accountInfo\\\":{\\\"accountNumber\\\":\\\"00000112751\\\",\\\"accountName\\\":\\\"HG COFFEE\\\",\\\"bankCode\\\":\\\"TPB\\\",\\\"bankName\\\":\\\"TPBank\\\"},\\\"amount\\\":30000,\\\"orderId\\\":88}\"', '2026-01-16 07:30:51', '2026-01-16 07:30:51', 'sepay'),
(31, 89, 30000.00, 'pending', '89', 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=3000000&vnp_Command=pay&vnp_CreateDate=20260116143132&vnp_CurrCode=VND&vnp_ExpireDate=20260116144632&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=Thanh+toan+don+hang+89+HG+Coffee&vnp_OrderType=billpayment&vnp_ReturnUrl=http%3A%2F%2Flocalhost%3A3003%2Fapi%2Fpayments%2Fvnpay%2Freturn&vnp_TmnCode=H1SX11WS&vnp_TxnRef=89&vnp_Version=2.1.0&vnp_SecureHash=4c876210f76194738b5aaeda21a60fc61b55441c99f7121ac5ac3fad50b28ac9e92035a9c77b29c5599056821f673f2aad803edd8cbed2edd547c9d8cae9404e', NULL, '\"{\\\"success\\\":true,\\\"paymentUrl\\\":\\\"https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=3000000&vnp_Command=pay&vnp_CreateDate=20260116143132&vnp_CurrCode=VND&vnp_ExpireDate=20260116144632&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=Thanh+toan+don+hang+89+HG+Coffee&vnp_OrderType=billpayment&vnp_ReturnUrl=http%3A%2F%2Flocalhost%3A3003%2Fapi%2Fpayments%2Fvnpay%2Freturn&vnp_TmnCode=H1SX11WS&vnp_TxnRef=89&vnp_Version=2.1.0&vnp_SecureHash=4c876210f76194738b5aaeda21a60fc61b55441c99f7121ac5ac3fad50b28ac9e92035a9c77b29c5599056821f673f2aad803edd8cbed2edd547c9d8cae9404e\\\",\\\"orderCode\\\":89}\"', '2026-01-16 07:31:32', '2026-01-16 07:31:32', 'vnpay'),
(32, 90, 30000.00, 'pending', '90', 'https://dl.vietqr.io/pay?app=tpb&bank=970423&account=00000112751&amount=30000&memo=HG%2090', NULL, '\"{\\\"success\\\":true,\\\"qrCode\\\":\\\"https://img.vietqr.io/image/970423-00000112751-compact.png?amount=30000&addInfo=HG%2090&accountName=HG%20COFFEE\\\",\\\"transferContent\\\":\\\"HG 90\\\",\\\"accountInfo\\\":{\\\"accountNumber\\\":\\\"00000112751\\\",\\\"accountName\\\":\\\"HG COFFEE\\\",\\\"bankCode\\\":\\\"TPB\\\",\\\"bankName\\\":\\\"TPBank\\\"},\\\"amount\\\":30000,\\\"orderId\\\":90}\"', '2026-01-16 08:04:50', '2026-01-16 08:04:50', 'sepay');

-- --------------------------------------------------------

--
-- Table structure for table `prodetails`
--

CREATE TABLE `prodetails` (
  `id` int NOT NULL,
  `name` text NOT NULL,
  `product_id` int NOT NULL,
  `size_id` int NOT NULL,
  `store_id` int DEFAULT NULL,
  `buyturn` int DEFAULT NULL,
  `specification` text,
  `price` int DEFAULT NULL,
  `oldprice` int DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `img1` text,
  `img2` text,
  `img3` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `prodetails`
--

INSERT INTO `prodetails` (`id`, `name`, `product_id`, `size_id`, `store_id`, `buyturn`, `specification`, `price`, `oldprice`, `quantity`, `img1`, `img2`, `img3`, `createdAt`, `updatedAt`) VALUES
(2, 'Matcha Latte (Size S)', 6, 1, 1, NULL, NULL, 30000, 45000, 100, NULL, NULL, NULL, '2025-06-18 10:15:33', '2025-06-18 10:15:33'),
(3, 'Matcha Latte (Size M)', 6, 2, 1, 0, 'Matcha Latte ...', 29000, 45000, 100, '', '', '', '2025-06-18 10:15:40', '2026-01-10 06:57:36'),
(6, 'Matcha Latte (Size L)', 6, 3, 1, 0, 'L', 40000, 45000, 100, '', '', '', '2025-06-28 07:23:41', '2025-06-28 07:23:41'),
(7, 'Cà phê sữa (Size S)', 1, 1, 1, 0, 'Gói tiêu chuẩn', 25000, 30000, 100, '', '', '', '2025-06-28 07:24:51', '2025-07-06 16:26:01'),
(8, 'Cà phê sữa (Size M)', 1, 2, 1, 0, 'Gói tiêu chuẩn', 29000, 40000, 100, '', '', '', '2025-06-28 07:26:19', '2026-01-10 06:57:47'),
(9, 'Cà phê sữa (Size L)', 1, 3, 1, 0, 'Gói tiêu chuẩn', 35000, 40000, 100, '', '', '', '2025-06-28 07:26:27', '2025-08-18 11:40:50'),
(10, 'Cà phê đá (Size S)', 4, 1, 1, 0, 'Gói tiêu chuẩn', 20000, 25000, 100, '', '', '', '2025-06-28 07:26:34', '2025-07-06 15:46:28'),
(11, 'Cà phê đá (Size M)', 4, 2, 1, 0, 'Gói tiêu chuẩn', 25000, 30000, 100, '', '', '', '2025-06-28 07:26:41', '2025-07-06 15:46:36'),
(12, 'Cà phê đá (Size L)', 4, 3, 1, 4, 'Gói tiêu chuẩn', 30000, 35000, 96, '', '', '', '2025-06-28 07:26:48', '2026-01-16 08:04:50'),
(13, 'Trà đào (Size S)', 5, 1, 1, 14, 'Gói tiêu chuẩn', 22000, 27000, 86, '', '', '', '2025-06-28 07:27:01', '2026-01-14 16:41:24'),
(14, 'Trà đào (Size M)', 5, 2, 1, 0, 'Gói tiêu chuẩn', 27000, 32000, 100, '', '', '', '2025-06-28 07:27:13', '2025-07-06 15:48:31'),
(15, 'Trà đào (Size L)', 5, 3, 1, 0, 'Gói tiêu chuẩn', 32000, 37000, 100, '', '', '', '2025-06-28 07:27:20', '2025-07-06 15:49:01'),
(16, 'Latte Đá (Size S)', 7, 1, 1, 20, 'S', 30000, 35000, 100, '', '', '', '2025-07-06 15:50:36', '2026-01-15 07:21:35'),
(17, 'Latte Đá (Size M)', 7, 2, 1, 0, 'M', 35000, 40000, 100, '', '', '', '2025-07-06 15:50:53', '2025-07-06 15:50:53'),
(18, 'Latte Đá (Size L)', 7, 3, 1, 0, 'L', 40000, 45000, 100, '', '', '', '2025-07-06 15:51:13', '2025-07-06 15:51:13'),
(19, 'Trà Sữa Đài Loan (Size S)', 8, 1, 1, 30, 'S', 32000, 37000, 100, '', '', '', '2025-07-06 15:51:29', '2026-01-15 07:21:43'),
(20, 'Trà Sữa Đài Loan (Size M)', 8, 2, 1, 0, 'M', 37000, 42000, 100, '', '', '', '2025-07-06 15:51:37', '2025-07-06 15:51:37'),
(21, 'Trà Sữa Đài Loan (Size L)', 8, 3, 1, 0, 'L', 42000, 47000, 100, NULL, NULL, NULL, '2025-07-06 15:51:48', '2025-07-06 15:51:48'),
(22, 'Trà Sữa Hojicha (Size S)', 9, 1, 1, 0, 'S', 33000, 38000, 100, NULL, NULL, NULL, '2025-07-06 15:52:12', '2025-07-06 15:52:12'),
(23, 'Trà Sữa Hojicha (Size M)', 9, 2, 1, 0, 'M', 38000, 43000, 100, NULL, NULL, NULL, '2025-07-06 15:52:25', '2025-07-06 15:52:25'),
(24, 'Trà Sữa Hojicha (Size L)', 9, 3, 1, 20, 'L', 45000, 49000, 100, '', '', '', '2025-07-06 15:52:32', '2026-01-15 06:46:43'),
(25, 'Trà Xanh Sữa (Size S)', 10, 1, 1, 0, 'S', 32000, 37000, 100, NULL, NULL, NULL, '2025-07-06 15:57:40', '2025-07-06 15:57:40'),
(26, 'Trà Xanh Sữa (Size M)', 10, 2, 1, 0, 'M', 37000, 42000, 100, NULL, NULL, NULL, '2025-07-06 15:57:49', '2025-07-06 15:57:49'),
(27, 'Trà Xanh Sữa (Size L)', 10, 3, 1, 30, 'L', 45000, 49000, 100, '', '', '', '2025-07-06 15:57:56', '2026-01-15 06:47:15'),
(28, 'Trà Sen Vàng (Size S)', 11, 1, 1, 0, 'S', 33000, 38000, 100, NULL, NULL, NULL, '2025-07-06 15:58:03', '2025-07-06 15:58:03'),
(29, 'Trà Sen Vàng (Size M)', 11, 2, 1, 0, 'M', 38000, 43000, 100, NULL, NULL, NULL, '2025-07-06 15:58:08', '2025-07-06 15:58:08'),
(30, 'Trà Sen Vàng (Size L)', 11, 3, 1, 0, 'L', 43000, 48000, 100, NULL, NULL, NULL, '2025-07-06 15:58:16', '2025-07-06 15:58:16'),
(31, 'Trà Vải (Size S)', 12, 1, 1, 0, 'S', 32000, 36000, 100, NULL, NULL, NULL, '2025-07-06 15:58:25', '2025-07-06 15:58:25'),
(32, 'Trà Vải (Size M)', 12, 2, 1, 0, 'M', 37000, 42000, 100, NULL, NULL, NULL, '2025-07-06 15:58:32', '2025-07-06 15:58:32'),
(33, 'Trà Vải (Size L)', 12, 3, 1, 0, 'L', 42000, 47000, 100, NULL, NULL, NULL, '2025-07-06 15:58:38', '2025-07-06 15:58:38'),
(34, 'Bánh Mì Pate', 13, 2, 1, 0, '1 ổ', 25000, 28000, 100, NULL, NULL, NULL, '2025-07-06 15:58:48', '2025-07-06 15:58:48'),
(35, 'Bánh Mì Gà Phô Mai', 14, 2, 1, 0, '1 ổ', 30000, 35000, 100, NULL, NULL, NULL, '2025-07-06 15:59:00', '2025-07-06 15:59:00'),
(38, 'Cappuccino nóng (Size S)', 15, 1, 1, 0, 'Cappuccino nóng (Size S)', 29000, 35000, 100, '', '', '', '2025-08-17 06:33:01', '2025-08-17 06:33:01');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text,
  `image` text,
  `brand_id` int DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `image`, `brand_id`, `category_id`, `createdAt`, `updatedAt`) VALUES
(1, 'Cà Phê Sữa', 'Cà phê sữa đá của HG Coffee được pha phin từ hạt cà phê Robusta rang mộc, giữ trọn vị đậm đà và hương thơm tự nhiên. Thức uống mát lạnh, sảng khoái cho một ngày mới đầy năng lượng.', 'https://firebasestorage.googleapis.com/v0/b/hg-store-a11c5.firebasestorage.app/o/media-library%2F1768021439576-ca-phe-sua.jpg?alt=media&token=37e49329-1e48-44e3-b3ea-b050986d2c43', 1, 1, '2025-06-08 09:40:06', '2026-01-10 05:06:20'),
(4, 'Cà Phê Đá', 'Cà phê đá của HG Coffee được pha phin từ hạt cà phê Robusta rang mộc, giữ trọn vị đậm đà và hương thơm tự nhiên. Thức uống mát lạnh, sảng khoái cho một ngày mới đầy năng lượng.', 'https://firebasestorage.googleapis.com/v0/b/hg-store-a11c5.firebasestorage.app/o/media-library%2F1768021438236-ca-phe-da.jpg?alt=media&token=0c6e477d-cf5c-4696-b8cf-39a77803a05b', 1, 1, '2025-06-08 09:41:24', '2026-01-10 05:06:36'),
(5, 'Trà Đào Cam Sả', 'Trà đào thanh mát kết hợp giữa vị trà tự nhiên và miếng đào giòn ngọt, mang đến cảm giác sảng khoái, dễ chịu. Thức uống lý tưởng cho những ngày nắng nóng hay cần thư giãn nhẹ nhàng.', 'https://firebasestorage.googleapis.com/v0/b/hg-store-a11c5.firebasestorage.app/o/media-library%2F1768021441212-tra-dao-cam-xa.jpg?alt=media&token=9e524a9d-a277-442b-a925-e5a2cab48e21', 1, 2, '2025-06-08 09:46:12', '2026-01-10 05:06:51'),
(6, 'Matcha Latte', 'Matcha Latte thơm dịu, kết hợp giữa vị đắng nhẹ đặc trưng của bột trà xanh Nhật Bản và vị béo ngậy của sữa tươi. Thức uống thanh mát, giúp tỉnh táo nhẹ nhàng và thư giãn tinh thần.', 'https://firebasestorage.googleapis.com/v0/b/hg-store-a11c5.firebasestorage.app/o/media-library%2F1767765971080-matcha.png?alt=media&token=be5b2292-6654-4f27-a26c-528ca90e6016', 1, 8, '2025-06-18 10:15:07', '2026-01-10 05:07:13'),
(7, 'Latte Đá', 'Matcha Latte đá mang hương vị thanh mát, kết hợp giữa trà xanh nguyên chất và sữa tươi béo nhẹ. Đá viên làm tăng độ sảng khoái, giúp tỉnh táo và thư giãn trong những ngày oi nóng.', 'https://firebasestorage.googleapis.com/v0/b/hg-store-a11c5.firebasestorage.app/o/media-library%2F1768039427745-Screenshot%202026-01-10%20170059.png?alt=media&token=1a02cfdb-ceeb-411e-93ad-d91b123b2e42', 1, 8, '2025-07-06 08:54:42', '2026-01-10 10:06:48'),
(8, 'Trà Sữa Đài Loan', 'Trà sữa Đài Loan nổi bật với hương trà đậm đà hoà quyện cùng sữa béo ngậy, kèm topping trân châu dẻo dai. Vị ngọt thanh, thơm mát, là thức uống được giới trẻ yêu thích mọi thời điểm.', 'https://firebasestorage.googleapis.com/v0/b/hg-store-a11c5.firebasestorage.app/o/media-library%2F1767859156662-trasua.jpg?alt=media&token=6b364a99-9428-42e6-8b0c-945454175f43', 1, 10, '2025-07-06 09:00:05', '2026-01-10 05:10:01'),
(9, 'Trà Sữa Hojicha', 'Trà sữa Hojicha mang hương vị trà xanh rang độc đáo đến từ Nhật Bản, thơm nhẹ mùi khói, kết hợp cùng sữa tươi béo nhẹ tạo nên thức uống dịu êm, ấm áp và dễ chịu.', 'https://firebasestorage.googleapis.com/v0/b/hg-store-a11c5.firebasestorage.app/o/media-library%2F1767864685210-Iced-Hojicha-Latte-3625-III-a.jpg?alt=media&token=8513ed7d-134e-45f2-8a35-008a8e20adff', 1, 10, '2025-07-06 09:02:37', '2026-01-10 05:10:28'),
(10, 'Trà Xanh Sữa', 'Trà Xanh Sữa mang hương vị trà xanh rang độc đáo đến từ Nhật Bản kết hợp cùng sữa tươi béo nhẹ tạo nên thức uống dịu êm, ấm áp và dễ chịu.', 'https://firebasestorage.googleapis.com/v0/b/hg-store-a11c5.firebasestorage.app/o/media-library%2F1768022355084-tra-xanh-sua.webp?alt=media&token=4fb9f6d1-fbc7-43b3-a65e-67f114387916', 1, 10, '2025-07-06 09:04:54', '2026-01-10 10:06:56'),
(11, 'Trà Sen Vàng', 'Trà sen vàng thanh mát, kết hợp giữa hương trà xanh dịu nhẹ và vị thơm bùi của hạt sen. Thức uống giúp giải nhiệt, thư giãn tinh thần, thích hợp cho mọi độ tuổi.', 'https://firebasestorage.googleapis.com/v0/b/hg-store-a11c5.firebasestorage.app/o/media-library%2F1768022354347-Tra-sen-vang.webp?alt=media&token=f17550e8-cdad-4cea-9097-067d22c6b6b2', 1, 2, '2025-07-06 09:08:23', '2026-01-10 05:25:55'),
(12, 'Trà Vải', 'Trà vải thơm mát, kết hợp giữa vị trà xanh nhẹ và vị ngọt thanh của trái vải tươi. Thức uống mang đến cảm giác sảng khoái, thích hợp cho ngày hè hoặc lúc cần giải nhiệt.', 'https://firebasestorage.googleapis.com/v0/b/hg-store-a11c5.firebasestorage.app/o/media-library%2F1768021442817-tra-vai.webp?alt=media&token=c3032391-f054-48cd-a81d-b80a9d52c05d', 1, 2, '2025-07-06 09:11:34', '2026-01-10 05:26:53'),
(13, 'Bánh Mì Pate', 'Bánh mì pate đậm đà với lớp pate gan béo mịn, kèm dưa leo, đồ chua và rau thơm, tất cả được kẹp trong ổ bánh giòn rụm. Món ăn nhanh gọn, ngon miệng và đầy đủ dinh dưỡng.', 'https://firebasestorage.googleapis.com/v0/b/hg-store-a11c5.firebasestorage.app/o/media-library%2F1767859145030-banh-mi-pate.png?alt=media&token=8e44f72c-7618-4b7d-92a7-a5f47f4ffc01', 1, 3, '2025-07-06 09:14:35', '2026-01-10 05:27:04'),
(14, 'Bánh Mì Thịt', 'Bánh mì kẹp gà chiên giòn kết hợp phô mai béo ngậy, ăn kèm dưa leo, rau thơm và sốt đậm đà. Giòn rụm bên ngoài, đậm vị bên trong, thích hợp cho bữa sáng hoặc ăn nhẹ.', 'https://firebasestorage.googleapis.com/v0/b/hg-store-a11c5.firebasestorage.app/o/media-library%2F1767859150476-banh-mi-thit.png?alt=media&token=0d766cf4-71bb-44be-a084-8667c6163a5f', 1, 3, '2025-07-06 09:16:01', '2026-01-10 05:27:25'),
(15, 'Cappuccino nóng', 'Cappuccino là sự hòa quyện cân bằng giữa cà phê Espresso đậm đà, sữa nóng béo nhẹ và lớp bọt sữa mịn màng. Vị cà phê mạnh nhưng vẫn dễ uống, lý tưởng cho buổi sáng năng động.', 'https://firebasestorage.googleapis.com/v0/b/hg-store-a11c5.firebasestorage.app/o/media-library%2F1768022353425-ca-pu-chia-no.jpg?alt=media&token=1938bdda-4ea0-4b03-9bac-31cd1b9e9d1a', 1, 8, '2025-07-06 09:23:06', '2026-01-10 05:27:57');

-- --------------------------------------------------------

--
-- Table structure for table `product_images`
--

CREATE TABLE `product_images` (
  `id` int NOT NULL,
  `product_id` int DEFAULT NULL,
  `image_url` text NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `product_images`
--

INSERT INTO `product_images` (`id`, `product_id`, `image_url`, `createdAt`, `updatedAt`) VALUES
(2, 1, '1751104586004-phin-sua-da-eae59734-6d54-471e-a34f-7ffe0fb68e6c.webp', '2025-06-29 06:31:30', '2025-06-29 06:31:30');

-- --------------------------------------------------------

--
-- Table structure for table `SequelizeMeta`
--

CREATE TABLE `SequelizeMeta` (
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `SequelizeMeta`
--

INSERT INTO `SequelizeMeta` (`name`) VALUES
('20250527114208-create-user.js'),
('20250527114217-create-category.js'),
('20250527114255-create-brand.js'),
('20250527114300-create-product.js'),
('20250527114300-create-store.js'),
('20250527114304-create-size.js'),
('20250527114313-create-pro-detail.js'),
('20250527114320-create-order.js'),
('20250527114325-create-order-detail.js'),
('20250527114331-create-news.js'),
('20250527114339-create-news-detail.js'),
('20250527114344-create-banner.js'),
('20250527114349-create-banner-detail.js'),
('20250527114502-create-feed-back.js'),
('20250605121008-rename-productid-column-prodetails.js'),
('20250607082238-alter-phone-column-in-orders.js'),
('20250607082238-alter-phone-column-in-users.js'),
('20250607082245-alter-image-column-in-store.js'),
('20250628091046-create-product-image.js'),
('20250702085005-add_session_to_order.js'),
('20250702091148-create-cart.js'),
('20250702091149-create-cart-item.js'),
('20250702091153-create-payment.js'),
('20251223074645-create-payment.js'),
('20251227081658-add-payment-status-to-orders.js'),
('202512270912355-create-media-library.js'),
('20251227091253-remove-payment-status-from-orders.js'),
('20260116070620-update-payment-method-enum.js');

-- --------------------------------------------------------

--
-- Table structure for table `sizes`
--

CREATE TABLE `sizes` (
  `id` int NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `sizes`
--

INSERT INTO `sizes` (`id`, `name`, `createdAt`, `updatedAt`) VALUES
(1, 'S', '2025-06-08 09:29:15', '2025-06-08 09:29:15'),
(2, 'M', '2025-06-08 09:29:20', '2025-06-08 09:29:20'),
(3, 'L', '2025-06-08 09:29:24', '2025-06-08 09:29:24');

-- --------------------------------------------------------

--
-- Table structure for table `stores`
--

CREATE TABLE `stores` (
  `id` int NOT NULL,
  `storeName` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `phoneNumber` varchar(255) DEFAULT NULL,
  `openTime` time DEFAULT NULL,
  `closeTime` time DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `stores`
--

INSERT INTO `stores` (`id`, `storeName`, `address`, `phoneNumber`, `openTime`, `closeTime`, `createdAt`, `updatedAt`, `image`) VALUES
(1, 'HG Coffee Tạ Uyên', '134 Tạ Uyên', '0774162631', '06:30:00', '23:00:00', '2025-06-05 04:04:19', '2025-08-17 05:58:05', 'https://firebasestorage.googleapis.com/v0/b/hg-store-a11c5.firebasestorage.app/o/images%2F1751717612467-TaUyenCoffee.png?alt=media&token=a372b0f8-bed3-4bb6-9e7b-89ad3508db3d'),
(2, 'HG Coffee Hàn Hải Nguyên', '278 Đ. Hàn Hải Nguyên ', '0774162631', NULL, NULL, '2025-06-05 04:04:19', '2025-07-05 12:18:43', 'https://firebasestorage.googleapis.com/v0/b/hg-store-a11c5.firebasestorage.app/o/images%2F1751717571210-HanHaiNguyenCoffee.png?alt=media&token=0bd07fc3-5b24-4a0b-8fe2-45d85bb04602'),
(3, 'HG Coffee Lãnh Binh Thăng', 'Dương Đình Nghệ/281A Lãnh Binh Thăng ', '0774162631', NULL, NULL, '2025-06-05 04:04:19', '2025-07-05 12:19:39', 'https://firebasestorage.googleapis.com/v0/b/hg-store-a11c5.firebasestorage.app/o/images%2F1751717595766-LanhBinhThangCoffee.png?alt=media&token=160f6031-210a-405c-b714-a4b5c25a67a8');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `role` int DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `phone` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `address` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `is_locked` tinyint(1) DEFAULT '0',
  `password_changed_ad` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `name`, `role`, `avatar`, `phone`, `address`, `createdAt`, `updatedAt`, `is_locked`, `password_changed_ad`) VALUES
(1, 'damhoagiai456@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$v7/yuj8Pt+H6mjyKFEvBxQ$outRqlVqbupeROOSHyf+/dP4xRNKz6ZcljXqeIrfTIc', 'Hoa Giai', 2, NULL, '0774162639', NULL, '2025-07-08 13:19:31', '2025-07-08 13:19:31', 0, NULL),
(2, 'damhoagiai123@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$vTla18pQrZaAJIe3F3m/oQ$bFlCwXF1XxI9O4i2SR7BDF4hhzsHUMhba1Gyu2Mk5ZY', 'Hòa Giai', 1, NULL, '0774162633', ' 50 Lò Siêu, P.16, Q.11', '2025-07-09 14:24:36', '2025-07-09 14:24:36', 0, NULL),
(3, NULL, '$argon2id$v=19$m=65536,t=3,p=4$dGo4RICbk5fDMG+rs+BP9g$iF50kNTu4EHTaWRTBehaTcH4RsSJa5oD3AZmGMSXo48', 'Hoa Giai', 1, NULL, '0774162632', ' 50 Lò Siêu, P.16, Q.11', '2025-07-09 14:41:24', '2025-07-09 14:41:24', 0, NULL),
(4, 'damhoagiai123@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$TR8X9uOcoIVDRuKWtwbyyg$M01cZ4arCPtDWX2rnnYZdia/Czok0n5GDF33bVy8o1s', 'Hòa Giai', 1, NULL, '0774162636', ' 50 Lò Siêu, P.16, Q.11', '2025-07-13 15:13:41', '2025-07-13 15:13:41', 0, NULL),
(5, 'damhoagiai@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$OVBPWcZ+3JwSbvBhvhnR6g$QOrrSrfIQmtnB4Fa6ALnFK3+OJ9ttc05BWGFi2jtXZ0', 'Hoa Giai', 1, NULL, NULL, ' 50 Lò Siêu, P.16, Q.11', '2025-07-13 15:26:48', '2025-07-13 15:26:48', 0, NULL),
(6, 'hieungao2005@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$x4WIRmBQElYbpahX99fonQ$KKH7fzmkJQzLmmaxZ10EXMAOHRz7y6tJ5OvaYx0MchI', 'Giai', 1, NULL, '0774162637', '50 Lo sieu', '2025-07-15 09:45:22', '2025-07-15 09:45:22', 0, NULL),
(7, 'damhoagiai000@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$2YfFbbQSzSZPVBppOcS+Ig$TKrqGB8JvPKbtmdnpOMUCLDnWik/pCcAYMmgBNUC/Zk', 'Hoa Giai', 1, NULL, NULL, ' 50 Lò Siêu, P.16, Q.11', '2025-07-17 06:26:09', '2025-07-17 06:26:09', 0, NULL),
(8, 'giai@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$qn1a4UswCeob7+OZMGzClA$Xejq+c+WNCuhla29o+J4LBYLhuOejyu13fxcCVTTitg', 'Hoa Giai', 2, NULL, '0776666181', ' 50 Lò Siêu, P.16, Q.11', '2025-07-18 07:22:24', '2025-07-18 07:22:24', 0, NULL),
(9, 'hgiai3012@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$s4/ELQHLHGKY84Q3/MJ0cg$yKLBRpvpL9cmVU5zB3kB57oeh0zF3Z7PWl0QlXCPWW8', 'Hoa Giai', 1, NULL, '0774162631', ' 50 Lò Siêu, P.16, Q.11', '2025-07-18 08:01:14', '2025-07-18 08:01:14', 0, NULL),
(10, 'admin@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$E5HN5iWPpqcGbaYEHkmkhw$WtBpMy6UEOvkJsDNDOmZ4TWHqpOSKWXAztpI2Qz5wwM', 'Hieu ngu nhu con trau', 2, NULL, NULL, ' Long An - Tây Ninh', '2025-07-25 12:37:31', '2025-07-25 12:37:31', 0, NULL),
(11, 'Test@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$Ow9DZoIrf+zczB3XeQ6AiA$6DqMVyUjHNeQuCAIZdLEGVdKG9mRm3172b1voj4RAvc', 'Hoa giai 123', 1, '', '0774162628', '1 Bến Thành', '2025-08-08 10:13:26', '2025-08-08 10:13:26', 0, NULL),
(12, 'Test123@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$JogtBMUPrybOctAoPd9TlA$WP8fKvbbULrWLRA/fwN8jnXUyM1wh+RoOyRSzN0DCFg', 'Hoa giai 123', 1, '', '0776666180', 'Test123', '2025-08-08 10:17:57', '2025-08-08 10:17:57', 0, NULL),
(13, 'g@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$xy/rRCPGFDy0dPQ8qlzibw$MqVhdEh5CnzFLpjLhtgKnFUAf1hkF+3U6S78JFJn45U', 'Hòa Giai', 1, NULL, '0774162000', '50 lo sieu', '2025-08-12 08:24:53', '2025-08-12 08:24:53', 0, NULL),
(14, 'hgiai111@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$NWs401DEGTfO2Hi01tEHtg$x/WQ58zDhd1N/FyZ5P6Q//0VyYbyoBAQBnN0UFVSKGw', 'giai', 1, NULL, '0774162600', '412 NVQ', '2025-08-14 08:37:21', '2025-08-14 08:37:21', 0, NULL),
(15, 'nblue0912@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$/H7EXd++cKfxuSJQpUJJHQ$4WWmMMHPoGVBPLAlR0ADW9WoiYFjBnHKwtzq4a6ZtTc', 'bbi gơ', 1, NULL, '0764699676', '172 tạ uyên', '2025-12-22 09:30:49', '2025-12-22 09:30:49', 0, NULL),
(16, NULL, '$argon2id$v=19$m=65536,t=3,p=4$TEwu6VIoWhvlFaFq+ES0jA$dT+N6KAXkeRnPkJgPNaIHsIjFByY2A14iZrXf0Y2gJc', 'Hoa Giai', 1, NULL, '0778888888', ' 50 Lò Siêu, P.16, Q.11', '2026-01-02 08:39:40', '2026-01-02 08:39:40', 0, NULL),
(17, 'hgiai123@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$Go4iZ958kHepzMfa8Tm+1w$XDBdN8mLX4VpV4JE8GZ+4VVd/+YNFZGBO5UgC8ES6Hs', 'Hòa Giai đẹp trai', 1, NULL, '0788888889', '50 Lò Siêu', '2026-01-02 08:41:12', '2026-01-02 08:41:12', 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users_backup`
--

CREATE TABLE `users_backup` (
  `id` int NOT NULL DEFAULT '0',
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `role` int DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `address` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bannerdetails`
--
ALTER TABLE `bannerdetails`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `banner_id` (`banner_id`);

--
-- Indexes for table `banners`
--
ALTER TABLE `banners`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `session_id` (`session_id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cart_id` (`cart_id`),
  ADD KEY `product_detail_id` (`product_detail_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `media_library`
--
ALTER TABLE `media_library`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_media_uploaded_by` (`uploaded_by`),
  ADD KEY `idx_media_created_at` (`createdAt`),
  ADD KEY `idx_media_mime_type` (`mime_type`);

--
-- Indexes for table `news`
--
ALTER TABLE `news`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `newsdetails`
--
ALTER TABLE `newsdetails`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `news_id` (`news_id`);

--
-- Indexes for table `orderdetails`
--
ALTER TABLE `orderdetails`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_detail_id` (`product_detail_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `payos_order_code` (`payos_order_code`),
  ADD KEY `payments_order_id` (`order_id`),
  ADD KEY `payments_transaction_id` (`transaction_id`),
  ADD KEY `payments_payos_order_code` (`payos_order_code`),
  ADD KEY `payments_status` (`status`),
  ADD KEY `idx_payments_order_id` (`order_id`),
  ADD KEY `idx_payments_transaction_id` (`transaction_id`),
  ADD KEY `idx_payments_payos_order_code` (`payos_order_code`),
  ADD KEY `idx_payments_status` (`status`);

--
-- Indexes for table `prodetails`
--
ALTER TABLE `prodetails`
  ADD PRIMARY KEY (`id`),
  ADD KEY `prouduct_id` (`product_id`),
  ADD KEY `size_id` (`size_id`),
  ADD KEY `store_id` (`store_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `brand_id` (`brand_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `SequelizeMeta`
--
ALTER TABLE `SequelizeMeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `sizes`
--
ALTER TABLE `sizes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `stores`
--
ALTER TABLE `stores`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bannerdetails`
--
ALTER TABLE `bannerdetails`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `banners`
--
ALTER TABLE `banners`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `brands`
--
ALTER TABLE `brands`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `carts`
--
ALTER TABLE `carts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=114;

--
-- AUTO_INCREMENT for table `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=165;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `feedbacks`
--
ALTER TABLE `feedbacks`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `media_library`
--
ALTER TABLE `media_library`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `news`
--
ALTER TABLE `news`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `newsdetails`
--
ALTER TABLE `newsdetails`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT for table `orderdetails`
--
ALTER TABLE `orderdetails`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=106;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=91;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `prodetails`
--
ALTER TABLE `prodetails`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `sizes`
--
ALTER TABLE `sizes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `stores`
--
ALTER TABLE `stores`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bannerdetails`
--
ALTER TABLE `bannerdetails`
  ADD CONSTRAINT `bannerdetails_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `bannerdetails_ibfk_2` FOREIGN KEY (`banner_id`) REFERENCES `banners` (`id`);

--
-- Constraints for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`product_detail_id`) REFERENCES `prodetails` (`id`);

--
-- Constraints for table `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD CONSTRAINT `feedbacks_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `feedbacks_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `media_library`
--
ALTER TABLE `media_library`
  ADD CONSTRAINT `media_library_ibfk_1` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `newsdetails`
--
ALTER TABLE `newsdetails`
  ADD CONSTRAINT `newsdetails_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `newsdetails_ibfk_2` FOREIGN KEY (`news_id`) REFERENCES `news` (`id`);

--
-- Constraints for table `orderdetails`
--
ALTER TABLE `orderdetails`
  ADD CONSTRAINT `orderdetails_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `orderdetails_ibfk_2` FOREIGN KEY (`product_detail_id`) REFERENCES `prodetails` (`id`);

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `prodetails`
--
ALTER TABLE `prodetails`
  ADD CONSTRAINT `prodetails_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `prodetails_ibfk_2` FOREIGN KEY (`size_id`) REFERENCES `sizes` (`id`),
  ADD CONSTRAINT `prodetails_ibfk_3` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`);

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`),
  ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

--
-- Constraints for table `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
