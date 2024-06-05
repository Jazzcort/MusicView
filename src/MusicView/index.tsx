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
export default function MusicView() {
    return (
        <BrowserRouter>
            <Provider store={store}>
                <div id="mv-entry" className="h-100 m-1">
                    <Routes>
                        <Route path="/" element={<Navigate to={"Home"} />} />
                        <Route path="/Home" element={<Home />} />
                        <Route path="/Login" element={<Login />} />
                        <Route path="/Profile" element={<Profile />} />
                        <Route path="/Search" element={<Search />} />
                        <Route path="/Album" element={<Album />} />
                        <Route path="/Artist/:artistId/*" element={<Artist />} />
                        <Route path="/Error" element={<Error />} />
                    </Routes>
                </div>
            </Provider>
        </BrowserRouter>
    );
}
