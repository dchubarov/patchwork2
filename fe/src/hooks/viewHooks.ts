import {ViewState} from "../types/viewTypes";
import {useContext} from "react";
import {ActiveViewContext} from "../types/viewTypes";

export function useActiveView(): ViewState {
    const context = useContext(ActiveViewContext);
    if (!context) {
        throw new Error("useActiveView hook must be used within ActiveViewProvider.");
    }
    return context;
}
