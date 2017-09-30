CREATE TABLE `apis` (
  `Id` varchar(36) NOT NULL,
  `AppId` varchar(36) NOT NULL,
  `EnvId` varchar(36) NOT NULL,
  `Name` varchar(45) NOT NULL,
  `Created` int(11) NOT NULL,
  `Deleted` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `AppId` (`AppId`),
  KEY `EnvId` (`EnvId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
