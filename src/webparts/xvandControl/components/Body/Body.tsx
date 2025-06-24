import * as React from 'react';
import { IBodyProps } from './IBodyProps'
import { StatusTab } from '../TabComponents/StatusComponent/StatusTab';
import styles from './Body.module.scss';

export const Body: React.FC<IBodyProps> = (props) => {
    const { selectedTab, context } = props;
    const absoluteUrl: string = context.pageContext.web.absoluteUrl;
    const renderContent = (): JSX.Element => {
        switch (selectedTab) {
            case "status":
                return <StatusTab absoluteUrl={absoluteUrl} context={context} />;
            case "users":
                return <div>Содержимое для Таба 2</div>;
            case "rds":
                return <div>Содержимое для Таба 3</div>;
            case "security":
                return <div>Содержимое для Таба 3</div>;
            case "emails":
                return <div>Содержимое для Таба 3</div>;
            case "reports":
                return <div>Содержимое для Таба 3</div>;
            case "crosscomp":
                return <div>Содержимое для Таба 3</div>;
            case "crosscomprep":
                return <div>Содержимое для Таба 3</div>;
            case "forms":
                return <div>Содержимое для Таба 3</div>;
            case "laps":
                return <div>Содержимое для Таба 3</div>;
            default:
                return <div> </div>;
        }
    };

    return <div className={styles.bodyContainer}>{renderContent()}</div>;
  };