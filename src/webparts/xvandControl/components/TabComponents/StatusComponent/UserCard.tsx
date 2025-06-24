import * as React from 'react';
import { ListItem, Persona } from '@fluentui/react-components';
import { ISiteUserInfo } from '@pnp/sp/site-users';
import styles from './StatusTab.module.scss';

interface UserCardProps {
  user: ISiteUserInfo;
  selected: boolean;
  onClick: () => void;
  absoluteUrl?: string;
}

export const UserCard: React.FC<UserCardProps> = ({ user, selected, onClick, absoluteUrl }) => (
  <ListItem
    key={user.Id}
    className={`${styles.listitem} ${selected ? styles.selectedItem : ''}`}
    onClick={onClick}
  >
    <Persona
      name={user.Title}
      size="small"
      avatar={{
        image: {
          src: `${absoluteUrl}/_layouts/15/userphoto.aspx?UserName=${user.Email}&size=S`,
        },
      }}
    />
  </ListItem>
);