import * as React from 'react';
import { Button } from '@fluentui/react-components';
import styles from './StatusTab.module.scss';
import { useDialog } from '../../../services/DialogContext';
import { DialogPropsMap } from '../../../services/Dialogs';

const buttonList = [
  { id: 'deleteUser', label: "Delete User", text: 'Delete User' },
  { id: 'changePassword', label: "Change Password", text: 'Change Password. The newly generated password will be included into email.' },
  { id: 'addCalendar', label: "Add Calendar Permission", text: 'Add Folder Permission to Calendar' },
  { id: 'removeCalendar', label: "Remove Calendar Permission", text: 'Remove Folder Permission to Calendar' },
  { id: 'addContacts', label: "Add Contacts Permission", text: 'Add Folder Permission to Contacts'},
  { id: 'removeContacts', label: "Remove Contacts Permission", text: 'Remove Folder Permission to Contacts' },
  { id: 'reprocessLicense', label: "Reprocess O365 License", text: 'Reprocess Office 365 Group Based License Assignment' },
];

interface BottomComponentsProps {
  userPrincipalName: string | undefined;
  selectedUser: string | undefined;
}

export const BottomComponents: React.FC<BottomComponentsProps> = ({ userPrincipalName, selectedUser }) => {
  const { openDialog } = useDialog();

  return (
    <div className={styles.bottomPanel}>
      {buttonList.map((btn) => (
        <div key={btn.id} className={styles.buttonRow}>
          <div className={styles.buttonActionContainer}>
            <Button
              id={btn.id}
              appearance="primary"
              className={styles.buttonAction}
              onClick={() => openDialog(btn.id as keyof DialogPropsMap, { userPrincipalName, selectedUser })}
            >
              {btn.label}
            </Button>
          </div>
          <div className={styles.buttonDescription}>
            {btn.text}
          </div>
        </div>
      ))}
    </div>
  );
};
