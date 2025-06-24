import { spfi, SPFI, SPFx } from '@pnp/sp/presets/all';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { ISiteUserInfo } from '@pnp/sp/site-users';
import { IUserProfileExtended } from '../types/IUserExtended';


let sp: SPFI | undefined;

const ensureInitialized = (): void => {
  if (!sp) throw new Error("SP API is not initialized! Call init(context).");
};

const SharePointAPIService = {
  init: (context: WebPartContext): SPFI => {
    sp = spfi().using(SPFx(context));
    return sp;
  },

  getSiteUsers: async (): Promise<ISiteUserInfo[]> => {
    ensureInitialized();
    const users = await sp!.web.siteUsers();
    console.log("Site Users:", users);
    return users;
  },

  getUserInfoByLoginName: async (loginName: string): Promise<IUserProfileExtended> => {
    ensureInitialized();
    const userProfile = await sp!.profiles.getPropertiesFor(loginName);
    console.log("User Profile by Login Name:", userProfile);
    return userProfile;
  },
};

export default SharePointAPIService;
