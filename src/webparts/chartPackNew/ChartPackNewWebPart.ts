import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown,
  IPropertyPaneDropdownOption
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'ChartPackNewWebPartStrings';
import ChartPackNew from './components/ChartPackNew';
import { IChartPackNewProps } from './components/IChartPackNewProps';

export interface IChartPackNewWebPartProps {
  description: string;
  PageTemplate: any;

}

export default class ChartPackNewWebPart extends BaseClientSideWebPart<IChartPackNewWebPartProps> {

  public options: IPropertyPaneDropdownOption[] = [
    {
      key: 'ChartPack-Home',
      text: 'ChartPack-Home'
    },
    {
      key: 'ChartPack-Parent',
      text: 'ChartPack-Parent'
    },
    {
      key: 'ChartPack-Topic',
      text: 'ChartPack-Topic'
    }
  ];
  public render(): void {
    const element: React.ReactElement<IChartPackNewProps> = React.createElement(
      ChartPackNew,
      {
        description: this.properties.description,
        context: this.context,
        siteURL: this.context.pageContext.web.absoluteUrl,
        PageTemplate: this.properties.PageTemplate
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
  public onPropertyPaneFieldChanged(propertyPath: string, oldValue: string, newValue: string) {
    if (propertyPath === 'PageTemplate' && newValue) {
      this.properties.PageTemplate = newValue;
      // console.log("Page Template: " +  this.properties.PageTemplate);
    }
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
                }),
                PropertyPaneDropdown('PageTemplate', {
                  label: 'Page Template',
                  options: this.options
                }),
              ]
            }
          ]
        }
      ]
    };
  }
}
