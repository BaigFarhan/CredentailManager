import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'CredentialManagerHomeWebPartStrings';
import CredentialManagerHome from './components/CredentialManagerHome';
import { ICredentialManagerHomeProps } from './components/ICredentialManagerHomeProps';

export interface ICredentialManagerHomeWebPartProps {
  description: string;
}

export default class CredentialManagerHomeWebPart extends BaseClientSideWebPart<ICredentialManagerHomeWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ICredentialManagerHomeProps > = React.createElement(
      CredentialManagerHome,
      {
        description: this.properties.description
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
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
