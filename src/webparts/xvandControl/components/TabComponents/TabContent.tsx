import * as React from 'react';
import { Spinner, SpinnerSize } from '@fluentui/react';
import { AttributesData, RdsAppData, SecurityGroupData, MfaData, ProfileInfoData, AdfsData, MsmfaData } from '../../types/statusTypes';
import { AttributeTab } from './StatusComponent/AttributesTab';

interface TabContentProps {
    activeTab: string;
    isLoading?: boolean;
    data?: AttributesData | RdsAppData | SecurityGroupData | MfaData | ProfileInfoData | AdfsData | MsmfaData;
}

export const TabContent: React.FC<TabContentProps> = ({ activeTab, isLoading, data }) => {
    if (isLoading) {
        return <Spinner size={SpinnerSize.medium} label="Loading..." />;
    }
    switch (activeTab) {
        case 'attributes': {
            const attributes = data as AttributesData;
            return <AttributeTab attributes={attributes} />;
        }
        case 'rdsapp':
            return <div>RDS Applications</div>;
        case 'securitygroup':
            return <div>Security Group</div>;
        case 'mfa':
            return <div>MFA</div>;
        case 'profileinfo':
            return <div>Profile Info</div>;
        case 'adfs':
            return <div>ADFS</div>;
        case 'msmfa':
            return <div>MS MFA</div>;
        default:
            return null;
    }
};