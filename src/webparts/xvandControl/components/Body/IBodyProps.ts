import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IBodyProps {
    context: WebPartContext;
    selectedTab: string;
}