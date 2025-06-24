export interface AttributesData {
  displayName?: string;
  givenName?: string;
  surname?: string;
  userPrincipalName?: string;
  userType?: string;
  createdDateTime?: Date;
  lastPasswordChangeDateTime?: Date;
  proxyAddresses?: string[];
  mail?: string;
  assignedLicenses?: Array<{
    skuId?: string;
  }>;
}

export interface RdsAppData {
  appId: string;
  name: string;
  description?: string;
}

export interface SecurityGroupData {
  groupId: string;
  groupName: string;
  membersCount?: number;
}


export interface MfaData {
  isMfaEnabled: boolean;
  methods?: string[];
}

export interface ProfileInfoData {
  phoneNumber?: string;
  officeLocation?: string;
  preferredLanguage?: string;
}


export interface AdfsData {
  adfsEnabled: boolean;
  adfsUrl?: string;
}

export interface MsmfaData {
  msmfaStatus: string;
  lastVerified?: string;
}


export interface TabData {
  attributes?: AttributesData;
  rdsapp?: RdsAppData;
  securitygroup?: SecurityGroupData;
  mfa?: MfaData;
  profileinfo?: ProfileInfoData;
  adfs?: AdfsData;
  msmfa?: MsmfaData;
}
