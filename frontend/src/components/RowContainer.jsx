import React, { useEffect, useRef, useState } from "react";
import { MdShoppingBasket } from "react-icons/md";
import { motion } from "framer-motion";
import NotFound from "../img/NotFound.svg";
import { useStateValue } from "../context/StateProvider";
import { actionType } from "../context/reducer";

const RowContainer = ({ flag, scrollValue, data }) => {
    const rowContainer = useRef();
    const [{ cartItems }, dispatch] = useStateValue();

    const cartDispatch = (cartItems) => {
        dispatch({
            type: actionType.SET_CARTITEMS,
            cartItems,
        });
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    };

    const addtocart = (item) => {
        const isFound = cartItems.find((n) => n.id === item.id);

        if (!isFound) {
            // Tweak to Fix the BUG
            item.qty = 1;
            cartDispatch([item, ...cartItems]);
        } else {
            const newCartIems = cartItems.map((n) => {
                if (n.id === item.id) {
                    n.qty += 1;
                }
                return n;
            });
            cartDispatch([...newCartIems]);
        }
    };

    useEffect(() => {
        rowContainer.current.scrollLeft += scrollValue;
    }, [scrollValue]);

    return (
        <div
            ref={rowContainer}
            className={`w-full flex items-center gap-3 my-12 scroll-smooth ${
                flag
                    ? "overflow-scroll scrollbar-none"
                    : "overflow-hidden flex-wrap justify-center"
            }`}
        >
            {data && data.length > 0 ? (
                data.map((item) => (
                    <div
                        key={item.id}
                        className="w-300 h-[220px] min-w-[300px] md:w-340 min-w-[340px] h-auto bg-cardOverlay rounded-lg p-2 my-12 backdrop-blur-lg hover:drop-shadow-lg flex flex-col item-center justify-between"
                    >
                        <div className="w-full flex items-center justify-between">
                            <motion.div
                                className="w-40 h-40 -mt-8 drop-shadow-2xl"
                                whileHover={{ scale: 1.2 }}
                            >
                                <img
                                    src={item?.imageURL}
                                    alt="fruit"
                                    className="w-full h-full object-contain"
                                />
                            </motion.div>

                            <motion.div
                                whileTap={{ scale: 0.75 }}
                                className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center cursor-pointer hover:shadow-lg"
                                onClick={() => addtocart(item)}
                            >
                                <MdShoppingBasket className="text-white" />
                            </motion.div>
                        </div>

                        <div className="w-full flex flex-col items-end justify-end">
                            <p className="text-textColor font-semibold text-base md:text-lg">
                                {item?.title}
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                                {item?.calories} Calory
                            </p>
                            <div className="flex items-center gap-8">
                                <p className="text-lg text-headingColor font-semibold">
                                    <span className="text-sm text-red-500">
                                        ₹
                                    </span>{" "}
                                    {item?.price}
                                </p>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="w-full flex flex-col items-center justify-center">
                    <img src={NotFound} alt="notfound" className="h-340" />
                    <p className="text-xl text-headingColor font-semibold my-5">
                        Items Not Available
                    </p>
                </div>
            )}
        </div>
    );
};

export default RowContainer;
