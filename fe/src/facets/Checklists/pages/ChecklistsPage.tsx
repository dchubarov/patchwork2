import React from "react";
import PageLayout from "@/components/PageLayout";
import {useParams} from "react-router-dom";
import Checklist from "../components/Checklist";
import ChecklistProvider from "../providers/ChecklistProvider";

const ChecklistsPage: React.FC = () => {
    const {checklistId} = useParams();

    return (
        <PageLayout.Content noTitle>
            <ChecklistProvider checklistId={checklistId}>
                <Checklist showIds/>
            </ChecklistProvider>
        </PageLayout.Content>
    );
}

export default ChecklistsPage;
