import * as dojoDeclare from "dojo/_base/declare";
import * as WidgetBase from "mxui/widget/_WidgetBase";
import { createElement } from "react";
import { render, unmountComponentAtNode } from "react-dom";

import { PortletWrapper as PortletWrapperComponent, PortletWrapperProps } from "./components/PortletWrapper";


class PortletWrapper extends WidgetBase {

    // Parameters configured from modeler
    private objectType: string;
    private password: string;
    private username: string;
    private serverURL: string;
    private height: number;
    private width: number;
    private validationMessage: string;

    // Internal variables
    private contextObject: mendix.lib.MxObject;

    postCreate() {
        this.updateRendering();
    }

    update(object: mendix.lib.MxObject, callback: Function) {
        this.contextObject = object;
        this.resetSubscriptions();
        this.updateRendering();

        callback();
    }

    uninitialize(): boolean {
        unmountComponentAtNode(this.domNode);

        return true;
    }

    private updateRendering() {
        render(createElement(PortletWrapperComponent, this.getPortletWrapperProps()), this.domNode);
    }

    private getPortletWrapperProps(): PortletWrapperProps {
        const serverURL = this.contextObject && this.serverURL
            ? (this.contextObject.get(this.serverURL))as string
            : "";
        const username = this.contextObject && this.username
            ? (this.contextObject.get(this.username))as string
            : "";
        const password = this.contextObject && this.password
            ? (this.contextObject.get(this.password))as string
            : "";

        this.login(username, password, serverURL);

        return {
            height: this.height,
            width: this.width,
            serverURL,
            validationMessage: this.validationMessage
        };
    }


    // This function should login nd return the url to the be passed onto the iframe
    private login(username: string, password: string, serverURL: string) {
        const sessionID = this.loginAction(username, password, serverURL);
        if (sessionID) {
            console.log("Worked up to this point");
            /*
            currentLoggedInUser = txtUserName.value;
            currentUserServerURL = txtServerURL.value;
            if (dashboardName.value.replace(/(^\s*)|(\s*$)/g, "") != '') {
                if (objecttype.value == "DO") {
                    url = props.serverURL + "/dashboard/doreader.htm?sessionID=" + sessionID + "&refreshinterval=" + 10 + "&do=" + encodeURIComponent(dashboardName.value.replace(/\"/g, '""'));
                } else {
                    url = props.serverURL + "/dashboard/doreader.htm?sessionID=" + sessionID + "&reportrefreshinterval=" + 10 + "&do=" + encodeURIComponent(dashboardName.value.replace(/\"/g, '""')) + "&type=" + objecttype.value;
                }
            }
            */
        }
    }

    private loginAction(strUser: string, strPassword: string, strServerURL: string): string {
        const xmlString = "<login><user>" + strUser + "</user><password>" + strPassword + "</password></login>";
        console.log(xmlString);
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, "text/xml");

        const sURL = strServerURL + "/Controller/UserAction/Login";

        const xmlhttp = new XMLHttpRequest();

        try {
            xmlhttp.open("POST", sURL, true);
            xmlhttp.send(xmlString);
        } catch (e) {
            alert("Error while sending xml. Check the url and try again");
            this.validationMessage = "Error while sending xml. Check the url and try again";
            return null;
        }
        let sessionID = "";
        xmlhttp.onreadystatechange = () => {
            if (xmlhttp.readyState === XMLHttpRequest.DONE) {
                console.log("XML Response is: " + xmlhttp.responseText);
                if (xmlhttp.responseText.match("structuredException")) {
                    alert("Error logging in. Please check your user name and password.");
                    this.validationMessage = "Error logging in. Please check your user name and password.";
                } else {
                    //return xmlhttp.responseXML.selectSingleNode("/loginResp").getAttribute("sessionid");
                    //sessionID = xmlhttp.responseXML.selectSingleNode("/loginResp").getAttribute("sessionid");
                }
            }
        }
        return sessionID;
    }

    private resetSubscriptions() {
        this.unsubscribeAll();
        if (this.contextObject) {
            this.subscribe({
                callback: (guid) => this.updateRendering(),
                guid: this.contextObject.getGuid()
            });
            this.subscribe({
                attr: this.serverURL,
                callback: (guid, attr, attrValue) => this.updateRendering(),
                guid: this.contextObject.getGuid()
            });
            this.subscribe({
                attr: this.username,
                callback: (guid, attr, attrValue) => this.updateRendering(),
                guid: this.contextObject.getGuid()
            });
            this.subscribe({
                attr: this.password,
                callback: (guid, attr, attrValue) => this.updateRendering(),
                guid: this.contextObject.getGuid()
            });
        }
    }

}

// Declare widget prototype the Dojo way
// Thanks to https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/dojo/README.md
// tslint:disable : only-arrow-functions
let dojoPortletWrapper = dojoDeclare(
    "PortletWrapper.widget.PortletWrapper",
    [ WidgetBase ],
    (function (Source: any) {
        let result: any = {};
        for (let i in Source.prototype) {
            if (i !== "constructor" && Source.prototype.hasOwnProperty(i)) {
                result[i] = Source.prototype[i];
            }
        }
        return result;
    } (PortletWrapper)));
