-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Sep 19, 2021 at 07:43 PM
-- Server version: 8.0.17
-- PHP Version: 7.3.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `slawpharmacy`
--

-- --------------------------------------------------------

--
-- Table structure for table `bills`
--

CREATE TABLE `bills` (
  `bill_ID` int(11) NOT NULL,
  `cashier` int(11) NOT NULL,
  `pharmacyID` int(11) NOT NULL,
  `totalCost` int(11) NOT NULL,
  `totalPrice` int(11) NOT NULL,
  `date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `bills`
--

INSERT INTO `bills` (`bill_ID`, `cashier`, `pharmacyID`, `totalCost`, `totalPrice`, `date`) VALUES
(1, 2, 1, 800, 1000, '2021-02-27 11:44:44'),
(2, 2, 1, 800, 1000, '2021-02-27 13:05:27');

-- --------------------------------------------------------

--
-- Table structure for table `companies`
--

CREATE TABLE `companies` (
  `companyID` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `address` varchar(30) NOT NULL,
  `phoneNum` int(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `companies`
--

INSERT INTO `companies` (`companyID`, `name`, `address`, `phoneNum`) VALUES
(1, 'Pioneer', 'Sheikh Salam 33، Sulaymaniyah', 53);

-- --------------------------------------------------------

--
-- Table structure for table `drugs`
--

CREATE TABLE `drugs` (
  `drugID` int(11) NOT NULL,
  `barcode` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `scintificName` varchar(300) NOT NULL,
  `indication` varchar(300) NOT NULL,
  `sideEffect` varchar(300) NOT NULL,
  `content` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `drugs`
--

INSERT INTO `drugs` (`drugID`, `barcode`, `name`, `scintificName`, `indication`, `sideEffect`, `content`) VALUES
(1, 123456, 'Amoxicillin', 'Amoxicillin', 'ear, nose, and throat infections', 'nausea, vomiting, diarrhea', 'Magnesium Stearate, Titanium Dioxide ');

-- --------------------------------------------------------

--
-- Table structure for table `imports`
--

CREATE TABLE `imports` (
  `importID` int(11) NOT NULL,
  `pharmacyID` int(11) NOT NULL,
  `importNum` int(11) NOT NULL,
  `addBy` int(11) NOT NULL,
  `from` int(11) NOT NULL,
  `cost` int(11) NOT NULL,
  `paid` tinyint(1) NOT NULL,
  `date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `imports`
--

INSERT INTO `imports` (`importID`, `pharmacyID`, `importNum`, `addBy`, `from`, `cost`, `paid`, `date`) VALUES
(1, 1, 144, 2, 1, 100000, 1, '2021-02-27 11:33:31');

-- --------------------------------------------------------

--
-- Table structure for table `pharmacies`
--

CREATE TABLE `pharmacies` (
  `pharmacyID` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `manager` int(11) NOT NULL,
  `subscription` varchar(50) NOT NULL,
  `license` varchar(50) NOT NULL,
  `disable` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `pharmacies`
--

INSERT INTO `pharmacies` (`pharmacyID`, `name`, `manager`, `subscription`, `license`, `disable`) VALUES
(1, 'Kurdistan Pharmacy', 1, 'yearly', '123-123-123', 0);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `productID` int(11) NOT NULL,
  `drugID` int(11) NOT NULL,
  `pharmacyID` int(11) NOT NULL,
  `importNum` int(11) NOT NULL,
  `barcode` int(48) NOT NULL,
  `cost` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `expire` date NOT NULL,
  `type` varchar(30) NOT NULL,
  `packet` int(11) NOT NULL,
  `sheet` int(11) NOT NULL,
  `pill` int(11) NOT NULL,
  `remainPacket` int(11) NOT NULL,
  `remainSheet` int(11) NOT NULL,
  `remainPill` int(11) NOT NULL,
  `sheetPerPacket` int(11) NOT NULL,
  `pillPerSheet` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`productID`, `drugID`, `pharmacyID`, `importNum`, `barcode`, `cost`, `price`, `expire`, `type`, `packet`, `sheet`, `pill`, `remainPacket`, `remainSheet`, `remainPill`, `sheetPerPacket`, `pillPerSheet`) VALUES
(1, 1, 1, 144, 123456, 800, 1000, '2022-06-30', 'Pill', 10, 20, 100, 8, 16, 80, 2, 5);

-- --------------------------------------------------------

--
-- Table structure for table `sold`
--

CREATE TABLE `sold` (
  `soldID` int(11) NOT NULL,
  `soldBy` int(11) NOT NULL,
  `bill_ID` int(11) NOT NULL,
  `productID` int(11) NOT NULL,
  `kind` varchar(30) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `sold`
--

INSERT INTO `sold` (`soldID`, `soldBy`, `bill_ID`, `productID`, `kind`, `quantity`, `price`, `date`) VALUES
(1, 2, 1, 1, 'Packet', 1, 1000, '2021-02-27'),
(2, 2, 2, 1, 'Packet', 1, 1000, '2021-02-27');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userID` int(11) NOT NULL,
  `employee` int(11) NOT NULL,
  `username` varchar(30) NOT NULL,
  `password` varchar(50) NOT NULL,
  `role` varchar(50) NOT NULL,
  `disable` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userID`, `employee`, `username`, `password`, `role`, `disable`) VALUES
(1, 1, 'manager', '12345', 'Manager', 0),
(2, 1, 'cashier', '12345', 'Cashier', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bills`
--
ALTER TABLE `bills`
  ADD PRIMARY KEY (`bill_ID`),
  ADD KEY `bills_ibfk_1` (`pharmacyID`),
  ADD KEY `cashier` (`cashier`);

--
-- Indexes for table `companies`
--
ALTER TABLE `companies`
  ADD PRIMARY KEY (`companyID`);

--
-- Indexes for table `drugs`
--
ALTER TABLE `drugs`
  ADD PRIMARY KEY (`drugID`);

--
-- Indexes for table `imports`
--
ALTER TABLE `imports`
  ADD PRIMARY KEY (`importID`),
  ADD UNIQUE KEY `importNum` (`importNum`),
  ADD KEY `from` (`from`),
  ADD KEY `addBy` (`addBy`);

--
-- Indexes for table `pharmacies`
--
ALTER TABLE `pharmacies`
  ADD PRIMARY KEY (`pharmacyID`),
  ADD KEY `manager` (`manager`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`productID`),
  ADD KEY `drugID` (`drugID`),
  ADD KEY `products_ibfk_2` (`importNum`);

--
-- Indexes for table `sold`
--
ALTER TABLE `sold`
  ADD PRIMARY KEY (`soldID`),
  ADD KEY `soldBy` (`soldBy`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userID`),
  ADD KEY `employee` (`employee`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bills`
--
ALTER TABLE `bills`
  MODIFY `bill_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `companies`
--
ALTER TABLE `companies`
  MODIFY `companyID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `drugs`
--
ALTER TABLE `drugs`
  MODIFY `drugID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `imports`
--
ALTER TABLE `imports`
  MODIFY `importID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `pharmacies`
--
ALTER TABLE `pharmacies`
  MODIFY `pharmacyID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `productID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `sold`
--
ALTER TABLE `sold`
  MODIFY `soldID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bills`
--
ALTER TABLE `bills`
  ADD CONSTRAINT `bills_ibfk_1` FOREIGN KEY (`pharmacyID`) REFERENCES `pharmacies` (`pharmacyID`),
  ADD CONSTRAINT `bills_ibfk_2` FOREIGN KEY (`cashier`) REFERENCES `users` (`userID`);

--
-- Constraints for table `imports`
--
ALTER TABLE `imports`
  ADD CONSTRAINT `imports_ibfk_1` FOREIGN KEY (`from`) REFERENCES `companies` (`companyID`),
  ADD CONSTRAINT `imports_ibfk_2` FOREIGN KEY (`addBy`) REFERENCES `users` (`userID`);

--
-- Constraints for table `pharmacies`
--
ALTER TABLE `pharmacies`
  ADD CONSTRAINT `pharmacies_ibfk_1` FOREIGN KEY (`manager`) REFERENCES `users` (`userID`);

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`drugID`) REFERENCES `drugs` (`drugID`),
  ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`importNum`) REFERENCES `imports` (`importNum`);

--
-- Constraints for table `sold`
--
ALTER TABLE `sold`
  ADD CONSTRAINT `sold_ibfk_1` FOREIGN KEY (`soldBy`) REFERENCES `users` (`userID`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`employee`) REFERENCES `pharmacies` (`pharmacyID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
