import {useContext} from "react";
import {ChecklistContext} from "@/facets/Checklists/types/context";

export const useChecklist = () => {
    const ctx = useContext(ChecklistContext);
    if (!ctx) {
        throw new Error("Checklist data is not available.")
    }
    return ctx;
}

export default useChecklist;
