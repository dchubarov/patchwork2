import React, {useEffect} from "react";
import {useParams} from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import {useActiveView} from "@/hooks";
import Checklist from "../components/Checklist";
import AvailableChecklistsWidget from "../components/AvailableChecklistsWidget";

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
