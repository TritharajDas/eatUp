import React, { useEffect, useCallback } from "react";
import { Route, Routes } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { CreateContainer, Header, MainContainer } from "./components";
import { useStateValue } from "./context/StateProvider";
import { getAllFoodItems } from "./utils/firebaseFunctions";
import { actionType } from "./context/reducer";

const App = () => {
    const [, dispatch] = useStateValue();

    const fetchData = useCallback(async () => {
        await getAllFoodItems().then((data) => {
            dispatch({
                type: actionType.SET_FOOD_ITEMS,
                foodItems: data,
            });
        });
    }, [dispatch]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <AnimatePresence exitBeforeEnter>
            <div className="w-screen h-auto flex flex-col bg-primary">
                <Header />

                <main className="mt-14 px-4 md:mt-20 md:px-16 py-4 w-full">
                    <Routes>
                        <Route path="/*" element={<MainContainer />} />
                        <Route
                            path="/createItem"
                            element={<CreateContainer />}
                        />
                    </Routes>
                </main>
            </div>
        </AnimatePresence>
    );
};

export default App;