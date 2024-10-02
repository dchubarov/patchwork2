import {initialViewState, ViewConfiguration, ViewState, Widget, WidgetsConfiguration} from "./viewStateTypes";

export enum ViewStateActionType {
    CONFIGURE_VIEW,
    CONFIGURE_WIDGETS,
    EJECT_VIEW
}

export type ViewStateAction =
    | { type: ViewStateActionType.CONFIGURE_VIEW, config: ViewConfiguration }
    | { type: ViewStateActionType.CONFIGURE_WIDGETS, config: WidgetsConfiguration }
    | { type: ViewStateActionType.EJECT_VIEW };

export function viewStateReducer(state: ViewState, action: ViewStateAction): ViewState {
    switch (action.type) {
        case ViewStateActionType.CONFIGURE_VIEW:
            return {
                ...state,
                ...action.config
            };

        case ViewStateActionType.CONFIGURE_WIDGETS:
            return {
                ...state,
                widgets: mergeWidgetConfigurations(state.widgets, action.config)
            };

        case ViewStateActionType.EJECT_VIEW:
            return initialViewState;
    }
}

function mergeWidgetConfigurations(widgets: Widget[], config: WidgetsConfiguration): Widget[] {
    let normalizedConfigs = Array.isArray(config)
        ? config.reverse().filter(
            (value, index, array) =>
                Object.keys(value).length > 0 &&
                index === array.findIndex((item) => item.slot === value.slot)
        )
        : [config];

    if (normalizedConfigs.length === 0)
        return widgets;
    else {
        const updated = [
            ...widgets
                .filter((item) => normalizedConfigs.findIndex((value) =>
                    value.slot === item.slot) === -1
                ),
            ...normalizedConfigs
                .filter((config) => config.component !== undefined)
                .map((config): Widget => ({
                    key: config.key || `widget-${config.slot || 0}`,
                    caption: config.caption || "",
                    slot: config.slot || 0,
                    component: config.component
                }))
        ];

        return updated.sort((a: Widget, b: Widget) => a.slot - b.slot);
    }
}
