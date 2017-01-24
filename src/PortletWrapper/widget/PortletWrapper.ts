import * as dojoDeclare from "dojo/_base/declare";
import * as WidgetBase from "mxui/widget/_WidgetBase";
import { createElement } from "react";
import { render } from "react-dom";

import { PortletWrapper as PortletWrapperComponent  } from "./components/PortletWrapper";


class PortletWrapper extends WidgetBase {

    private contextObject: mendix.lib.MxObject;
    private handles: any[];
    private value: number;

    postCreate() {
        this.handles = [];
        this.updateRendering();
    }

    update(object: mendix.lib.MxObject, callback?: Function) {
        this.contextObject = object;
        this.updateRendering(callback);
        this._resetSubscriptions();
    }

    private updateRendering(callback?: Function) {
        // render your component here
    }
    private _unsubscribe() {
        if (this.handles) {
            for (let handle of this.handles) {
                mx.data.unsubscribe(handle);
            }
            this.handles = [];
        }
    }
    private _resetSubscriptions() {
        this._unsubscribe();
        if (this.contextObject) {
            // Subscriptions
        }
    }
}

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
