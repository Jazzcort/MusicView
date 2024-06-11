import React from "react";
import logo from "./logo.svg";
import "./App.css";
import MusicView from "./MusicView";
import {
    useQuery,
    useMutation,
    useQueryClient,
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";

const querryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={querryClient}>
            <div className="App h-100">
                <MusicView />
            </div>
        </QueryClientProvider>
    );
}

export default App;
