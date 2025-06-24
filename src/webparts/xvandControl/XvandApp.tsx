import * as React from 'react';
import { useState } from 'react';
import { HeaderNew } from './components/Header/Header';
import { Body } from './components/Body/Body'
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IdPrefixProvider, FluentProvider } from "@fluentui/react-components";
import type { Theme } from "@fluentui/react-components";

export interface IAppProps {
  context: WebPartContext;
  lightTheme: Theme;
  darkTheme: Theme;
}

export const XvandApp: React.FC<IAppProps> = (props) => {
  const { context, lightTheme, darkTheme } = props;
  const [ activeTab, setActiveTab ] = useState<string>("");

  const handleTabChange = (tabKey: string): void => {
    setActiveTab(tabKey);
  };
  const themeKey = context.pageContext.legacyPageContext?.themeKey;
  const isDark = themeKey === 'dark' || themeKey === 'black';
  return (
    <div>
      <IdPrefixProvider value="main-programm">
        <FluentProvider theme={ isDark  ? darkTheme : lightTheme}>
          <HeaderNew
            activeTab={activeTab}
            onTabChange={handleTabChange}
            context={context}
          />
          <Body
            selectedTab={activeTab}
            context={context}
          />
        </FluentProvider>
      </IdPrefixProvider>
    </div>
  );
};