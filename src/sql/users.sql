CREATE TABLE `users` (
  `Id` varchar(36) NOT NULL,
  `EnvId` varchar(36) DEFAULT NULL,
  `Login` varchar(45) DEFAULT NULL,
  `Created` int(11) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `EnvId` (`EnvId`),
  KEY `Login` (`EnvId`, `Login`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
