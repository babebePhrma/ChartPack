
import * as MicrosoftGroup from "@microsoft/microsoft-graph-types";
export interface ILeftNavState
{
    leftNavGroups: any;
    navLinks: any;
    userGroups: any;
    groups: MicrosoftGroup.Group[];
    navShow: string;
    navWidth: number;
    bodyWidth: string;
}