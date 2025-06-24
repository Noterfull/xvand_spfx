import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import { createDarkTheme, createLightTheme } from '@fluentui/react-components';
import type { BrandVariants, Theme } from '@fluentui/react-components';

import * as strings from 'XvandControlWebPartStrings';
import '@pnp/sp/sites'
// import { XvandApp, IAppProps  } from './XvandApp'
import SharePointAPIService from "./services/SharePointAPIService";
import { IAppProps, XvandApp } from './XvandApp';
import MSGraphService from './services/MSGraphService';

export interface IBaseWebPartProps {
  title: string;
  description: string;
}

export default class XvandControlWebPart extends BaseClientSideWebPart<IBaseWebPartProps> {
  public render(): void {
    const xvandtheme: BrandVariants = {
      10: "#030401",
      20: "#151B09",
      30: "#1F2E0E",
      40: "#263B0F",
      50: "#2D4910",
      60: "#34580F",
      70: "#3B660D",
      80: "#437509",
      90: "#4D840E",
      100: "#619130",
      110: "#759E4A",
      120: "#88AC62",
      130: "#9CB97B",
      140: "#AFC694",
      150: "#C2D4AD",
      160: "#D5E1C6"
    };

    const lightTheme: Theme = {
    ...createLightTheme(xvandtheme),
    };

    const darkTheme: Theme = {
    ...createDarkTheme(xvandtheme),
    };

    darkTheme.colorBrandForeground1 = xvandtheme[110];
    darkTheme.colorBrandForeground2 = xvandtheme[120];

    const appElement: React.ReactElement<IAppProps> = React.createElement(
      XvandApp, {
        context: this.context,
        lightTheme: lightTheme,
        darkTheme: darkTheme
      });
    ReactDom.render(appElement, this.domElement);
  }

  protected async onInit(): Promise<void> {
    SharePointAPIService.init(this.context);
    await MSGraphService.init(this.context);
    return this._getEnvironmentMessage().then();
  }



  private _getEnvironmentMessage(): Promise<string> {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams, office.com or Outlook
      return this.context.sdks.microsoftTeams.teamsJs.app.getContext()
        .then(context => {
          let environmentMessage: string = '';
          switch (context.app.host.name) {
            case 'Office': // running in Office
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOffice : strings.AppOfficeEnvironment;
              break;
            case 'Outlook': // running in Outlook
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOutlook : strings.AppOutlookEnvironment;
              break;
            case 'Teams': // running in Teams
            case 'TeamsModern':
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
              break;
            default:
              environmentMessage = strings.UnknownEnvironment;
          }

          return environmentMessage;
        });
    }

    return Promise.resolve(this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment);
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }
    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: unknown, newValue: unknown): void {
    super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
    this.render();
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
