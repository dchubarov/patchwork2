import React from "react";
import {useActiveView, useApiClient} from "@/hooks";
import {useQuery} from "@tanstack/react-query";
import {ChecklistsApi} from "../api";
import {Link, List, ListItem, ListItemContent} from "@mui/joy";
import {Link as RouterLink} from "react-router-dom";
import _ from "lodash";

const AvailableChecklistsWidget: React.FC = () => {
    const apiClient = useApiClient();
    const {facet} = useActiveView();
    const {isSuccess, data: checklistNames} = useQuery({
        queryKey: ["x/checklists/availableChecklists"],
        queryFn: ChecklistsApi.fetchChecklistNames(apiClient)
    });

    return (
        <List size="sm" sx={{pl: 2}}>
            {isSuccess && checklistNames.map((checklist) => (
                <ListItem key={checklist}>
                    <ListItemContent>
                        <Link component={RouterLink} typography="body-sm"
                              to={`${facet?.basePath}/${checklist}`}>{_.capitalize(checklist)}</Link>
                    </ListItemContent>
                </ListItem>
            ))}
        </List>
    );
};

export default AvailableChecklistsWidget;
