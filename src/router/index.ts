import {createBrowserRouter} from "react-router";
import {Start} from "../features/Start/Start.tsx";
import {CardCreator} from "../features/CardCreator/CardCreator.tsx";
import {App} from "../features/App/App.tsx";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: App,
        children: [
            { index: true, Component: Start },
            { path: "/creator", Component: CardCreator }
        ]
    },
]);