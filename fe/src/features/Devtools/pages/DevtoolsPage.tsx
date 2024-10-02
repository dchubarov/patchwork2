import React from "react";
import PageLayout from "../../../components/PageLayout";
import ViewContextPlayground from "../components/ViewContextPlayground";

const DevtoolsPage: React.FC = () => {
    return (
        <PageLayout.Indexed>
            <ViewContextPlayground/>
        </PageLayout.Indexed>
    );
}

export default DevtoolsPage;
