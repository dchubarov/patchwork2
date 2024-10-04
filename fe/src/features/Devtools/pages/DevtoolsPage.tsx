import React, {useEffect} from "react";
import PageLayout from "../../../components/PageLayout";
import ViewContextPlayground from "../components/ViewContextPlayground";
import {useActiveView} from "../../../lib/useActiveView";
import ApiPlayground from "../components/ApiPlayground";

const DevtoolsPage: React.FC = () => {
    const {ejectView} = useActiveView();

    useEffect(() => {
        return () => ejectView();
    }, [ejectView]);

    return (
        <PageLayout.Indexed>
            <ApiPlayground
                tabKey="api-playground"
                tabCaption="API playground"/>

            <ViewContextPlayground
                tabKey="view-context-playground"
                tabCaption="View context playground"/>
        </PageLayout.Indexed>
    );
}

export default DevtoolsPage;
