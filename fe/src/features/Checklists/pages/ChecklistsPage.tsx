import React, {useEffect} from "react";
import PageLayout from "../../../components/PageLayout";
import {useActiveView} from "../../../lib/useActiveView";
import Checklist from "../components/Checklist";

const ChecklistsPage: React.FC = () => {
    const {configureView, ejectView} = useActiveView();

    useEffect(() => {
        configureView({title: "Checklist"});
        return () => {
            ejectView();
        }
    }, [configureView, ejectView]);

    return (
        <PageLayout.Content>
            <Checklist/>
        </PageLayout.Content>
    );
}

export default ChecklistsPage;
