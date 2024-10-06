import React, {useEffect} from "react";
import PageLayout from "../../../components/PageLayout";
import {useActiveView} from "../../../lib/useActiveView";
import TodoList from "../components/TodoList";

const TodoPage: React.FC = () => {
    const {configureView, ejectView} = useActiveView();

    useEffect(() => {
        configureView({title: "Todo List"});
        return () => {
            ejectView();
        }
    }, [configureView, ejectView]);

    return (
        <PageLayout.Content>
            <TodoList/>
        </PageLayout.Content>
    );
}

export default TodoPage;
