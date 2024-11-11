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
            <UIComponentPlayground
                tabKey="ui-libarary"
                tabCaption="Component Library"/>

            <ViewContextPlayground
                tabKey="view-context-playground"
                tabCaption="View Context"/>

        </PageLayout.Indexed>
    );
}

export default DevtoolsPage;
