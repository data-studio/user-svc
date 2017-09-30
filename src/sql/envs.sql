CREATE TABLE `envs` (
  `Id` varchar(36) NOT NULL,
  `AppId` varchar(36) NOT NULL,
  `Name` varchar(45) NOT NULL,
  `IsProduction` int(1) DEFAULT 0,
  `Created` int(11) NOT NULL,
  `Deleted` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `AppId` (`AppId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
