-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 22, 2025 at 02:33 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.1.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sims`
--

-- --------------------------------------------------------

--
-- Table structure for table `spare_part`
--

CREATE TABLE `spare_part` (
  `SparePartID` int(11) NOT NULL,
  `Name` varchar(100) DEFAULT NULL,
  `Category` varchar(100) DEFAULT NULL,
  `Quantity` int(11) DEFAULT NULL,
  `UnitPrice` int(11) DEFAULT NULL,
  `TotalPrice` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `spare_part`
--

INSERT INTO `spare_part` (`SparePartID`, `Name`, `Category`, `Quantity`, `UnitPrice`, `TotalPrice`) VALUES
(1, 'SamSung 14', '10', 3000, 1200000, 1440000000),
(2, 'Tecno', '10', 2960, 10000, 30000000),
(3, 'vodacom', '1', 0, 1, 1),
(4, 'PIXEL', '1', 80, 1000000, 100000000),
(5, 'GOOGLE', '1', 20, 1000, 20000),
(6, 'MTN', '1', 120, 10000, 1000000);

-- --------------------------------------------------------

--
-- Table structure for table `stock_in`
--

CREATE TABLE `stock_in` (
  `StockInID` int(11) NOT NULL,
  `SparePartID` int(11) DEFAULT NULL,
  `StockInQuantity` int(11) DEFAULT NULL,
  `StockInDate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stock_in`
--

INSERT INTO `stock_in` (`StockInID`, `SparePartID`, `StockInQuantity`, `StockInDate`) VALUES
(1, 1, 12, '2025-05-22'),
(2, 1, 500, '2025-05-22'),
(3, 1, 2000, '2025-05-22'),
(4, 5, 20, '2025-05-22'),
(5, 6, 120, '2025-05-22');

-- --------------------------------------------------------

--
-- Table structure for table `stock_out`
--

CREATE TABLE `stock_out` (
  `StockOutID` int(11) NOT NULL,
  `SparePartID` int(11) DEFAULT NULL,
  `StockOutQuantity` int(11) DEFAULT NULL,
  `StockOutUnitPrice` decimal(10,2) DEFAULT NULL,
  `StockOutTotalPrice` decimal(10,2) DEFAULT NULL,
  `StockOutDate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stock_out`
--

INSERT INTO `stock_out` (`StockOutID`, `SparePartID`, `StockOutQuantity`, `StockOutUnitPrice`, `StockOutTotalPrice`, `StockOutDate`) VALUES
(3, 2, 20, 100.00, 2000.00, '2025-05-22'),
(7, 1, 30000000, 99999999.99, 99999999.99, '2025-05-22'),
(8, 5, 200, 500000.00, 99999999.99, '2025-05-21'),
(9, 6, 100, 120000.00, 12000000.00, '2025-05-21');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `UserID` int(11) NOT NULL,
  `Username` varchar(100) NOT NULL,
  `Password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`UserID`, `Username`, `Password`) VALUES
(1, 'king', '1234'),
(2, 'kamara', '123'),
(3, 'niga', '123'),
(4, 'kamm', 'just'),
(5, 'migambi', '123');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `spare_part`
--
ALTER TABLE `spare_part`
  ADD PRIMARY KEY (`SparePartID`);

--
-- Indexes for table `stock_in`
--
ALTER TABLE `stock_in`
  ADD PRIMARY KEY (`StockInID`),
  ADD KEY `stock_in_ibfk_1` (`SparePartID`);

--
-- Indexes for table `stock_out`
--
ALTER TABLE `stock_out`
  ADD PRIMARY KEY (`StockOutID`),
  ADD KEY `stock_out_ibfk_1` (`SparePartID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`UserID`),
  ADD UNIQUE KEY `Username` (`Username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `spare_part`
--
ALTER TABLE `spare_part`
  MODIFY `SparePartID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `stock_in`
--
ALTER TABLE `stock_in`
  MODIFY `StockInID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `stock_out`
--
ALTER TABLE `stock_out`
  MODIFY `StockOutID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `UserID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `stock_in`
--
ALTER TABLE `stock_in`
  ADD CONSTRAINT `stock_in_ibfk_1` FOREIGN KEY (`SparePartID`) REFERENCES `spare_part` (`SparePartID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `stock_out`
--
ALTER TABLE `stock_out`
  ADD CONSTRAINT `stock_out_ibfk_1` FOREIGN KEY (`SparePartID`) REFERENCES `spare_part` (`SparePartID`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
