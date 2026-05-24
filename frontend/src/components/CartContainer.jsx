import React, { useEffect, useState } from "react";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { RiRefreshFill } from "react-icons/ri";
import { motion } from "framer-motion";
import { useStateValue } from "../context/StateProvider";
import { actionType } from "../context/reducer";
import EmptyCart from "../img/emptyCart.svg";
import CartItem from "./CartItem";
import { createOrder, verifyPayment } from "../utils/api";

const CartContainer = () => {
    const [{ cartShow, cartItems, user }, dispatch] = useStateValue();
    const [flag, setFlag] = useState(1);
    const [tot, setTot] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);

    const showCart = () => {
        dispatch({
            type: actionType.SET_CART_SHOW,
            cartShow: !cartShow,
        });
    };

    useEffect(() => {
        let totalPrice = cartItems.reduce(
            (accumulator, item) => accumulator + item.qty * item.price,
            0
        );
        setTot(totalPrice);
    }, [tot, flag, cartItems]);

    const clearCart = () => {
        dispatch({
            type: actionType.SET_CARTITEMS,
            cartItems: [],
        });
        localStorage.setItem("cartItems", JSON.stringify([]));
    };

    const handleCheckout = async () => {
        if (!user) return;
        setIsProcessing(true);

        try {
            const token = localStorage.getItem("token");
            const totalAmount = tot + (tot < 499 ? 30 : 0);

            // Step 1: Tell backend to create a Razorpay order
            const orderData = await createOrder(totalAmount, cartItems, token);

            if (!orderData.orderId) {
                alert("Failed to create order. Try again.");
                setIsProcessing(false);
                return;
            }

            // Step 2: Open Razorpay payment popup
            const options = {
                key: process.env.REACT_APP_RAZORPAY_KEY_ID,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "EatUP",
                description: "Food Order Payment",
                order_id: orderData.orderId,

                // Step 3: This runs after user pays successfully
                handler: async (response) => {
                    try {
                        // Step 4: Send payment details to backend for verification
                        const verifyData = await verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        }, token);

                        if (verifyData.message === "Payment verified successfully") {
                            alert("Payment successful! Your order has been placed.");
                            clearCart();
                            showCart();
                        } else {
                            alert("Payment verification failed. Contact support.");
                        }
                    } catch (err) {
                        alert("Something went wrong during verification.");
                    }
                },

                prefill: {
                    name: user.name,
                    email: user.email,
                },
                theme: {
                    color: "#f97316",
                },
                modal: {
                    ondismiss: () => {
                        setIsProcessing(false);
                    }
                }
            };

            // Step 5: Open the Razorpay popup
            const rzp = new window.Razorpay(options);
            rzp.open();
            setIsProcessing(false);

        } catch (err) {
            alert("Something went wrong. Try again.");
            setIsProcessing(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 200 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 200 }}
            className="fixed top-0 right-0 w-full md:w-375 h-screen bg-white drop-shadow-md flex flex-col z-[101]"
        >
            <div className="w-full flex items-center justify-between p-4 cursor-pointer">
                <motion.div whileTap={{ scale: 0.75 }} onClick={showCart}>
                    <MdOutlineKeyboardBackspace className="text-textColor text-3xl" />
                </motion.div>
                <p className="text-textColor text-lg font-semibold">Cart</p>
                <motion.p
                    whileTap={{ scale: 0.75 }}
                    className="flex items-center gap-2 p-1 px-2 my-2 bg-gray-100 rounded-md hover:shadow-md cursor-pointer text-textColor text-base"
                    onClick={clearCart}
                >
                    Clear <RiRefreshFill />
                </motion.p>
            </div>

            {cartItems && cartItems.length > 0 ? (
                <div className="w-full h-full bg-cartBg rounded-t-[2rem] flex flex-col">
                    <div className="w-full h-340 md:h-42 px-6 py-10 flex flex-col gap-3 overflow-y-scroll scrollbar-none">
                        {cartItems && cartItems.length > 0 && cartItems.map((item) => (
                            <CartItem
                                key={item.id}
                                item={item}
                                setFlag={setFlag}
                                flag={flag}
                            />
                        ))}
                    </div>

                    <div className="w-full flex-1 bg-cartTotal rounded-t-[2rem] flex flex-col items-center justify-evenly px-8 py-2">
                        <div className="w-full flex items-center justify-between">
                            <p className="text-gray-400 text-lg">Sub Total</p>
                            <p className="text-gray-400 text-lg">₹ {tot}</p>
                        </div>
                        <div className="w-full flex items-center justify-between">
                            <p className="text-gray-400 text-lg">
                                {tot < 499 ? "Delivery Charge" : "Free Delivery"}
                            </p>
                            <p className="text-gray-400 text-lg">
                                {tot < 499 ? "₹ 30" : "₹ 0"}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">
                                Free delivery on orders over 499
                            </p>
                        </div>

                        <div className="w-full border-b border-gray-600 my-2"></div>

                        <div className="w-full flex items-center justify-between">
                            <p className="text-gray-200 text-xl font-semibold">Total</p>
                            <p className="text-gray-200 text-xl font-semibold">
                                ₹ {tot + (tot < 499 ? 30 : 0)}
                            </p>
                        </div>

                        {user ? (
                            <motion.button
                                whileTap={{ scale: 0.8 }}
                                type="button"
                                onClick={handleCheckout}
                                disabled={isProcessing}
                                className="w-full p-2 rounded-full bg-gradient-to-tr from-orange-400 to-orange-600 text-gray-50 text-lg my-2 hover:shadow-lg disabled:opacity-50"
                            >
                                {isProcessing ? "Processing..." : "Check Out"}
                            </motion.button>
                        ) : (
                            <motion.button
                                whileTap={{ scale: 0.8 }}
                                type="button"
                                className="w-full p-2 rounded-full bg-gradient-to-tr from-orange-400 to-orange-600 text-gray-50 text-lg my-2 hover:shadow-lg"
                            >
                                Login to check out
                            </motion.button>
                        )}
                    </div>
                </div>
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-6">
                    <img src={EmptyCart} className="w-300" alt="" />
                    <p className="text-xl text-textColor font-semibold">
                        Add some items to your cart
                    </p>
                </div>
            )}
        </motion.div>
    );
};

export default CartContainer;