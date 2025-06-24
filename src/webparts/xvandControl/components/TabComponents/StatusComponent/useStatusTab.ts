import { useEffect, useState } from 'react';
// import SharePointAPIService from '../../../services/SharePointAPIService';
import MSGraphService from '../../../services/MSGraphService';
// import { ISiteUserInfo } from '@pnp/sp/site-users';
// import { IUserProfileExtended } from '../../../types/IUserExtended';
import { User } from '@microsoft/microsoft-graph-types';



export const useStatusTab = (): {
    isUsersLoading: boolean;
    isUserInfoLoading: boolean;
    users: User[];
    selectedUser: string | undefined;
    userPrincipalName: string | undefined;
    userData: User | undefined;
    getAllUsers: () => Promise<void>;
    getUserInfo: (loginName: string | undefined, userId: string | undefined) => Promise<void>;
} => {
    const [isUsersLoading, setIsUsersLoading] = useState<boolean>(false);
    const [isUserInfoLoading, setIsUserInfoLoading] = useState<boolean>(false);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<string | undefined>(undefined);
    const [userPrincipalName, setUserPrincipalName] = useState<string | undefined>(undefined);
    const [userData, setUserData] = useState<User | undefined>(undefined);

    // const getAllUsers = async (): Promise<void> => {
    //     setIsUsersLoading(true);
    //     try {
    //         const allUsers = await SharePointAPIService.getSiteUsers();
    //         console.log('All users fetched:', allUsers);
    //         setUsers(allUsers.filter(user => user.UserId !== undefined && !user.IsHiddenInUI));
    //     } catch (error) {
    //         console.error('User login error:', error);
    //     } finally {
    //         setIsUsersLoading(false);
    //     }
    // };

    const getAllUsers = async (): Promise<void> => {
        setIsUsersLoading(true);
        try {
            const allUsers = await MSGraphService.getUsers();
            console.log('All users fetched:', allUsers);
            setUsers(allUsers);
        } catch (error) {
            console.error('User login error:', error);
        } finally {
            setIsUsersLoading(false);
        }
    };

    // const getUserInfo = async (loginName: string, userId: number): Promise<void> => {
    //     setIsUserInfoLoading(true);
    //     try {
    //         setSelectedUser(userId);
    //         console.log('Fetching user info for:', loginName);
    //         const details = await SharePointAPIService.getUserInfoByLoginName(loginName);
    //         console.log('User Profile Properties:', details.UserProfileProperties);
    //         const userName = details.UserProfileProperties?.find(p => p.Key === "UserName")?.Value;
    //         console.log('User Name:', userName);
    //         setUserPrincipalName(userName);
    //         console.log('User details:', details);
    //         setUserData(
    //             typeof details === 'object' &&
    //                 details !== null &&
    //                 Object.keys(details).some(key => key !== 'odata')
    //                 ? details
    //                 : undefined
    //         );
    //     } catch (error) {
    //         console.error('User data loading error:', error);
    //         setUserData(undefined);
    //     } finally {
    //         setIsUserInfoLoading(false);
    //     }
    // };

   const getUserInfo = async (loginName: string, userId: string): Promise<void> => {
        setIsUserInfoLoading(true);
        try {
            setSelectedUser(userId);
            console.log('Fetching user info for:', loginName);
            const details = await MSGraphService.getUserById(userId);
            console.log('User Profile Properties:', details);
            const userName = details.userPrincipalName || '';
            console.log('User Name:', userName);
            setUserPrincipalName(userName);
            console.log('User details:', details);
            setUserData(
                typeof details === 'object' &&
                    details !== null &&
                    Object.keys(details).some(key => key !== 'odata')
                    ? details
                    : undefined
            );
        } catch (error) {
            console.error('User data loading error:', error);
            setUserData(undefined);
        } finally {
            setIsUserInfoLoading(false);
        }
    };

    useEffect(() => {
        (async () => {
            try {
                await getAllUsers();
            } catch (error) {
                console.error('Error fetching users in useEffect:', error);
            }
        })().catch(error => {
            console.error('Unhandled promise rejection from useEffect', error);
        });
    }, []);

    return {
        isUsersLoading,
        isUserInfoLoading,
        users,
        selectedUser,
        userPrincipalName,
        userData,
        getAllUsers,
        getUserInfo
    };
};