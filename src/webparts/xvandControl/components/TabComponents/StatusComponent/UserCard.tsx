import * as React from 'react';
import { ListItem, Persona } from '@fluentui/react-components';
// import { ISiteUserInfo } from '@pnp/sp/site-users';
import styles from './StatusTab.module.scss';
import { User } from '@microsoft/microsoft-graph-types';

interface UserCardProps {
  user: User;
  selected: boolean;
  onClick: () => void;
  absoluteUrl?: string;
}

export const UserCard: React.FC<UserCardProps> = ({ user, selected, onClick, absoluteUrl }) => (
  <ListItem
    key={user.id}
    className={`${styles.listitem} ${selected ? styles.selectedItem : ''}`}
    onClick={onClick}
  >
    <Persona
      name={user.displayName!}
      size="small"
      avatar={{
        image: {
          src: `${absoluteUrl}/_layouts/15/userphoto.aspx?UserName=${user.mail}&size=S`,
        },
      }}
    />
  </ListItem>
);