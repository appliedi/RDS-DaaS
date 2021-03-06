
CREATE procedure [dbo].[SessionDateTimeCount]
@CollectionName nvarchar(max),
@FromSessionDateTime datetime,
@ToSessionDateTime datetime

as
begin
select count(M.SessionDateTime)as Count,M.SessionDateTime from
(
select HostServer,SessionDateTime from TBL_TrackingSessions where CollectionName=@CollectionName and SessionDateTime between @FromSessionDateTime and @ToSessionDateTime
  GROUP BY HostServer,SessionDateTime
)
as M  GROUP BY M.SessionDateTime ORDER BY M.SessionDateTime


select count(M.SessionDateTime)as Count,M.SessionDateTime from
(
select UserName,SessionDateTime from TBL_TrackingSessions where SessionState in('ACTIVE','CONNECTED','DISCONNECTED')
and CollectionName=@CollectionName and SessionDateTime between @FromSessionDateTime and @ToSessionDateTime
  GROUP BY UserName,SessionDateTime
)
as M  GROUP BY M.SessionDateTime ORDER BY M.SessionDateTime

end


GO
/****** Object:  StoredProcedure [dbo].[SessionOnlyDateTimeCount]    Script Date: 2/20/2017 11:52:39 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE procedure [dbo].[SessionOnlyDateTimeCount]
@Vm nvarchar(max),
@FromSessionDateTime datetime,
@ToSessionDateTime datetime

as
begin

select count(M.SessionDateTime)as Count,M.SessionDateTime from
(
select UserName,SessionDateTime from TBL_TrackingSessions where SessionState in('ACTIVE','CONNECTED','DISCONNECTED')
and HostServer=@Vm and SessionDateTime between @FromSessionDateTime and @ToSessionDateTime
  GROUP BY UserName,SessionDateTime
)
as M  GROUP BY M.SessionDateTime ORDER BY M.SessionDateTime

end


GO
/****** Object:  StoredProcedure [dbo].[SP_DeleteDeployment]    Script Date: 2/20/2017 11:52:39 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SP_DeleteDeployment]
(
@FQDN varchar(max)
)
AS
BEGIN
	BEGIN TRY
		UPDATE TBL_Deployments SET IsDeleted=1 WHERE FQDN=@FQDN
		SELECT 'SUCCESS' AS Result
	END TRY
	BEGIN CATCH
		SELECT 'FAILED' AS Result
	END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[SP_GETActiveSessions]    Script Date: 2/20/2017 11:52:39 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SP_GETActiveSessions]
(
@SHS varchar(max),
@StartTime varchar(max),
@EndTime varchar(max)
)
AS
BEGIN
select SessionDateTime as Time,count(SessionDateTime) As Count from TBL_TrackingSessions  
WHERE HostServer=@SHS AND SessionState='Active' and SessionDateTime>=@StartTime and SessionDateTime<=@EndTime GROUP BY SessionDateTime 
END
GO
/****** Object:  StoredProcedure [dbo].[SP_GetAllDeployments]    Script Date: 2/20/2017 11:52:39 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SP_GetAllDeployments]
AS
BEGIN
	SELECT ID,FQDN,FriendlyName,Description FROM TBL_Deployments WHERE IsDeleted=0 ORDER BY FQDN ASC
END
GO
/****** Object:  StoredProcedure [dbo].[SP_GetAzureCredentials]    Script Date: 2/20/2017 11:52:39 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SP_GetAzureCredentials]
(
@FQDN varchar(max)
)
AS
BEGIN
	SELECT IsActive,PublishUserName,PublishPassword,AzureSubscriptionName,ResourceGroupName,CreatedDate,LastModifiedDate FROM TBL_DeploymentBurstSettings WHERE DeploymentFQDN=@FQDN
END
GO
/****** Object:  StoredProcedure [dbo].[SP_GETCollectionMonitor]    Script Date: 2/20/2017 11:52:39 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SP_GETCollectionMonitor]
(
@ColName varchar(max),
@StartTime varchar(max),
@EndTime varchar(max)
)
AS
BEGIN
select SessionDateTime as Time,count(SessionDateTime) As Count from TBL_TrackingSessions  
WHERE CollectionName=@ColName AND SessionState='Active' and SessionDateTime>=@StartTime and SessionDateTime<=@EndTime GROUP BY SessionDateTime 
END
GO
/****** Object:  StoredProcedure [dbo].[SP_GETSessionsOfServer]    Script Date: 2/20/2017 11:52:39 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SP_GETSessionsOfServer]
(
@HostServer varchar(max),
@StartDate datetime,
@EndDate datetime
)
AS
BEGIN
select SessionDate,count(SessionDate) as Count from TBL_TrackingSessions 
where HostServer=@HostServer
AND SessionState='Active' AND SessionDate>=@StartDate AND SessionDate<=@EndDate GROUP BY SessionDate
END
GO
/****** Object:  StoredProcedure [dbo].[SP_NewDeployment]    Script Date: 2/20/2017 11:52:39 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SP_NewDeployment]
(
@FQDN varchar(max),
@FriendlyName varchar(max),
@Description varchar(max),
@AzureLoginName varchar(max),
@AzurePassword varchar(max),
@AzureSubscriptionID varchar(max),
@AzureResourceGroup varchar(max),
@CreatedDate varchar(max),
@LastModifiedDate varchar(max)
)
AS
BEGIN
	BEGIN TRANSACTION MyTransaction
	BEGIN TRY
		INSERT INTO TBL_Deployments(FQDN,FriendlyName,Description,IsDeleted) VALUES(@FQDN,@FriendlyName,@Description,0)

		INSERT INTO TBL_DeploymentBurstSettings(DeploymentFQDN,IsActive,PublishUserName,PublishPassword,AzureSubscriptionName,ResourceGroupName,CreatedDate,LastModifiedDate) 
			VALUES(@FQDN,1,@AzureLoginName,@AzurePassword,@AzureSubscriptionID,@AzureResourceGroup,@CreatedDate,@LastModifiedDate)
		COMMIT TRANSACTION MyTransaction
		SELECT 'SUCCESS' AS Result
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION MyTransaction
		SELECT 'FAILED' AS Result
	END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[SP_RenameDeployment]    Script Date: 2/20/2017 11:52:39 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SP_RenameDeployment]
(
@FQDN varchar(max),
@FriendlyName varchar(max),
@Description varchar(max)
)
AS
BEGIN
	BEGIN TRY
		UPDATE TBL_Deployments SET FriendlyName=@FriendlyName,Description=@Description WHERE FQDN=@FQDN
		SELECT 'SUCCESS' AS Result
	END TRY
	BEGIN CATCH
		SELECT 'FAILED' AS Result
	END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[SP_UpdateAzureCredentials]    Script Date: 2/20/2017 11:52:39 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create PROCEDURE [dbo].[SP_UpdateAzureCredentials]
(
@FQDN varchar(max),
@IsActive bit,
@AzureLoginName varchar(max),
@AzurePassword varchar(max),
@AzureSubscriptionID varchar(max),
@AzureResourceGroup varchar(max),
@LastModifiedDate varchar(max)
)
AS
BEGIN
	BEGIN TRANSACTION MyTransaction
	BEGIN TRY
		
		UPDATE TBL_DeploymentBurstSettings SET IsActive=@IsActive,PublishUserName=@AzureLoginName,PublishPassword=@AzurePassword,
		AzureSubscriptionName=@AzureSubscriptionID,ResourceGroupName=@AzureResourceGroup,LastModifiedDate=@LastModifiedDate 
		WHERE DeploymentFQDN=@FQDN
			
		COMMIT TRANSACTION MyTransaction
		SELECT 'SUCCESS' AS Result
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION MyTransaction
		SELECT 'FAILED' AS Result
	END CATCH
END
GO
/****** Object:  Table [dbo].[AuditLogs]    Script Date: 2/20/2017 11:52:39 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[AuditLogs](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[AuditDate] [datetime] NOT NULL,
	[MethodName] [varchar](255) NULL,
	[DeploymentName] [varchar](max) NULL,
	[AuditType] [varchar](255) NOT NULL,
	[AuditMessage] [varchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[CollectionBurstSettings]    Script Date: 2/20/2017 11:52:40 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CollectionBurstSettings](
	[DeploymentFQDN] [nvarchar](128) NOT NULL,
	[CollectionName] [nvarchar](128) NOT NULL,
	[IsActive] [bit] NOT NULL,
	[StartTime] [time](0) NOT NULL,
	[EndTime] [time](0) NOT NULL,
	[LogOffWaitTime] [tinyint] NOT NULL,
	[SessionThresholdPerCPU] [tinyint] NOT NULL,
	[MinServerCount] [smallint] NOT NULL,
 CONSTRAINT [PK_CollectionBurstSettings] PRIMARY KEY CLUSTERED 
(
	[DeploymentFQDN] ASC,
	[CollectionName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)

GO
/****** Object:  Table [dbo].[DeploymentBurstSettings]    Script Date: 2/20/2017 11:52:40 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[DeploymentBurstSettings](
	[DeploymentFQDN] [nvarchar](128) NOT NULL,
	[IsActive] [bit] NOT NULL,
	[PublishUserName] [nvarchar](128) NOT NULL,
	[PublishPassword] [varchar](524) NOT NULL,
	[AzureSubscriptionName] [nvarchar](128) NOT NULL,
	[ResourceGroupName] [nvarchar](64) NOT NULL,
	[CreatedDate] [date] NOT NULL,
	[LastModifiedDate] [date] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[DeploymentFQDN] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[Deployments]    Script Date: 2/20/2017 11:52:41 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Deployments](
	[Id] [varchar](64) NOT NULL,
	[Name] [nvarchar](128) NOT NULL,
	[FQDN] [nvarchar](128) NOT NULL,
	[Description] [nvarchar](128) NULL,
	[collectionadmin] [varchar](25) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON),
 CONSTRAINT [UQ_Deployments] UNIQUE NONCLUSTERED 
(
	[FQDN] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[ErrorLogs]    Script Date: 2/20/2017 11:52:41 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[ErrorLogs](
	[Datetime] [datetime] NULL,
	[Methodname] [varchar](255) NULL,
	[ErrorMessage] [varchar](max) NULL,
	[DeploymentName] [varchar](max) NULL
)

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[TBL_ServersMonitoring]    Script Date: 2/20/2017 11:52:41 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING OFF
GO
CREATE TABLE [dbo].[TBL_ServersMonitoring](
	[DeploymentFQDN] [varchar](50) NULL,
	[ServerName] [varchar](50) NULL,
	[CPUUsagePercentage] [float] NULL,
	[DiskReadBytes] [float] NULL,
	[DiskWriteBytes] [float] NULL,
	[NetworkINBytes] [float] NULL,
	[NetworkOutBytes] [float] NULL,
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[InstanceDateTime] [datetime] NULL
)

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[TBL_TrackingSessions]    Script Date: 2/20/2017 11:52:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[TBL_TrackingSessions](
	[SNO] [int] IDENTITY(1,1) NOT NULL,
	[CollectionName] [varchar](50) NULL,
	[HostServer] [varchar](50) NULL,
	[UserName] [varchar](50) NULL,
	[SessionState] [varchar](25) NULL,
	[SessionDateTime] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[SNO] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)

GO
SET ANSI_PADDING OFF
GO
ALTER TABLE [dbo].[CollectionBurstSettings]  WITH CHECK ADD  CONSTRAINT [FK_CollectionBurstSettings] FOREIGN KEY([DeploymentFQDN])
REFERENCES [dbo].[Deployments] ([FQDN])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[CollectionBurstSettings] CHECK CONSTRAINT [FK_CollectionBurstSettings]
GO
ALTER TABLE [dbo].[DeploymentBurstSettings]  WITH CHECK ADD  CONSTRAINT [FK_RDDeployments_DeploymentBurstSettings] FOREIGN KEY([DeploymentFQDN])
REFERENCES [dbo].[Deployments] ([FQDN])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[DeploymentBurstSettings] CHECK CONSTRAINT [FK_RDDeployments_DeploymentBurstSettings]
GO
