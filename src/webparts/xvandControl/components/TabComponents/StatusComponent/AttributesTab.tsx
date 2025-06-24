// components/AttributeTab.tsx
import * as React from 'react';
import {
  Textarea, Field
} from "@fluentui/react-components";
import { AttributesData } from '../../../types/statusTypes';
import { BottomComponents } from './BottomComponents';

interface AttributeTabProps {
  attributes: AttributesData;
}

export const AttributeTab: React.FC<AttributeTabProps> = ({ attributes }) => {
  if (!attributes) return <div>No attribute data available.</div>;

  const labelMap: Record<string, string> = {
    displayName: "Display name",
    givenName: "First name",
    surname: "Last name",
    userPrincipalName: "User principal name",
    userType: "User type",
    createdDateTime: "Created date time",
    lastPasswordChangeDateTime: "Last password change",
    mail: "E-mail",
    proxyAddresses: "Primary SMTP e-mail",
    assignedLicenses: "Assigned Licenses",
    id: "ID",
    jobTitle: "Job Title",
    department: "Department"
  };

  return (
    <>
      <table style={{ borderCollapse: 'collapse' }}>
        <tbody>
          {Object.entries(attributes).map(([key, value]) => (
            <tr key={key} style={{ borderBottom: '1px solid #ccc' }}>
              <td style={{ padding: '8px', fontWeight: 'bold', border: '1px solid #ddd', whiteSpace: 'nowrap', margin: '15px 0' }}>
                {labelMap[key] ?? key}
              </td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                {Array.isArray(value)
                  ? value.join(', ')
                  : typeof value === 'object' && value !== null
                    ? JSON.stringify(value)
                    : String(value)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <BottomComponents userPrincipalName={attributes.userPrincipalName} selectedUser={attributes.displayName} />
      <Field label="Notes">
        <Textarea
          appearance="outline"
          resize="vertical"
        />
      </Field>
    </>
  );
};
