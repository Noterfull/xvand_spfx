// StatusTab.tsx
import * as React from 'react';
import { Button, List, Tab, TabList, } from '@fluentui/react-components';
import { Spinner, SpinnerSize } from '@fluentui/react';
import { useStatusTab } from './useStatusTab';
import { UserCard } from './UserCard';
import { TabContent } from '../TabContent';
import styles from './StatusTab.module.scss';
import { AttributesData, RdsAppData, SecurityGroupData, MfaData, ProfileInfoData, AdfsData, MsmfaData } from '../../../types/statusTypes';
import MSGraphService from '../../../services/MSGraphService';
import { DialogsManager } from '../../../services/Dialogs';
import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IStatusTabProps {
  absoluteUrl: string | undefined;
  context: WebPartContext;
}

const buttons = [
  { id: 'addUser', label: 'Add User' },
  { id: 'addMultiUser', label: 'Add Multiple Users' },
  { id: 'addRole', label: 'Add Role' },
  { id: 'print', label: 'Print' },
  { id: 'createMailbox', label: 'Create Shared Mailbox' },
  { id: 'exportToExcel', label: 'Export To Excel' },
];

const tabs = [
  { id: 'attributes', value: 'attributes', label: 'Attributes' },
  { id: 'rdsapp', value: 'rdsapp', label: 'RDS Applications' },
  { id: 'securitygroup', value: 'securitygroup', label: 'Security Group' },
  { id: 'mfa', value: 'mfa', label: 'MFA' },
  { id: 'profileinfo', value: 'profileinfo', label: 'Profile Info' },
  { id: 'adfs', value: 'adfs', label: 'ADFS' },
  { id: 'msmfa', value: 'msmfa', label: 'MS MFA' },
];

export const StatusTab: React.FC<IStatusTabProps> = (props) => {
  const { absoluteUrl, context } = props;
  const {
    isUsersLoading,
    isUserInfoLoading,
    users,
    selectedUser,
    userPrincipalName,
    userData,
    getUserInfo,
  } = useStatusTab();
  const [activeTab, setActiveTab] = React.useState<string>('');
  const [tabData, setTabData] = React.useState<{
    attributes?: AttributesData;
    rdsapp?: RdsAppData;
    securitygroup?: SecurityGroupData;
    mfa?: MfaData;
    profileinfo?: ProfileInfoData;
    adfs?: AdfsData;
    msmfa?: MsmfaData;
  }>({});
  const [tabLoading, setTabLoading] = React.useState(false);
  const [openDialogId, setOpenDialogId] = React.useState<string>('');
  const [dialogParams, setDialogParams] = React.useState<Partial<Record<string, unknown>>>({});

  React.useEffect((): void => {
    setActiveTab('');
    setTabData({});
  }, [userPrincipalName, selectedUser]);

  // Обработчик открытия диалога с передачей параметров
  const openDialog = (id: string, params?: Partial<Record<string, unknown>>): void => {
    setOpenDialogId(id);
    setDialogParams(params ?? {});
  };


  const loadTabData = async (tab: string, userPrincipalName: string | undefined): Promise<void> => {
    if (!userPrincipalName) {
      setTabData({});
      return;
    }

    setTabLoading(true);
    const currentUser = userPrincipalName;

    try {
      switch (tab) {
        case 'attributes': {
          const attributes = await MSGraphService.getUserAttributes(userPrincipalName);
          if (currentUser === userPrincipalName) {
            setTabData(prev => ({ ...prev, attributes }));
          }
          break;
        }
        default:
          break;
      }
    } catch (error) {
      console.error('Error loading tab data', error);
      setTabData({});
    } finally {
      setTabLoading(false);
    }
  };

  const handleTabChange = async (_: React.SyntheticEvent, data: { value: string }): Promise<void> => {
    if (data.value === activeTab) return;
    setActiveTab(data.value);
    if (userPrincipalName) {
      await loadTabData(data.value, userPrincipalName);
    }
  };

  return (
    <>
      {isUsersLoading ? (
        <div className={styles.spinnerContainer}>
          <Spinner size={SpinnerSize.large} label="Loading..." />
        </div>
      ) : (
        <div className={styles.div1}>
          <div className={styles.buttonContainer}>
            {buttons.map((button) => (
              <Button
                key={button.id}
                size="small"
                onClick={() => openDialog(button.id, { userPrincipalName, selectedUser })}
                className={styles.buttonAction}
              >
                {button.label}
              </Button>
            ))}
          </div>

          <div className={styles.div2}>
            <section className={styles.firstBlock}>
              <div className={styles.userListHeader}>
                <span>Is Utility Users</span>
                {/* <button
                    type="button"
                    disabled={isUsersLoading}
                    onClick={async () => { await getAllUsers(); }}>Refresh
                </button> */}
              </div>
              <div className={styles.listContainer}>
                <List className={styles.list}>
                  {users.map((user) => (
                    <UserCard
                      key={user.Id}
                      user={user}
                      selected={selectedUser === user.Id}
                      onClick={async () => { await getUserInfo(user.LoginName, user.Id); }}
                      absoluteUrl={absoluteUrl}
                    />
                  ))}
                </List>
              </div>
            </section>

            <section className={styles.secondBlock}>
              {isUserInfoLoading ? (
                <div className={styles.spinnerContainer}>
                  <Spinner size={SpinnerSize.large} label="Loading..." />
                </div>
              ) : userData ? (
                <div>
                  <div className={styles.selecteUser}>
                    <span> User:&nbsp;
                      {userPrincipalName ?? ''}
                      {userPrincipalName && userData.DisplayName ? ' - ' : ''}
                      {userData.DisplayName ?? ''}
                    </span>
                  </div>
                  <div className={styles.tabContainer}>
                    <TabList
                      className={styles.tabList}
                      selectedValue={activeTab}
                      onTabSelect={handleTabChange}
                      size="small"
                      reserveSelectedTabSpace={false}
                      appearance="subtle-circular"
                    >
                      {tabs.map((tab) => (
                        <Tab
                          className={styles.tabItem}
                          key={tab.id}
                          id={tab.id}
                          value={tab.value}
                        >
                          {tab.label}
                        </Tab>
                      ))}
                    </TabList>
                  </div>
                  <TabContent activeTab={activeTab} isLoading={tabLoading} data={tabData[activeTab as keyof typeof tabData]} />
                </div>
              ) : <div>Data not found</div>}
            </section>
          </div>
          <DialogsManager
            openDialogId={openDialogId}
            dialogProps={dialogParams}
            context={context}
            onClose={() => setOpenDialogId('')}
          />
        </div>
      )}
    </>
  );
};

export default StatusTab;
