import * as MicrosoftGroup from "@microsoft/microsoft-graph-types";

export interface IChartPackHomePageState {
    featuredData:Array<any>;
    parentData:Array<any>;
    topicData:Array<any>;
    filteredParentData: Array<any>;
    // SearchedParentData: Array<any>;
    isModalOpen: boolean;    
    popupData: any;
    searchResults: any;
    exitSearch: any;
    filteredFeaturedData: any;
}