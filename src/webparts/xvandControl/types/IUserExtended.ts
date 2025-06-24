import { IUserProfile } from "@pnp/sp/profiles";

export interface IUserProfileExtended extends IUserProfile {
  UserProfileProperties: {
    Key: string;
    Value: string;
  }[];
}

export interface IUserAttributes {
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