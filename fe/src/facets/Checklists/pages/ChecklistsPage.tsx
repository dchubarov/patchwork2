import React from "react";
import PageLayout from "@/components/PageLayout";
import {useSearchParams} from "react-router-dom";
import Checklist from "../components/Checklist";
import ChecklistProvider from "@/facets/Checklists/providers/ChecklistProvider";

const ChecklistsPage: React.FC = () => {
    const [searchParams] = useSearchParams();

    return (
        <PageLayout.Content noTitle>
            <ChecklistProvider checklistId={searchParams.get("id")}>
                <Checklist showIds/>
            </ChecklistProvider>
        </PageLayout.Content>
    );
}

export default ChecklistsPage;
