import React from "react";
import PageLayout from "@/components/PageLayout";
import {useParams} from "react-router-dom";
import Checklist from "../components/Checklist";

const ChecklistsPage: React.FC = () => {
    const {checklistId} = useParams();
    return (
        <PageLayout.Content noTitle>
            <Checklist checklistId={checklistId} showIds/>
        </PageLayout.Content>
    );
}

export default ChecklistsPage;
