import * as React from 'react';
import { IChartPackTopicProps } from './IChartPackTopicProps';
import { IChartPackTopicState } from './IChartPackTopicState';
import styles from "./ChartPackTopics.module.scss";
import { sp } from "@pnp/sp/presets/all";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import * as MicrosoftGroup from "@microsoft/microsoft-graph-types";
import ReactPaginate from 'react-paginate';
import { MSGraphClient } from "@microsoft/sp-http";
import {
  getTheme,
  mergeStyleSets,
  FontWeights,
  Modal,
  TextField,
  Dropdown,
  PrimaryButton,
  Spinner,
  SpinnerSize,
  INavStyles
  
} from 'office-ui-fabric-react';

import "../style.css";
import $ from 'jquery';
let title = "";
// const navStyles: Partial<INavStyles> = {root: {width: 350}, linkText: {color: "#2b88d2!important", fontSize: "14px!important"}};
const theme = getTheme();
const contentStyles = mergeStyleSets({
  container: {
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'stretch',
  },
  header: [
    {
      flex: '1 1 auto',
      borderTop: `4px solid ${theme.palette.themePrimary}`,
      color: '#323130',
      fontFamily: 'open Sans',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: FontWeights.semibold,
      padding: '0',
      fontSize: '18px'
    },
  ],
  body: {
    flex: '4 4 auto',
    padding: '0 24px 24px 24px',
    overflowY: 'hidden',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    width: '50vw',
    selectors: {
      p: { margin: '14px 0' },
      'p:first-child': { marginTop: 0 },
      'p:last-child': { marginBottom: 0 },
    },
  },
});

export default class ChartPackTopic extends React.Component<IChartPackTopicProps, IChartPackTopicState> {
  public context: WebPartContext;

  public setup(context: WebPartContext): void {
    this.context = context;
  }
  constructor(props: IChartPackTopicProps, state: IChartPackTopicState) {

    super(props);
    sp.setup({
      sp: { baseUrl: this.props.siteUrl }
    });

    this.state = {
      items: [],
      filteredItems: [],
      FilterTopicDrpDown: [],
      isModalOpen: false,
      popupData: {},
     
    };


  }

  
  public async componentDidMount() { 

    sp.setup({
      sp: {
        baseUrl: "https://phrma.sharepoint.com/sites/Connect-ChartPack/"
      },
    });
    //get Title from URl
    const searchparms = new URLSearchParams(location.search);
    title = searchparms.get('title' || '');
    //get data from Library
    let topicsData = await sp.web.lists.getByTitle("All Documents").items
      .select("Title,IsParent,ChapterNumber,Featured,Topic/Topics,Presentation,FileLeafRef,FileRef,ChapterName,ImageUrl")
      .expand("Topic").top(500)
      // .filter("Topic/Topics eq '" + title + "'")
      .get();
    let filteredData = [];
    topicsData.map((data) => {
      if (data.Topic != undefined) {
        for (let i = 0; i < data.Topic.length; i++) {
          if (data.Topic[i].Topics == title) {
            filteredData.push(data);
            break;
          }
        }
      }
    });
    let val = await sp.web.lists.getByTitle("Topics").items.select("Topics").orderBy("Topics").get();
    let dropDownItems = [];
    dropDownItems.push({ key: '0', text: 'Filter By Topic' });
    val.forEach(item => dropDownItems.push({ key: item.Topics, text: item.Topics }));
    this.setState({ items: filteredData, filteredItems: [...filteredData].splice(0,8), FilterTopicDrpDown: dropDownItems });
  }
  public handlePdfData(data) {
    this.setState({ popupData: data });
    this.handleModal(true);
  }
  public handleModal(type) {
    this.setState({ isModalOpen: type });
  }
  public featureFilter(events, options) {
    if (options.key == 'Yes') {
      this.setState({ filteredItems: [...this.state.items.filter(item => item.Featured == 'true')].splice(0, 8) });
    } else if (options.key == 'No') {
      this.setState({ filteredItems: [...this.state.items.filter(item => item.Featured == 'false')].splice(0, 8) });
    } else {
      this.setState({ filteredItems: [...this.state.items].splice(0, 8) });
    }
  }
  public topicFilter(events, options) {
    window.open(`${this.props.siteUrl}/SitePages/Topics.aspx?title=${options.text}`,'_self');
  }
  public handleParentClick(data) {
    let selected = data.selected;
    let offset = Math.ceil(selected * 8);
    let newData = [...this.state.items].splice(offset, 8);
    this.setState({ filteredItems: newData });
  }

  public async searchData(event, text) {
    if (text.trim() !== '') {
      let filterQuery = "( (substringof('" + text + "',Title)) or (substringof('" + text + "',ChapterName)) or (substringof('" + text + "',Presentation)) )";
      let parentDataLocal = await sp.web.lists.getByTitle("All Documents").items
        .select("Title,IsParent,ChapterNumber,Featured,Topic/Topics,Presentation,FileLeafRef,FileRef,ChapterName,ImageUrl")
        .expand("Topic").top(200)
        .filter(filterQuery)
        .orderBy("ChapterNumber", true)
        .get();

      let filteredData = [];
      const searchparms = new URLSearchParams(location.search);
      const title = searchparms.get('title' || '');
      parentDataLocal.map((data) => {
        if (data.Topic != undefined) {
          for (let i = 0; i < data.Topic.length; i++) {
            if (data.Topic[i].Topics == title) {
              filteredData.push(data);
              break;
            }
          }
        }
      });
      this.setState({ filteredItems: filteredData });
    } else {
      this.setState({ filteredItems: this.state.items });
    }
  }

  public render(): React.ReactElement<IChartPackTopicProps> {
    return (
      <div className={styles.chartPackTopics}>
        {/* <div id="loader" style={{ position: 'fixed', top: 0, left: 0, backgroundColor: 'white', width: '100vw', height: '100vh', zIndex: 100}}>
          <Spinner style={{top: '30%', position: 'relative'}} size={SpinnerSize.large} label="Loading" />
        </div> */}
        <div style={{ marginLeft: '10px' }}>
          <a style={{ textDecoration: "none", fontSize: "18px", marginBottom: '10px', color: 'rgb(43, 136, 210)' }} href="https://phrma.sharepoint.com/sites/Connect-ChartPack">Go Back To Chart Packs</a>
          <div className={styles.filterWrap}>
            <div>
              <TextField label="Search" placeholder="Search" onChange={this.searchData.bind(this)} />
            </div>
            <div>
              <Dropdown
                placeholder={title}
                label="Topic"
                onChange={this.topicFilter.bind(this)}
                options={this.state.FilterTopicDrpDown}
              />
            </div>
           
          </div>
          <div>
            <h4 style={{ color: "#d55e27" }}>{title}</h4>
            <div className={styles.chartPackParentWrap}>
              {
                this.state.filteredItems.map(items => {
                  return (
                    <div className={styles.singleParentCard} onClick={this.handlePdfData.bind(this, items)}>
                      <div className={styles.cardImage} style={{ backgroundImage: `url('${items.ImageUrl.Url}')` }}>
                      </div>
                      <div className={styles.cardContent}>
                        <h4>{items.Title}</h4>
                      </div>
                    </div>
                  );
                })
              }
            </div>
            <ReactPaginate
              previousLabel={"Prev"}
              nextLabel={"next"}
              breakLabel={"..."}
              pageCount={Math.ceil(this.state.items.length / 8)}
              //mainPageDisplayed={1}
              pageRangeDisplayed={5}
              containerClassName={"pagination"}
              subContainerClassName={"pages pagination"}
              onPageChange={this.handleParentClick.bind(this)}
              activeClassName={"active"}
            />
          </div>
          <Modal
            isOpen={this.state.isModalOpen}
            onDismiss={this.handleModal.bind(this, false)}
            isBlocking={false}
            containerClassName={contentStyles.container}
          >
            <div className={contentStyles.header}>
              <span>{this.state.popupData.Title}</span>
            </div>
            <div className={contentStyles.body}>
              <div className={styles.popupImage} style={{ backgroundImage: `url('${this.state.popupData.ImageUrl && this.state.popupData.ImageUrl.Url}')` }}>
              </div>
              <div className={styles.popupdownload}>
                
                <h3><a href={'https://phrma.sharepoint.com/sites/Connect-ChartPack/_layouts/download.aspx?SourceUrl=' + 'https://phrma.sharepoint.com' + this.state.popupData.FileRef}>Download PPT</a></h3>
                <PrimaryButton text="Close Window" style={{ backgroundColor: "#0078D4", borderColor: "#0078D4" }} onClick={this.handleModal.bind(this, false)} allowDisabledFocus className={styles.CloseWindow} />
              </div>
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}

