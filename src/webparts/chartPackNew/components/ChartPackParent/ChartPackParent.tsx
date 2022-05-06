import * as React from "react";
import styles from './ChartPackParent.module.scss';
import { Icon, Dropdown, IDropdownOption } from "office-ui-fabric-react/lib";
import { IChartPackParentProps } from "./IChartPackParentProps";
import { escape } from "@microsoft/sp-lodash-subset";
import { IChartPackParentState } from "./IChartPackParentState";
import { sp } from "@pnp/sp/presets/all";
//import $ from 'jquery';
import {
    getTheme,
    mergeStyleSets,
    FontWeights,
    Modal,
    TextField,
    PrimaryButton,
    
} from "office-ui-fabric-react";
import "../style.css";
//import LeftNav from "../../chartPackUpdt/components/LeftNav";
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
            justifyContent: "center",
            fontWeight: FontWeights.semibold,
            padding: 0,
            fontSize: "18px",
        },
    ],
    body: {
        flex: "4 4 auto",
        padding: "0",
        overflowY: "hidden",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        width: "50vw",
        selectors: {
            p: { margin: "14px 0" },
            "p:first-child": { marginTop: 0 },
            "p:last-child": { marginBottom: 0 },
        },
    },

});

export default class ChartPackParent extends React.Component<IChartPackParentProps, IChartPackParentState> {
    constructor(props: IChartPackParentProps, state: IChartPackParentState) {
        super(props);
        sp.setup({
            sp: { baseUrl: this.props.siteURL },
        });

        this.state = {
            parentData: [],
            chapterNameData: [],
            selectedChapterName: { key: "", text: "Select" },
            allData: [],
            chartPackName: "",
            chartParkPDFLink: "",
            chartPackPPTLink: "",
            isModalOpen: false,
            popupData: {}
        };

        setInterval(() => {
            try {
                document.getElementById('loader').remove();
            } catch (e) {

            }

        }, 3000);
    }

    public async componentDidMount() {
        sp.setup({
            sp: { baseUrl: this.props.siteURL }
        });

        let parentDataLocal = [];
        let chapterName = [];
        let chapterData = [];
        let reacctHandler = this;
        let uniqueChapterName = [];
        let chapterNameDD = [];
        let pdfLink = "";
        let pptLink = "";

        //get Title from URl
        const searchparms = new URLSearchParams(location.search);
        const title = searchparms.get("title" || "");
        //get data from list
        await sp.web.lists
            .getByTitle("Packs")
            .items.select("PDFLink,PPTLink")
            .filter("Title eq '" + title + "'")
            .get()
            .then((res) => {
                for (let i = 0; i < res.length; i++) {
                    pdfLink = res[i].PDFLink.Url;
                    pptLink = res[i].PPTLink.Url;
                }
            });
        //get data from Library
        await sp.web.lists
            .getByTitle("All Documents")
            .items.select(
                "Title,IsParent,ChapterNumber,Featured,Topic/Title,Presentation,FileLeafRef,FileRef,ChapterName,ImageUrl"
            )
            .expand("Topic").top(800)
            .filter("Presentation eq '" + title + "'")
            .orderBy("ChapterNumber", true)
            .get()
            .then((res) => {
                parentDataLocal = res;
            });
        chapterName = parentDataLocal.map((item) => {
            return item.ChapterName;
        });
        uniqueChapterName = this.removeDuplicates(chapterName);
        uniqueChapterName.map((response) => {
            let temparray = [];
            for (let i = 0; i < parentDataLocal.length; i++) {
                if (parentDataLocal[i].ChapterName == response)
                    temparray.push({
                        Title: parentDataLocal[i].Title,
                        chapterNumber: parentDataLocal[i].ChapterNumber,
                        Link:
                            "https://phrma.sharepoint.com/sites/Connect-ChartPack/_layouts/download.aspx?SourceUrl=" + reacctHandler.props.siteURL +
                            "/Shared Documents/" +
                            parentDataLocal[i].FileLeafRef,
                        imageLink: parentDataLocal[i].ImageUrl.Url,
                    });
            }
            chapterData.push({ Header: response, Data: temparray });
        });
        chapterNameDD = uniqueChapterName.map((item) => {
            return { key: item, text: item };
        });
        this.setState({
            parentData: chapterData,
            chapterNameData: chapterNameDD,
            allData: chapterData,
            chartPackName: title,
            chartParkPDFLink: pdfLink,
            chartPackPPTLink: pptLink,

        });
    }

    public removeDuplicates(array) {
        return array.filter((a, b) => array.indexOf(a) === b);
    }
    public showFeaturedData(data) {
        this.setState({ popupData: data });
        this.handleModal(true);
    }
    public handleModal(type) {
        this.setState({ isModalOpen: type });
    }
    public onChange = (
        event: React.FormEvent<HTMLDivElement>,
        item: IDropdownOption
    ): void => {
        let filteredData = [];
        filteredData = this.state.allData.filter(
            (response) => response.Header == item.key
        );
        this.setState({ parentData: filteredData, selectedChapterName: item });
    }
    public contains(arr, key, val) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i][key] === val) return true;
        }
        return false;
    }

    public async searchData(event, text) {
        let chapterName = [];
        let chapterData = [];
        let uniqueChapterName = [];
        let chapterNameDD = [];
        if (text.trim() !== '') {
            //let filterQuery = "( (Title eq '" + text + "') or (ChapterName eq '" + text + "') or (Presentation eq '" + text + "') )"
            let filterQuery = "( (substringof('" + text + "',Title)) or (substringof('" + text + "',ChapterName)) or (substringof('" + text + "',Presentation)) )";
            let parentDataLocal = await sp.web.lists.getByTitle("ALL Documents").items
                .select("Title,IsParent,ChapterNumber,Featured,Topic/Title,Presentation,FileLeafRef,FileRef,ChapterName,ImageUrl")
                .expand('Topic')
                .filter(filterQuery)
                .orderBy("ChapterNumber", true)
                .get();

            let filteredData = [];
            const searchparms = new URLSearchParams(location.search);
            const title = searchparms.get('title' || '');
            parentDataLocal.map((data) => {
                if (data.Presentation == title) {
                    filteredData.push(data);
                }
            });

            chapterName = filteredData.map(item => { return item.ChapterName; });
            uniqueChapterName = this.removeDuplicates(chapterName);
            uniqueChapterName.map(response => {
                let temparray = [];
                for (let i = 0; i < filteredData.length; i++) {
                    if (filteredData[i].ChapterName == response)
                        temparray.push({ chapterName: filteredData[i].ChapterName, chapterNumber: filteredData[i].ChapterNumber, Link: "https://phrma.sharepoint.com/sites/Connect-ChartPack/_layouts/download.aspx?SourceUrl=" + this.props.siteURL + "/Shared Documents/" + filteredData[i].FileLeafRef, imageLink: filteredData[i].ImageUrl.Url });
                }
                chapterData.push({ Header: response, Data: temparray });
            });
            chapterNameDD = uniqueChapterName.map(item => { return { key: item, text: item }; });
            this.setState({ parentData: chapterData, chapterNameData: chapterNameDD });
        } else {
            this.setState({ parentData: this.state.allData });
        }
    }

    public render(): React.ReactElement<IChartPackParentProps> {
        return (
            <div className={styles.chartPackParent}>
                {/* <div id="loader" style={{ position: 'fixed', top: 0, left: 0, backgroundColor: 'white', width: '100vw', height: '100vh', zIndex: 100 }}>
                    <Spinner style={{ top: '30%', position: 'relative' }} size={SpinnerSize.large} label="Loading" />
                </div> */}
                {/* <LeftNav/> */}
                <div style={{ marginLeft: "10px" }}>
                    <span>
                        <a
                            style={{
                                textDecoration: "none",
                                fontSize: "18px",
                                marginBottom: "10px",
                                color: "rgb(43, 136, 210)",
                            }}
                            href="https://phrma.sharepoint.com/sites/Connect-ChartPack"
                        >
                            Go Back To Chart Packs
                        </a>
                    </span>
                    <div
                        style={{
                            fontSize: "24px",
                            marginBottom: "5px",
                            color: "rgb(50, 49, 48",
                            marginTop: "23px",
                            fontWeight: 500,
                        }}
                    >
                        {this.state.chartPackName}
                    </div>
                    <ul>
                        <li>
                            <a style={{ textDecoration: "none", cursor: "pointer", color: "rgb(43, 136, 210)" }} href={(this.state.chartPackPPTLink)} download>Download Entire Pack in PowerPoint</a>
                        </li>
                        <li>
                            <a style={{ textDecoration: "none", cursor: "pointer", color: "rgb(43, 136, 210)" }} href={(this.state.chartParkPDFLink)} download>Download Entire Pack in PDF</a>
                        </li>
                    </ul>
                    <div className={styles.filterWrap}>
                        <div>
                            <TextField label="Search" placeholder="Search" onChange={this.searchData.bind(this)} />
                        </div>
                        <Dropdown
                            label="Chart Packs by Chapter"
                            selectedKey={
                                this.state.selectedChapterName
                                    ? this.state.selectedChapterName.key
                                    : undefined
                            }
                            onChange={this.onChange}
                            placeholder="Select Chapter Name"
                            options={this.state.chapterNameData}
                        />
                    </div>
                    {this.state.parentData.map((items) => {
                        return (
                            <div className={styles.chartPackParent}>
                                <h3 style={{ color: "#d55e27", fontWeight: 500 }}>
                                    {items.Header}
                                </h3>
                                <div className={styles.chartPackParentWrap}>
                                    {items.Data.map((item) => {
                                        return (
                                            <div
                                                className={styles.singleParentCard}
                                                onClick={this.showFeaturedData.bind(this, item)}
                                            >
                                                <div
                                                    className={styles.cardImage}
                                                    style={{ backgroundImage: `url('${item.imageLink}')` }}
                                                ></div>
                                                <div className={styles.cardContent}>
                                                    <h4 style={{ color: "rgb(50, 49, 48" }}>
                                                        {item.Title}
                                                    </h4>
                                                    {/* <p className={styles.cardDescription}>Description</p>
                      <p className={styles.cardTime}>08-02-2021</p> */}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
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
                            <img
                                className={styles.popupImage}
                                src={this.state.popupData.imageLink &&
                                        this.state.popupData.imageLink        
                                }
                            ></img>
                            <div className={styles.popupdownload}>
                                <h3>
                                    <a href={this.state.popupData.Link}>
                                        Download PPT
                                    </a>
                                </h3>

                                <PrimaryButton
                                    className={styles.CloseWindow}
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