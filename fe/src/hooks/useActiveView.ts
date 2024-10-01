import {useContext} from "react";
import {ActiveViewContext, ViewState} from "../providers/ActiveViewProvider";

export function useActiveView(): ViewState {
    const context = useContext(ActiveViewContext);
    if (!context) {
        throw new Error("useActiveView hook must be used within ActiveViewProvider.");
    }
    return context;
}
