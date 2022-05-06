import * as React from 'react';
import styles from './ChartPackNew.module.scss';
import { IChartPackNewProps } from './IChartPackNewProps';
import { escape } from '@microsoft/sp-lodash-subset';
import ChartPackHome from '../components/ChartPackHomePage/ChartPackHomePage';
//import ChartPackTopic from '../components/ChartPackTopic/ChartPackTopic';
import ChartPackParent from '../components/ChartPackParent/ChartPackParent';
import LeftNav from './LeftNav/LeftNav';
import { sp } from '@pnp/sp';
import $ from 'jquery';
import {
  Spinner,
  SpinnerSize
} from 'office-ui-fabric-react';
import ChartPackTopic from './ChartPackTopic/ChartPackTopic';

export default class ChartPackNew extends React.Component<IChartPackNewProps, {}> {

  constructor(props: IChartPackNewProps) {
    super(props);
    sp.setup({
      sp: { baseUrl: this.props.siteURL },
    });

    setTimeout(() => {
      this._logActivity();
    }, 3000);



    setInterval(() => {
      try {
        document.getElementById('loader').remove();
      } catch (e) {

      }

    }, 3000);
  }

  public async componentDidMount() {
    sp.setup({
      sp: {
        baseUrl: this.props.siteURL
      },
    });
  }
  public _logActivity() {
    try {

      let browser = (() => {
        const { userAgent } = navigator;
        let match = userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        let temp;

        if (/trident/i.test(match[1])) {
          temp = /\brv[ :]+(\d+)/g.exec(userAgent) || [];

          return `IE ${temp[1] || ''}`;
        }

        if (match[1] === 'Chrome') {
          temp = userAgent.match(/\b(OPR|Edge)\/(\d+)/);

          if (temp !== null) {
            return temp.slice(1).join(' ').replace('OPR', 'Opera');
          }

          temp = userAgent.match(/\b(Edg)\/(\d+)/);

          if (temp !== null) {
            return temp.slice(1).join(' ').replace('Edg', 'Edge (Chromium)');
          }
        }

        match = match[2] ? [match[1], match[2]] : [navigator.appName, navigator.appVersion, '-?'];
        temp = userAgent.match(/version\/(\d+)/i);

        if (temp !== null) {
          match.splice(1, 1, temp[1]);
        }

        return match.join(' ');
      })();
      let deviceType = navigator.userAgent;

      sp.web.currentUser().then(user => {
        $.ajax({
          url: "https://prod-25.eastus.logic.azure.com:443/workflows/b84a818e05ab4fb5bd9b68a1f34570d2/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=lD--7p6MWuw2RxFSLfA29WOc94Nfn1QkltPYWm5RkGE",
          method: "POST",
          contentType: 'application/json; charset=utf-8',
          data: JSON.stringify(
            {
              siteUrl: window.location.href.toString(),
              upn: user.UserPrincipalName.toLowerCase(),
              activityType: "Page View",
              browser: browser,
              deviceType: deviceType
            }
          )
        });
      });
    } catch (e) {
      this._logActivity();
    }

  }
  public render(): React.ReactElement<IChartPackNewProps> {

    let PageTemplate: string = this.props.PageTemplate;

    return (
      <div className={styles.chartPackNew}>
        <div id="loader" style={{ position: 'fixed', top: 0, left: 0, backgroundColor: 'white', width: '100vw', height: '100vh', zIndex: 100 }}>
          <Spinner style={{ top: '30%', position: 'relative' }} size={SpinnerSize.large} label="Loading" />
        </div>
        {/* <LeftNav description={"string"} siteURL={"this.props.siteUrl"} context={this.props.context} /> */}
        {
          PageTemplate == "ChartPack-Home" ? 
          <ChartPackHome description="" siteURL="https://phrma.sharepoint.com/sites/Connect-ChartPack" /> : 
          PageTemplate == "ChartPack-Parent" ? 
          <ChartPackParent description={this.props.description} siteURL="https://phrma.sharepoint.com/sites/Connect-ChartPack" /> : 
          PageTemplate == "ChartPack-Topic" ?  <ChartPackTopic description={this.props.description} siteUrl="https://phrma.sharepoint.com/sites/Connect-ChartPack" /> : ""
        }
      </div>
    );
  }
}
