import {useContext} from "react";
import {ActiveViewContext} from "../providers/ActiveViewProvider";
import {ViewState} from "./viewStateTypes";

export function useActiveView(): ViewState {
    const context = useContext(ActiveViewContext);
    if (!context) {
        throw new Error("useActiveView hook must be used within ActiveViewProvider.");
    }
    return context;
}
