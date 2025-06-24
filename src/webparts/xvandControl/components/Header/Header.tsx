import * as React from 'react';
import styles from './Header.module.scss';
import type { IHeaderPropsNew } from './IHeaderPropsNew'
import { TabList, Tab, Image, ImageProps } from '@fluentui/react-components';
import type { TabValue, SelectTabEvent, SelectTabData } from "@fluentui/react-components";

export interface IHeaderState {
    selectedValue: TabValue;
    userData: Promise<void>;
}

const tabs = [
    { id: "status", value: "status", label: "Status" },
    { id: "users",  value: "users", label: "Users" },
    { id: "removed", value: "removed", label: "Removed" },
    { id: "rds", value: "rds", label: "RDS Applications" },
    { id: "security", value: "security", label: "Security" },
    { id: "emails", value: "emails", label: "E-Mails" },
    { id: "reports", value: "reports", label: "Reports" },
    { id: "crosscomp", value: "crosscomp", label: "Cross Comp" },
    { id: "crosscomprep", value: "crosscomprep", label: "Cross Comp Reports" },
    { id: "forms", value: "forms", label: "Forms" },
    { id: "laps", value: "laps", label: "Laps" },
];

// export class Header extends React.Component<IHeaderProps, IHeaderState> {
//     constructor(props: IHeaderProps) {
//         super(props);
//         this.state = {
//             selectedValue: "",
//             userData: this.getUserData()
//         };
//     }

//     public handleTabClick = (item?: TabValue): void => {
//         if (item) {
//             console.log(`Selected tab: ${item}`);
//         }
//     };

//     public onTabSelect = (event: SelectTabEvent, data: SelectTabData):void => {
//         this.setState({ selectedValue: data.value });
//     };
//     public getUserData = async(): Promise<void> => {
//         try {
//             console.log("Attempting to get Graph client...");
//             const graphClient: MSGraphClientV3 = await this.props.context.msGraphClientFactory.getClient('3');
//             console.log("Graph client obtained:", graphClient);

//             const userResponse = await graphClient.api('/users/74').get();
//             console.log("User response obtained:", userResponse);

//             if (userResponse && userResponse.value && userResponse.value.length > 0) {
//                 this.setState({ userData: userResponse });
//                 console.log("Данные пользователя:", userResponse);
//             } else {
//                 console.log("Пользователь не найден");
//             }
//         } catch (error) {
//             console.error("Ошибка при получении данных пользователя:", error);
//         }
//     }
//     public render(): React.ReactElement<IHeaderProps> {
//         const { absoluteUrl, siteName } = this.props;
//         const { selectedValue, userData } = this.state;
//         console.log(userData);

//         const imageProps: ImageProps = {
//             src: `${absoluteUrl}/_api/siteiconmanager/getsitelogo`,
//             alt: 'Company Logo',
//             width: 60,
//             height: 70,
//             className: styles.logo,
//         };
//         return (
//             <div className={styles.root}>
//                 <div className={styles.headerContainer}>
//                     <div className={styles.logoContainer}>
//                         {absoluteUrl && <Image {...imageProps} />}
//                     </div>
//                     <div className={styles.siteName}>
//                         {siteName}
//                     </div>
//                 </div>
//                 <div className={styles.m25}>
//                     <div className={styles.tabContainer}>
//                         <TabList className={styles.tabList} selectedValue={selectedValue} onTabSelect={this.onTabSelect}>
//                             {tabs.map((tab) => (
//                                 <Tab key={tab.id} className={styles.tabItem} id={tab.id} value={tab.value}>
//                                     {tab.label}
//                                 </Tab>
//                             ))}
//                         </TabList>
//                     </div>
//                 </div>
//                 <div className={styles.bodyContainer}>
//                     {selectedValue === "status" && <StatusTab absoluteUrl={absoluteUrl } />}
//                     {selectedValue === "users" && "Users"}
//                     {selectedValue === "removed" && "Removed"}
//                 </div>
//             </div>
//         );
//     }
// }

export const HeaderNew: React.FC<IHeaderPropsNew> = (props) => {
    const { context, activeTab, onTabChange } = props;

    const absoluteUrl: string = context.pageContext.web.absoluteUrl;
    const siteName: string = context.pageContext.web.title;

    const imageProps: ImageProps = {
        src: `${absoluteUrl}/_api/siteiconmanager/getsitelogo`,
        alt: 'Company Logo',
        width: 60,
        height: 70,
        className: styles.logo,
    };

    const handleTabSelect = (event: SelectTabEvent, data: SelectTabData): void =>  {
        if (data.value !== undefined) {
            onTabChange(String(data.value));
        }
    };

    return (
        <div className={styles.root}>
            <div className={styles.headerContainer}>
                <div className={styles.logoContainer}>
                    {absoluteUrl && <Image {...imageProps} />}
                </div>
                <div className={styles.siteName}>
                    {siteName}
                </div>
            </div>
            <div className={styles.m25}>
                <div className={styles.tabContainer}>
                    <TabList className={styles.tabList} selectedValue={activeTab} onTabSelect={handleTabSelect}>
                        {tabs.map((tab) => (
                            <Tab key={tab.id} className={styles.tabItem} id={tab.id} value={tab.value}>
                                {tab.label}
                            </Tab>
                        ))}
                    </TabList>
                </div>
            </div>
        </div>
    );
}