import { DOM } from "react";


export interface PortletWrapperProps {
    height: number;
    width: number;
    serverURL: string;
    validationMessage: string;
}

export const PortletWrapper = (props: PortletWrapperProps) =>
    DOM.div(
        { style : { fontSize: 22, color: "red" }, value: "Error place holder" },
        props.validationMessage,
        DOM.iframe(
            {
                src: props.serverURL,
                style: {
                    height: props.height,
                    width: props.width
                }
            }
        )
    );

