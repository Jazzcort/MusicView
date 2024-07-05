import { createRoot } from "react-dom/client";
import {
    createBrowserRouter,
    RouterProvider,
    Route,
    Link,
    Routes,
    BrowserRouter,
    Navigate,
    Router,
} from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Profile from "./Profile";
import Search from "./Search";
import Album from "./Album";
import store from "./store";
import { Provider } from "react-redux";
import Error from "./Error";
import Artist from "./Artist";
import Navbar from "./Navbar";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import useSession from "../hook/useSession";
import CodeBase from "./CodeBase";
export default function MusicView() {

    return (
        <BrowserRouter>
            <Provider store={store}>
                <div id="mv-entry" style={{height: "100vh"}}>
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Navigate to={"Home"} />} />
                        <Route path="/Home" element={<Home />} />
                        <Route path="/Login/*" element={<Login />} />
                        <Route path="/Profile/:userId/*" element={<Profile />} />
                        <Route path="/Search" element={<Search />} />
                        <Route path="/Album/:albumId/*" element={<Album />} />
                        <Route path="/Artist/:artistId/*" element={<Artist />} />
                        <Route path="/Error" element={<Error />} />
                        <Route path="/CodeBase" element={<CodeBase />} />
                        <Route path="*" element={<Navigate to={"Home"}/>}/>
                        
                    </Routes>
                </div>
            </Provider>
        </BrowserRouter>
    );
}
