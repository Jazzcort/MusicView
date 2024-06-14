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
            <div className="App" style={{height: "100vh"}}>
                <MusicView />
            </div>
        </QueryClientProvider>
    );
}

export default App;
