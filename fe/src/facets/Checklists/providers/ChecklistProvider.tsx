import React, {PropsWithChildren, useEffect, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {useApiClient} from "@/hooks";
import {ChecklistContext, ChecklistState} from "../types/context";
import * as checklistApi from "../api";

interface ChecklistProviderProps {
    checklistId: string | number | null;
}

const ChecklistProvider: React.FC<PropsWithChildren<ChecklistProviderProps>> = ({checklistId, children}) => {
    const apiClient = useApiClient();
    const [state, updateState] = useState<ChecklistState>(() => ({
        data: null,
    }));

    const {data: fetchData} = useQuery({
        queryKey: ["x/checklists/checklist", {checklistId}],
        queryFn: checklistApi.fetchChecklistRequest(apiClient, checklistId),
    });

    useEffect(() => {
        updateState(prev => ({...prev, data: fetchData?.checklist || null}));
    }, [fetchData]);

    return (
        <ChecklistContext.Provider value={state}>
            {children}
        </ChecklistContext.Provider>
    );
}

export default ChecklistProvider;
