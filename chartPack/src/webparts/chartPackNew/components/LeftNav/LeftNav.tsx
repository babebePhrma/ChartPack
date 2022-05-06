import * as React from 'react';
//import styles from '../ChartPackHomePage.module.scss';
import { ILeftNavProps } from './ILeftNavProps';
import { escape } from '@microsoft/sp-lodash-subset';

import {
  Nav,
  INavStyles,
  Icon,
} from "office-ui-fabric-react";
import { ILeftNavState } from './ILeftNavState';
import { sp } from '@pnp/sp';

const navStyles: Partial<INavStyles> = { root: { width: 350 }, linkText: { color: "#2b88d2!important", fontSize: "14px!important" } };

export default class LeftNav extends React.Component<ILeftNavProps, ILeftNavState> {
  constructor(props: ILeftNavProps, state: ILeftNavState) {
    super(props);
    sp.setup({
      sp: { baseUrl: this.props.siteURL },
    });
    this.state = {
      leftNavGroups: [],
      navLinks: [],
      userGroups: [],
      groups: [],
      navShow: "none",
      navWidth: 40,
      bodyWidth: 'calc(100vw - 610px)',
    };
    this._toggleNav = this._toggleNav.bind(this);
  }
  public getNavbar() {
    let mainLinks: any = [];
    this.state.navLinks.map((data) => {
      let navLinksData = [];
      let links = [];

      data.Data.map((d) => {
        links.push({ name: d.Title, url: d.Link });
      });
      // navLinksData.push({ name: data.Parent, links: links, url: "", expandAriaLabel: '', collapseAriaLabel: '', })
      mainLinks.push({ links: links, name: data.Parent });
      // mainLinks = mainLinks.sort((a, b) => {
      //   return a > b ? 1 : -1;
      // });
      //mainLinks.push(additionalData);
    });
    let featuredLinks = [


      {
        "url": "https://phrma.sharepoint.com/sites/Connect-ChartPack/",
        "name": "Chart Pack  Library"

      },
      {
        "url": "https://phrma.sharepoint.com/sites/connect/Communities/MarketAccess",
        "name": "International Market Access Platform"

      },
      // {
      //   "url": "https://phrma.sharepoint.com/sites/PhRMAResearchProjects",
      //   "name": "PhRMA Research Projects"

      // },
      {
        "url": "https://phrma.sharepoint.com/sites/connect/Communities/SRAKITs/FederalRegister/Pages/Home.aspx",
        "name": "SRA Federal Register Engagement"

      },
      {
        "url": "https://phrma.sharepoint.com/sites/connect/dir/Pages/StaffDirectory.aspx",
        "name": "Staff Directory"

      },
      {

        "name": "Toolkits",
        // "url": "#",
        // "target": "_blank",
        "collapseByDefault": true,
        "aria-expanded": false,
        "expandAriaLabel": 'Expand Parent link 1',
        "collapseAriaLabel": 'Collapse Parent link 1',
        "links": [
          {
            "url": "https://phrma.sharepoint.com/sites/connect/toolkitssite/Compulsory%20Licensing%20Toolkit/Forms/AllItems.aspx",
            "name": "Compulsory Licensing Advocacy Toolkit - International"
          },
          {
            "url": "https://phrma.sharepoint.com/sites/connect/toolkitssite/Documents/Combatting%20Opioid%20Abuse_Toolkit_2.0_Final.pdf",
            "name": "Combating Opioid Abuse and Addiction"
          },
          {
            "url": "https://phrma.sharepoint.com/sites/connect/toolkitssite/International%20Prescription%20Costs%20in%20Context/Forms/AllItems.aspx",
            "name": "International Prescription"
          },
          {
            "url": "https://phrma.sharepoint.com/sites/connect/toolkitssite/Restrictive%20Patentability%20Criteria%20Advocacy%20Toolki/Forms/AllItems.aspx",
            "name": "Restrictive Patentability Criteria Advocacy Toolkit - International"
          },
          {
            "url": "https://phrma.sharepoint.com/sites/connect/toolkitssite/Documents/Value-DrivenHealthCareToolkit.pdf",
            "name": "Value Driven Healthcare"
          }
        ]
      }
    ];
    let phrmaLinks = [
      {
        "url": "https://www.innovation.org/?__hstc=99188225.419cc8a2f1db69a9cc487d15fb522960.1608099586665.1617738144924.1617801346376.20&__hssc=99188225.3.1617801346376&__hsfp=1281939615",
        "name": "America's Biopharmaceutical Companies"
      },
      {
        "url":"https://letstalkaboutcost.org/",
        "name": "Let's Talk About Cost"
      },
      {
        "url": "https://mat.org/",
        "name": "Medicine Assistance Tool"
      },
      {
        "url": "http://www.phrmafoundation.org/",
        "name": "PhRMA Foundation"
      },
      {
        "url": "https://www.phrma.org/about/our-leadership",
        "name": " PhRMALeadership"
      },
      {
        "url": "https://www.phrma.org/about/members",
        "name": "PhRMA Members"

      },
      {
        "url": "https://phrma.org",
        "name": "PhRMA.org"

      },
      {
        "url": "https://prescriptionformedicare.org/",
        "name": "Prescription for Medicare"
      },
      {
        "url": "https://innovation.org/takeaction?__hstc=99188225.419cc8a2f1db69a9cc487d15fb522960.1608099586665.1617738144924.1617801346376.20&__hssc=99188225.3.1617801346376&__hsfp=1281939615",
        "name": "Voters for Cures"
      },
      {

        "url": "https://www.weworkforhealth.org/",
        "name": "We Work for Health"
      } 
    ];
    let resources = [
      {
        "url": "https://phrma.sharepoint.com/sites/connect/visitphrma/SitePages/Home.aspx",
        "name": "Visiting PhRMA"
      },
      {
        "url": "https://phrma.sharepoint.com/sites/PhrmaConnect/Shared%20Documents/PhRMA%20Overview%20Deck.pdf",
        "name": "PhRMA Overview"
      }
    ];

    let grandParentLink = [];
    grandParentLink.push({ name: "My Groups ", url: "", links: mainLinks, expandAriaLabel: "Expand Parent Link 1", collapseAriaLabel: "Expand Parent Link 1" });
    grandParentLink.push({ name: "Featured Content", url: "", links: featuredLinks, expandAriaLabel: "Expand Parent Link 1", collapseAriaLabel: "Expand Parent Link 1", "collapseByDefault": true, "aria-expanded": false, });
    grandParentLink.push({ name: "PhRMA Links", url: "", links: phrmaLinks, expandAriaLabel: "Expand Parent Link 1", collapseAriaLabel: "Expand Parent Link 1", "collapseByDefault": true, "aria-expanded": false, });
    grandParentLink.push({ name: "Resources", url: "", links: resources, expandAriaLabel: "Expand Parent Link 1", collapseAriaLabel: "Expand Parent Link 1", "collapseByDefault": true, "aria-expanded": false, });
    

    return (

      <Nav styles={navStyles} ariaLabel="Nav example with nested links" groups={grandParentLink} />
    );
  }
  public _toggleNav() {
    var navWidth = this.state.navWidth == 350 ? 40 : 350;
    var navShow = this.state.navShow == 'block' ? 'none' : 'block';
    var bodyWidth = 'calc(100vw - ' + (navWidth + 30) + 'px)';

    this.setState({ bodyWidth: bodyWidth, navWidth: navWidth, navShow: navShow });

  }
  public async componentDidMount() {
    sp.setup({
      sp: {
        baseUrl: "https://phrma.sharepoint.com/sites/PhrmaConnect"
      },
    });
    var searchFilters = {
      Querytext: "(contentclass:STS_Site OR contentclass:STS_Web)",
      RowLimit: 999,
      TrimDuplicates: false
    };

    let results = await sp.search(searchFilters);

    let navListData = await sp.web.lists.getByTitle("ConnectSites").items.get();

    let data: any = [];
    if (navListData.length != 0) {
      results.PrimarySearchResults.map((item) => {
        if (item.WebTemplate != "App" && item.WebTemplate != "SPSPERS") {
          let ShowSite = false;
          let parentName = "";
          let CustomTitle = "";
          let orderNo = 0;
          for (let i = 0; i < navListData.length; i++) {
            if (navListData[i].Title == item.Title) {
              ShowSite = true;
              if (navListData[i].CustomTitle != null) {
                CustomTitle = navListData[i].CustomTitle;
              }
              if (navListData[i].OrderNo != null) {
                orderNo = navListData[i].OrderNo;
              }
              if (navListData[i].ParentSite != null) {
                parentName = navListData[i].ParentSite;
              } else {
                parentName = "";
              }
              break;
            }
          }
          if (ShowSite == true) {
            data.push({
              Title: item.Title,
              Link: item.OriginalPath,
              Parent: parentName,
              CustomTitle: CustomTitle,
              OrderNo: orderNo
            });
          }
        }
      });
    }

    let i = 0;
    let jsonData = [];

    data.map((item) => {
      let ParenExists = this._isContains(jsonData, item.Parent);
      console.log(ParenExists);
      if (ParenExists == false) {
        let tempArr = [{ Link: item.Link, Title: item.CustomTitle, OrderNo: item.OrderNo }];
        jsonData.push({ key: i, Parent: item.Parent, Data: tempArr });
        ++i;
      } else {
        jsonData.map((mapItem) => {
          if (mapItem.Parent == item.Parent) {
            let tempArr = mapItem.Data;
            tempArr.push({ Link: item.Link, Title: item.CustomTitle, OrderNo: item.OrderNo });
            jsonData[mapItem.key] = {
              key: mapItem.key,
              Parent: item.Parent,
              Data: tempArr,
            };
          }
        });
      }
    });

    let sortedData = [];
    jsonData.map((data) => {
      let sortData = data.Data.sort(this.sortByProperty("OrderNo"));
      sortedData.push({ key: data.key, Parent: data.Parent, Data: sortData });
    });
    sortedData = sortedData.sort((a, b) => {
      if (a.Title > b.Title) {
        return 1;
      } else if (a.Parent > b.Parent) {
        return 1;
      } else {
        return -1;
      }
    });

    this.setState({navLinks: sortedData,});
  }

   public contains(arr, key, val) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i][key] === val) return true;
    }
    return false;
  }

  public sortByProperty(property) {
    return function (a, b) {
      if (a[property] > b[property])
        return 1;
      else if (a[property] < b[property])
        return -1;
      return 0;
    };
  }
  public _isContains(json, value) {
    let contains = false;
    Object.keys(json).some((key) => {
      contains =
        typeof json[key] === "object"
          ? this._isContains(json[key], value)
          : json[key] === value;
      return contains;
    });
    return contains;
  }
  
  public render(): React.ReactElement<ILeftNavProps> {
    return (
      <div>      
        <aside
            style={{
            transitionDuration: "0.3s",
            boxShadow: "3px 0px 0px 0px rgba(213, 94, 39, 0.75)",
            overflowY: "auto",
            paddingRight: 9,
            width: this.state.navWidth,
            zIndex: 9,
            verticalAlign: "top",
            color: "black",
            position: "absolute",
            top: 0,
            left: 0,
            padding: "20px 5px 20px 0px",
            backgroundColor: "white",
            minHeight: "calc(100vh - 75px)",
            height: "100%",
          }}
        >
          <Icon
            iconName={this.state.navShow == "none" ? "List" : "MinimumValue"}
            onClick={this._toggleNav}
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              fontSize: "1.5em",
              cursor: "pointer",
            }}
          />
          <div style={{ display: this.state.navShow }}>
            {this.getNavbar()}
          </div>
        </aside>
      </div>
    );
  }
}
