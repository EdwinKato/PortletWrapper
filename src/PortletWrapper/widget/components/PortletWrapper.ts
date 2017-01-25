import { DOM } from "react";


export interface PortletWrapperProps {
    height: number;
    width: number;
    serverURL: string;
    username: string;
    password: string;
}

export const PortletWrapper = (props: PortletWrapperProps) =>
    DOM.iframe(
        {
            src: props.serverURL,
            style: {
                height: props.height,
                width: props.width
            }
        }
    );
