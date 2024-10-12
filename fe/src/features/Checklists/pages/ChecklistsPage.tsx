import React, {useEffect} from "react";
import PageLayout from "../../../components/PageLayout";
import Checklist from "../components/Checklist";
import {useActiveView} from "../../../providers/ActiveViewProvider";

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
