import React from "react";
import PageLayout from "@/components/PageLayout";
import {useSearchParams} from "react-router-dom";
import Checklist from "../components/Checklist";

const ChecklistsPage: React.FC = () => {
    const [searchParams] = useSearchParams();

    return (
        <PageLayout.Content noTitle>
            <Checklist checklistId={searchParams.get("id")} showIds/>
        </PageLayout.Content>
    );
}

export default ChecklistsPage;
