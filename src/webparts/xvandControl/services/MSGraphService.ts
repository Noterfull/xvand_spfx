import { MSGraphClientV3 } from '@microsoft/sp-http';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { User, DirectoryObject } from '@microsoft/microsoft-graph-types';
import { IUserAttributes } from '../types/IUserExtended';

let graphClient: MSGraphClientV3 | undefined;

const MSGraphService = {
  init: async (context: WebPartContext): Promise<void> => {
    graphClient = await context.msGraphClientFactory.getClient('3');
  },
  getUsers: async (filter?: string): Promise<User[]> => {
    if (!graphClient) throw new Error("Graph client is not initialized. Call init(context) first.");
    try {
      let request = graphClient.api('/users');

      if (filter) {
        request = request.filter(filter);
      }

      const response = await request.get();
      return response.value as User[];
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },
  addUser: async (user: User): Promise<User> => {
    if (!graphClient) throw new Error("Graph client is not initialized. Call init(context) first.");
    try {
      const response: User = await graphClient.api('/users').post(user);
      console.log(`User ${user.displayName} added successfully.`);
      return response;
    } catch (error) {
      console.error(`Error adding user ${user.displayName}:`, error);
      throw error;
    }
  },
  getUserById: async (userId: string): Promise<User> => {
    if (!graphClient) throw new Error("Graph client is not initialized. Call init(context) first.");
    try {
      const response: User = await graphClient.api(`/users/${userId}`).get();
      return response;
    } catch (error) {
      console.error(`Error fetching user ${userId}:`, error);
      throw error;
    }
  },

  getUserGroups: async (userId: string): Promise<DirectoryObject[]> => {
    if (!graphClient) throw new Error("Graph client is not initialized. Call init(context) first.");
    try {
      const response: { value: DirectoryObject[] } = await graphClient.api(`/users/${userId}/memberOf`).get();
      return response.value || [];
    } catch (error) {
      console.error(`Error fetching groups for user ${userId}:`, error);
      throw error;
    }
  },

  getUserAttributes: async (userPrincipalName: string | undefined): Promise<IUserAttributes> => {
    if (!graphClient) throw new Error("Graph client is not initialized. Call init(context) first.");
    if (!userPrincipalName) throw new Error("userPrincipalName is undefined");

    try {
      const encodedUPN = encodeURIComponent(userPrincipalName);
      const response: IUserAttributes = await graphClient
        .api(`/users/${encodedUPN}`)
        .header('Accept', 'application/json;odata.metadata=none')
        .select('displayName, givenName, surname, userPrincipalName, userType, createdDateTime, lastPasswordChangeDateTime, proxyAddresses, mail, assignedLicenses')
        .get();
      console.log(`Fetched attributes for user '${userPrincipalName}':`, response);
      return response;
    } catch (error) {
      console.error(`Error fetching user attributes for '${userPrincipalName}':`, error);
      throw error;
    }
  },
  getDomains: async (): Promise<string[]> => {
    if (!graphClient) throw new Error("Graph client is not initialized. Call init(context) first.");
    try {
      const response: { value: { id: string }[] } = await graphClient.api('/domains').get();
      const domains = response.value.map(domain => domain.id);
      console.log('Fetched domains:', domains);
      return domains;
    } catch (error) {
      console.error('Error fetching domains:', error);
      throw error;
    }
  }
};

export default MSGraphService;
