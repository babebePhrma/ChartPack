import * as React from "react";
import styles from "./ChartPackHomePage.module.scss";
import { IChartPackHomePageProps } from "./IChartPackHomePageProps";
import { IChartPackHomePageState } from "./IChartPackHomePageState";
import { sp } from '@pnp/sp/presets/all';
import { TextField } from "@microsoft/office-ui-fabric-react-bundle";
import {
  getTheme,
  mergeStyleSets,
  FontWeights,
  Modal,
  IIconProps,
  PrimaryButton,
  Nav,
  INavStyles,
} from "office-ui-fabric-react";
import ReactPaginate from "react-paginate";
import "../style.css";
import { isEqual } from "@microsoft/sp-lodash-subset";
import {
  Card, CardContent, CardMedia, Typography, CardActionArea
} from '@material-ui/core';
const navStyles: Partial<INavStyles> = { root: { width: 350 }, linkText: { color: "#2b88d2!important", fontSize: "14px!important" } };
const theme = getTheme();
const contentStyles = mergeStyleSets({
  container: {
    display: "flex",
    flexFlow: "column nowrap",
    alignItems: "stretch",
  },
  header: [
    {
      flex: "1 1 auto",
      borderTop: `4px solid ${theme.palette.themePrimary}`,
      color: '#323130',
      fontFamily: 'open Sans',
      display: "flex",
      alignItems: "center",
      fontWeight: FontWeights.semibold,
      padding: "0",
      fontSize: "18px",
    },
  ],
  body: {
    flex: "4 4 auto",
    padding: "0",
    overflowY: "hidden",
    width: "50vw",
    selectors: {
      p: { margin: "14px 0" },
      "p:first-child": { marginTop: 0 },
      "p:last-child": { marginBottom: 0 },
    },

  },

});

export default class ChartPackHome extends React.Component<
  IChartPackHomePageProps, IChartPackHomePageState
> {
  constructor(props: IChartPackHomePageProps, state: IChartPackHomePageState) {
    super(props);
    sp.setup({
      sp: { baseUrl: this.props.siteURL },
    });

    this.state = {
      featuredData: [],
      filteredParentData: [],
      parentData: [],
      topicData: [],
      isModalOpen: false,
      popupData: {},
      searchResults: [],
      exitSearch: '',
      filteredFeaturedData: [],
    };
  }

  public async componentDidMount() {
    sp.setup({
      sp: {
        baseUrl: this.props.siteURL
      },
    });

    var searchFilters = {
      Querytext: "(contentclass:STS_Site OR contentclass:STS_Web)",
      RowLimit: 999,
      TrimDuplicates: false
    };

    let results = await sp.search(searchFilters);
    let allLibraryData = [];
    let parentDataLocal = [];
    let featuredDataLocal = [];
    let topicData = [];

    await sp.web.select("Connect-ChartPack").lists
      .getByTitle("All Documents")
      .items.select(
        "Title,IsParent,ChapterNumber,Featured,Topic/Title,Presentation,FileLeafRef,FileRef,ImageUrl"
      )
      .expand("Topic").top(1900)
      .get()
      .then((response) => {
        allLibraryData = response;
      });
    //filtering featured Data
    featuredDataLocal = allLibraryData.filter(
      (response) => response.Featured == true
    );
    //console.log(allLibraryData);

    //get parent data from Packs list
    await sp.web.lists
      .getByTitle("Packs")
      .items.select("Title,Released,PDFLink,PPTLink,OrderNo,ImageUrl")
      .orderBy("OrderNo", true)
      .get()
      .then((response) => {
        parentDataLocal = response;
      });
    console.log(parentDataLocal);

    //get Topic data from Topics List
    await sp.web.lists
      .getByTitle("Topics")
      .items.select("Topics,Description")
      .get()
      .then((response) => {
        topicData = response;
      });
    //set state Data
    this.setState({
      parentData: parentDataLocal,
      featuredData: featuredDataLocal,
      filteredFeaturedData: [...featuredDataLocal].splice(0, 8),
      topicData: topicData,
      filteredParentData: [...parentDataLocal].splice(0, 10),
    });

  }

  public handleParentClick(data) {
    let selected = data.selected;
    let offset = Math.ceil(selected * 8);
    let newData = [...this.state.featuredData].splice(offset, 8);
    this.setState({ filteredFeaturedData: newData });
  }


  public showFeaturedData(data) {
    // debugger;
    this.setState({ popupData: data });
    this.handleModal(true);
  }
  public handleModal(type) {
    // debugger;

    this.setState({ isModalOpen: type });
  }

  public async searchData(event, text) {
    if (text.trim() !== "") {

      let filterQuery = "( (substringof('" + text + "',Title)) or (substringof('" + text + "',ChapterName)) or (substringof('" + text + "',Presentation)) )";
      let relevantResults = await sp.web.lists
        .getByTitle("All Documents")
        .items.select(
          "Title,IsParent,ChapterNumber,Featured,Topic/Title,Presentation,FileLeafRef,FileRef,ImageUrl"
        )
        .expand("Topic")
        .filter(filterQuery)
        .get();
      // let newData = [...this.state.parentData].filter((item) => {
      //   return relevantResults.toString().indexOf(item.PPTLink.Url.split('?')[0].replace(/%20/g, ' ')) != -1
      // });
      let featuredRelevantResults = [];
      relevantResults.map((result) => {
        if (result.Featured == true) {
          featuredRelevantResults.push(result);
        }
      });
      this.setState({ searchResults: relevantResults, filteredParentData: relevantResults, featuredData: featuredRelevantResults });
    } else {
      let relevantResults = await sp.web.lists
        .getByTitle("All Documents")
        .items.select(
          "Title,IsParent,ChapterNumber,Featured,Topic/Title,Presentation,FileLeafRef,FileRef,ImageUrl"
        )
        .expand("Topic")
        .get();
      let featuredRelevantResults = [];
      relevantResults.map((result) => {
        if (result.Featured == true) {
          featuredRelevantResults.push(result);
        }
      });
      this.setState({
        filteredParentData: [...this.state.parentData].splice(0, 8), featuredData: [...featuredRelevantResults].splice(0, 8)
      });
    }
  }
  public pageReload() {
    location.reload();
  }
  public render(): React.ReactElement<IChartPackHomePageProps> {
    return (
      <div className={styles.chartPackHomePage}>

        <div style={{ marginLeft: "10px" }}>
          <div className={styles.filterWrap}>
            <span>
              <a
                style={{
                  fontSize: "30px",
                  marginBottom: "50px",
                  color: "#2b88d2",
                }}
              >
                Chart Pack Library
              </a>
            </span>
            <TextField
              placeholder="Search by Slide Title"
              onChange={this.searchData.bind(this)}

            />
            <PrimaryButton styles={{ root: { width: 100, backgroundColor: "#2b88d2" } }} text="Clear" onClick={this.pageReload.bind(this)}></PrimaryButton>
          </div>
          <div style={{ color: "rgb(50, 49, 48", fontSize: "18px" }}>
            PhRMA makes its industry chart packs available for members to download
            and use in their own communication and advocacy efforts. This tool
            allows you to easily search, browse by topic, review featured slides,
            and download PowerPoint slides with full images and chart data,
            formatted for use in your own slide decks.
          </div>
          <div className={styles.chartPackParent}>
            <h2 style={{ color: "#2b88d2", fontWeight: 400 }}>Chart Packs</h2>
            <div className={styles.chartPackParentWrap}>
              {
                // chart packs
                this.state.filteredParentData.map((items) => {
                  return (
                    // <Card style={{ maxWidth: '345' }}>
                    //   <CardActionArea>
                    //     <CardMedia
                    //       component="img"
                    //       height="270"
                    //       image={items.ImageUrl.Url}
                    //       alt="Chartpack slide">
                    //       <CardContent>
                    //         <Typography gutterBottom component="div">
                    //           {items.Title}
                    //         </Typography>
                    //         <Typography variant="body2" >
                    //           {items.Released}
                    //         </Typography>
                    //       </CardContent>
                    //     </CardMedia>
                    //   </CardActionArea>
                    // </Card>
                    <div
                      className={styles.singleParentCard}
                      onClick={() => {
                         window.open(
                            `${this.props.siteURL}/SitePages/ChapteredChartPacks.aspx?title=${items.Title}`
                          );
                      }
                      }
                    >
                      <div
                        // style={{width: 289,height: 192, overflow: 'hidden'}}
                        className={styles.cardImage}
                        style={{
                          backgroundImage: `url('${items.ImageUrl.Url}')`,
                        }}
                      >
                      </div>
                      <div className={styles.cardContent}>
                        <h4>{items.Title}</h4>
                        {/* <p className={styles.cardDescription}>{items.PublishedDate}</p> */}
                        <p className={styles.cardTime} style={{ fontSize: "14px" }}>{items.Released}</p>
                      </div>
                    </div>
                  );
                })
              }
            </div>

          </div>
          <div className={styles.topic}>
            <h2 style={{ color: "#2b88d2", fontWeight: 400 }}>Slides By Topic</h2>
            <div className={styles.topicWrap}>
              {
                // topics
                this.state.topicData.map((items) => {
                  return (
                    <div className={styles.topicSingle}>
                      <h4 className={styles.topicTitle}>
                        <a
                          style={{
                            textDecoration: "none",
                            color: "#d55e27",
                            fontWeight: 500,
                          }}
                          href={`${this.props.siteURL}/SitePages/Topics.aspx?title=${items.Topics}`}
                        >
                          {items.Topics}
                        </a>{" "}
                      </h4>
                      {/* <h4 className={styles.topicTitle}>{items.Topics} </h4> */}
                      <p className={styles.topicDescription}>
                        {items.Description}{" "}
                      </p>
                    </div>
                  );
                })
              }
            </div>
          </div>
          <div className={styles.chartPackParent}>
            <h2 style={{ color: "rgb(43, 136, 210)", fontWeight: 400 }}>
              Featured Slides
            </h2>
            <div className={styles.chartPackParentWrap}>
              {
                // featured
                this.state.filteredFeaturedData.map((items) => {
                  return (
                    <div
                      className={styles.singleParentCard}
                      onClick={this.showFeaturedData.bind(this, items)}
                    >
                      <div
                        className={styles.cardImage}
                        style={{
                          backgroundImage: `url('${items.ImageUrl.Url}')`,
                        }}
                      ></div>
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
              pageCount={Math.ceil(this.state.featuredData.length / 8)}
              // mainPageDisplayed={2}
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
              <div
                className={styles.popupImage}
                style={{
                  backgroundImage: `url('${this.state.popupData.ImageUrl &&
                    this.state.popupData.ImageUrl.Url
                    }')`,
                }}
              ></div>
              <div className={styles.popupdownload}>
                <h3>Download as</h3>
                <h3>
                  <a
                    href={
                      "https://phrma.sharepoint.com/sites/Connect-ChartPack/_layouts/download.aspx?SourceUrl=" +
                      "https://phrma.sharepoint.com" +
                      this.state.popupData.FileRef
                    }
                  >
                    PPT
                  </a>
                </h3>
                <PrimaryButton
                  text="Close Window"
                  style={{ backgroundColor: "#0078D4", borderColor: "#0078D4" }}
                  onClick={this.handleModal.bind(this, false)}
                  allowDisabledFocus
                />
              </div>
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}