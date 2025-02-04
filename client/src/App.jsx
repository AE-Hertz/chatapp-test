import { useEffect, useState } from "react";
import {
    BrowserRouter,
    Route,
    Routes,
    Navigate,
    Router,
} from "react-router-dom";
import Chat from "@/components/chat";
import Login from "@/components/login";
import ImageWidget from "./components/pollinations/ImageWidget";



function App() {

    const [user, setUser] = useState(null);
    const [secret, setSecret] = useState(null);
    const isAuth = Boolean(user) && Boolean(secret);

    return (
        <>
            <div className="app">
                <BrowserRouter>
                    <Routes>
                        <Route
                            path="/"
                            element={
                                isAuth ? (
                                    <Navigate to="/chat" />
                                ) : (
                                    <Login setUser={setUser} setSecret={setSecret} />
                                )
                            }
                        />
                        <Route
                            path="/chat"
                            element={
                                isAuth ? (
                                    <Chat user={user} secret={secret} />
                                ) : (
                                    <Navigate to="/" />
                                )
                            }
                        />
                    </Routes>
                </BrowserRouter>
                <ImageWidget />
            </div>
        </>
    );
}

export default App;
