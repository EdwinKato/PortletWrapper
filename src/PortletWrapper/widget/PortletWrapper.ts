import * as dojoDeclare from "dojo/_base/declare";
import * as WidgetBase from "mxui/widget/_WidgetBase";
import { createElement } from "react";
import { render, unmountComponentAtNode } from "react-dom";

import { PortletWrapper as PortletWrapperComponent, PortletWrapperProps  } from "./components/PortletWrapper";


class PortletWrapper extends WidgetBase {

    // Parameters configured from modeler
    private objectType: string;
    private password: string;
    private username: string;
    private serverURL: string;
    private height: number;
    private width: number;

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

        return {
            height: this.height,
            width: this.width,
            serverURL,
            username,
            password
        };
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
