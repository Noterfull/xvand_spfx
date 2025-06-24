import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IHeaderProps {
    absoluteUrl: string | undefined;
    siteName: string,
    context: WebPartContext
}