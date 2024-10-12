import React, {useEffect} from "react";
import PageLayout from "../../../components/PageLayout";
import ViewContextPlayground from "../components/ViewContextPlayground";
import {useActiveView} from "../../../lib/useActiveView";

const DevtoolsPage: React.FC = () => {
    const {ejectView} = useActiveView();

    useEffect(() => {
        return () => ejectView();
    }, [ejectView]);

    return (
        <PageLayout.Indexed>
            <ViewContextPlayground
                tabKey="view-context-playground"
                tabCaption="View context playground"/>
        </PageLayout.Indexed>
    );
}

export default DevtoolsPage;
