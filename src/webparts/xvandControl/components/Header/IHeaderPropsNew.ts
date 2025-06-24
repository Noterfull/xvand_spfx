import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IHeaderPropsNew {
    context: WebPartContext;
    activeTab: string;
    onTabChange: (tabKey: string) => void;
}