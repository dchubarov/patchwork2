import React from "react";
import PageLayout from "@/components/PageLayout";
import {useSearchParams} from "react-router-dom";

const ChecklistsPage: React.FC = () => {
    const [searchParams] = useSearchParams();

    return (
        <PageLayout.Content>
            {searchParams.get("id")}
        </PageLayout.Content>
    );
}

export default ChecklistsPage;
