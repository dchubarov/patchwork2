import {AppFeature} from "../../lib/appFeatureTypes";

const TodoFeature : AppFeature = {
    basename: "todo",
    displayName: "Todo",
    routes: () => ([{
        index: true,
        lazy: async () => {
            const {default: Component} = await import("./pages/TodoPage");
            return {Component};
        }
    }]),
}

export default TodoFeature;
