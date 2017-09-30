CREATE TABLE `apps` (
  `Id` varchar(36) NOT NULL,
  `OrgId` varchar(36) DEFAULT NULL,
  `UserId` varchar(36) NOT NULL,
  `Name` varchar(45) NOT NULL,
  `Created` int(11) NOT NULL,
  `Deleted` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `OrgId` (`OrgId`),
  KEY `UserId` (`UserId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
