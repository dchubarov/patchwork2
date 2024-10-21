import _ from "lodash";
import React, {useEffect} from "react";
import {Link as RouterLink, useParams} from "react-router-dom";
import PageLayout from "../../../components/PageLayout";
import {useActiveView} from "../../../providers/ActiveViewProvider";
import Checklist from "../components/Checklist";
import {Link, List, ListItem, ListItemContent} from "@mui/joy";
import {useQuery} from "@tanstack/react-query";
import {ChecklistsEndpoints} from "../api";

const AvailableChecklistsWidget: React.FC = () => {
    const fetchAvailableChecklistsQuery = useQuery({
        queryKey: ["availableChecklists"],
        queryFn: ChecklistsEndpoints.fetchChecklistNames()
    });

    return (
        <List size="sm" sx={{pl: 2}}>
            {fetchAvailableChecklistsQuery.isSuccess && fetchAvailableChecklistsQuery.data.map((checklist) => (
                <ListItem key={checklist}>
                    <ListItemContent>
                        <Link component={RouterLink} typography="body-sm"
                              to={`checklists/${checklist}`}>{_.capitalize(checklist)}</Link>
                    </ListItemContent>
                </ListItem>
            ))}
        </List>
    );
};

const ChecklistsPage: React.FC = () => {
    const {configureView, configureWidgets, ejectView} = useActiveView();
    const {checklist} = useParams();

    useEffect(() => {
        configureWidgets({slot: 1, caption: "Available checklists", component: <AvailableChecklistsWidget/>});
        return () => {
            ejectView();
        }
    }, [configureView, configureWidgets, ejectView]);

    useEffect(() => {
        configureView({title: `Checklist :: ${checklist || "default"}`});
    }, [configureView, checklist]);

    return (
        <PageLayout.Content>
            <Checklist checklistName={checklist}/>
        </PageLayout.Content>
    );
}

export default ChecklistsPage;
