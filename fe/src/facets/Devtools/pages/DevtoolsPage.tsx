import React, {useEffect} from "react";
import PageLayout from "@/components/PageLayout";
import ViewContextPlayground from "../components/ViewContextPlayground";
import {useActiveView} from "@/hooks";
import UIComponentPlayground from "../components/UIComponentPlayground";

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

            <UIComponentPlayground
                tabKey="ui-component-apiPlayground"
                tabCaption="UI Components"/>
        </PageLayout.Indexed>
    );
}

export default DevtoolsPage;
