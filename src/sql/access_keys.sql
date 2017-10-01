CREATE TABLE `access_keys` (
  `Id` varchar(36) NOT NULL,
  `SecureId` varchar(36) NOT NULL,
  `KeyType` enum('PUBLIC','PRIVATE') NOT NULL DEFAULT 'PRIVATE',
  `Key` varchar(255) NOT NULL,
  `Created` int(11) NOT NULL,
  `Deleted` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `SecureId` (`SecureId`),
  KEY `Key` (`Key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
