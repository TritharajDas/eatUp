import React, { useState } from "react";
import { MdShoppingBasket, MdAdd, MdLogout } from "react-icons/md";
import { motion } from "framer-motion";
import Logo from "../img/logo_eu.png";
import Avatar from "../img/avatar.png";
import { Link } from "react-router-dom";
import { useStateValue } from "../context/StateProvider";
import { actionType } from "../context/reducer";
import { loginUser, registerUser } from "../utils/api";

const Header = () => {
    const [{ user, cartShow, cartItems }, dispatch] = useStateValue();
    const [isMenu, setIsMenu] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [isRegister, setIsRegister] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleAuth = async () => {
        setError("");
        try {
            let data;
            if (isRegister) {
                data = await registerUser(name, email, password);
            } else {
                data = await loginUser(email, password);
            }

            if (data.token) {
                localStorage.setItem("user", JSON.stringify(data.user));
                localStorage.setItem("token", data.token);
                dispatch({ type: actionType.SET_USER, user: data.user });
                setShowAuthModal(false);
                setEmail("");
                setPassword("");
                setName("");
            } else {
                setError(data.message || "Something went wrong");
            }
        } catch (err) {
            setError("Something went wrong");
        }
    };

    const logout = () => {
        setIsMenu(false);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        dispatch({ type: actionType.SET_USER, user: null });
    };

    const showCart = () => {
        dispatch({ type: actionType.SET_CART_SHOW, cartShow: !cartShow });
    };

    return (
        <header className="fixed z-50 w-screen p-3 px-4 md:p-6 md:px-16 bg-primary">

            {/* Auth Modal */}
            {showAuthModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-80 flex flex-col gap-4">
                        <h2 className="text-xl font-semibold text-headingColor">
                            {isRegister ? "Register" : "Login"}
                        </h2>

                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        {isRegister && (
                            <input
                                type="text"
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="border border-gray-300 rounded-lg p-2 outline-none"
                            />
                        )}
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border border-gray-300 rounded-lg p-2 outline-none"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border border-gray-300 rounded-lg p-2 outline-none"
                        />

                        <button
                            onClick={handleAuth}
                            className="bg-orange-500 text-white rounded-lg p-2 font-semibold"
                        >
                            {isRegister ? "Register" : "Login"}
                        </button>

                        <p
                            className="text-sm text-center text-gray-500 cursor-pointer"
                            onClick={() => setIsRegister(!isRegister)}
                        >
                            {isRegister
                                ? "Already have an account? Login"
                                : "Don't have an account? Register"}
                        </p>

                        <p
                            className="text-sm text-center text-gray-400 cursor-pointer"
                            onClick={() => setShowAuthModal(false)}
                        >
                            Cancel
                        </p>
                    </div>
                </div>
            )}

            {/* Desktop */}
            <div className="hidden md:flex w-full h-full items-center justify-between">
                <Link to={"/"} className="flex items-center gap-2">
                    <img src={Logo} className="object-cover w-14 h-4" alt="logo" />
                </Link>

                <div className="flex items-center gap-8">
                    <motion.ul
                        initial={{ opacity: 0, x: 200 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 200 }}
                        className="flex items-center gap-16"
                    >
                        <li className="text-base text-textColor hover:text-headingColor duration-100 transition-all ease-in-out cursor-pointer">
                            <Link to={"/"}>Home</Link>
                        </li>
                        <li className="text-base text-textColor hover:text-headingColor duration-100 transition-all ease-in-out cursor-pointer">Menu</li>
                        <li className="text-base text-textColor hover:text-headingColor duration-100 transition-all ease-in-out cursor-pointer">About Us</li>
                        <li className="text-base text-textColor hover:text-headingColor duration-100 transition-all ease-in-out cursor-pointer">Service</li>
                    </motion.ul>

                    <div className="relative flex items-center justify-center" onClick={showCart}>
                        <MdShoppingBasket className="text-textColor text-2xl cursor-pointer" />
                        {cartItems && cartItems.length > 0 && (
                            <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-cartNumBg flex items-center justify-center">
                                <p className="text-xs text-white font-semibold">
                                    {cartItems.reduce((prev, curr) => prev + curr.qty, 0)}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="relative">
                        <motion.img
                            whileTap={{ scale: 0.6 }}
                            src={user ? user.photoURL || Avatar : Avatar}
                            className="w-10 min-w-[40px] min-h-[40px] h-10 cursor-pointer drop-shadow-xl rounded-full"
                            onClick={() => user ? setIsMenu(!isMenu) : setShowAuthModal(true)}
                            alt="user profile"
                        />
                        {isMenu && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0 }}
                                className="w-40 bg-gray-50 shadow-xl rounded-lg flex flex-col absolute top-12 right-0"
                            >
                                {user && user.email === "rjtirtharaj@gmail.com" && (
                                    <Link to={"/createItem"}>
                                        <p className="px-4 py-2 flex items-center gap-3 cursor-pointer hover:bg-slate-100 transition-all duration-100 ease-in-out text-textColor text-base"
                                            onClick={() => setIsMenu(false)}>
                                            New Item <MdAdd />
                                        </p>
                                    </Link>
                                )}
                                <p className="px-4 py-2 flex items-center gap-3 cursor-pointer hover:bg-slate-100 transition-all duration-100 ease-in-out text-textColor text-base"
                                    onClick={logout}>
                                    Logout <MdLogout />
                                </p>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile */}
            <div className="flex items-center justify-between md:hidden w-full h-full">
                <div className="relative flex items-center justify-center" onClick={showCart}>
                    <MdShoppingBasket className="text-textColor text-2xl cursor-pointer" />
                    {cartItems && cartItems.length > 0 && (
                        <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-cartNumBg flex items-center justify-center">
                            <p className="text-xs text-white font-semibold">{cartItems.length}</p>
                        </div>
                    )}
                </div>

                <Link to={"/"} className="flex items-center gap-2">
                    <img src={Logo} className="w-14 h-4 object-cover" alt="logo" />
                </Link>

                <div className="relative">
                    <motion.img
                        whileTap={{ scale: 0.6 }}
                        src={user ? user.photoURL || Avatar : Avatar}
                        className="w-10 min-w-[40px] min-h-[40px] h-10 cursor-pointer drop-shadow-xl rounded-full"
                        onClick={() => user ? setIsMenu(!isMenu) : setShowAuthModal(true)}
                        alt="user profile"
                    />
                    {isMenu && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            className="w-40 bg-gray-50 shadow-xl rounded-lg flex flex-col absolute top-12 right-0"
                        >
                            {user && user.email === "rjtirtharaj@gmail.com" && (
                                <Link to={"/createItem"}>
                                    <p className="px-4 py-2 flex items-center gap-3 cursor-pointer hover:bg-slate-100 transition-all duration-100 ease-in-out text-textColor text-base"
                                        onClick={() => setIsMenu(false)}>
                                        New Item <MdAdd />
                                    </p>
                                </Link>
                            )}
                            <ul className="flex flex-col">
                                <li className="text-base text-textColor hover:text-headingColor duration-100 transition-all ease-in-out cursor-pointer hover:bg-slate-100 px-4 py-2">
                                    <Link to={"/"}>Home</Link>
                                </li>
                                <li className="text-base text-textColor hover:text-headingColor duration-100 transition-all ease-in-out cursor-pointer hover:bg-slate-100 px-4 py-2">Menu</li>
                                <li className="text-base text-textColor hover:text-headingColor duration-100 transition-all ease-in-out cursor-pointer hover:bg-slate-100 px-4 py-2">About Us</li>
                                <li className="text-base text-textColor hover:text-headingColor duration-100 transition-all ease-in-out cursor-pointer hover:bg-slate-100 px-4 py-2">Service</li>
                            </ul>
                            <p className="m-2 rounded-md shadow-md p-2 flex items-center gap-3 cursor-pointer hover:bg-gray-300 transition-all duration-100 ease-in-out text-textColor justify-center bg-gray-200 text-base"
                                onClick={logout}>
                                Logout <MdLogout />
                            </p>
                        </motion.div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;