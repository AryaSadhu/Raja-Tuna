import { useState, useEffect } from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import Footer from "@/Components/Footer";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import ActivityPopup from "@/Components/ActivityPopup";
import { Link, usePage } from "@inertiajs/react";
import Lottie from "lottie-react";
import fishJumping from "./Fish Jumping.json";
import { faker } from "@faker-js/faker";
import AboutProductModal from "@/Components/AboutProductModal";
import EventInfoModal from "@/Components/EventInfoModal";

function censorName(name) {
    if (!name) return name;
    const plain = name.trim();
    if (plain.length <= 3)
        return plain[0] + "*".repeat(Math.max(0, plain.length - 1));
    const first = plain[0];
    const lastTwo = plain.slice(-2);
    const stars = "*".repeat(Math.max(1, plain.length - 3));
    return `${first}${stars}${lastTwo}`;
}

const activityActions = {
    kupon: (count) => `baru saja menukarkan ${count} kupon!`,
};

function getRandomActivity() {
    const fullName = faker.person.firstName() + " " + faker.person.lastName();
    const shortName = censorName(faker.person.firstName().toLowerCase());

    const count = faker.number.int({ min: 1, max: 5 });
    return {
        type: "kupon",
        user: shortName,
        action: activityActions.kupon(count),
        timestamp: Date.now(),
    };
}

export default function AuthenticatedLayout({
    auth,
    header,
    children,
    layoutVariant = "default",
}) {
    const { globalEvent } = usePage().props;
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    const user = auth ? auth.user : null;

    const [currentActivity, setCurrentActivity] = useState(null);

    const [showAboutModal, setShowAboutModal] = useState(false);
    const [showEventInfoModal, setShowEventInfoModal] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const cycleActivity = () => {
            setCurrentActivity(null);
            setTimeout(() => {
                const newActivityData = getRandomActivity();
                const newActivity = {
                    ...newActivityData,
                    timestamp: Date.now(),
                };
                setCurrentActivity(newActivity);
            }, 3000);
        };

        const initialTimeout = setTimeout(cycleActivity, 10000);
        const interval = setInterval(cycleActivity, 30000);

        let eventTimer;
        if (globalEvent && !user) {
            eventTimer = setTimeout(() => {
                setShowEventInfoModal(true);
            }, 1000);
        }

        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };
        window.addEventListener("scroll", handleScroll);

        return () => {
            clearTimeout(initialTimeout);
            clearInterval(interval);
            if (eventTimer) clearTimeout(eventTimer);
            window.removeEventListener("scroll", handleScroll);
        };
    }, [user, globalEvent]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div
            className={`min-h-screen bg-gray-100 flex flex-col ${
                layoutVariant === "undian" ? "overflow-x-hidden" : ""
            }`}
        >
            <nav className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href={route("home")}>
                                    <ApplicationLogo className="block h-16 w-auto object-contain" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                {layoutVariant !== "undian" && (
                                    <>
                                        <NavLink
                                            href={route("home")}
                                            active={route().current("home")}
                                        >
                                            Home
                                        </NavLink>
                                        <button
                                            onClick={() =>
                                                setShowAboutModal(true)
                                            }
                                            className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300 transition duration-150 ease-in-out"
                                        >
                                            About Product
                                        </button>

                                        {/* MENU BARU: Daftar Product Desktop */}
                                        <NavLink
                                            href={route("product.index")}
                                            active={route().current("product.index")}
                                        >
                                            Daftar Product
                                        </NavLink>

                                        <NavLink
        href={route("pesanan.check")}
        active={route().current("pesanan.check")}
    >
        Check Pesanan
    </NavLink>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="hidden sm:flex sm:items-center sm:ms-6">
                            {user ? (
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                            >
                                                {user.name}
                                                <svg
                                                    className="ms-2 -me-0.5 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route("profile.edit")}
                                        >
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route("logout")}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            ) : (
                                <div className="flex items-center">
                                    <Lottie
                                        animationData={fishJumping}
                                        loop={true}
                                        style={{ height: 120, width: 160 }}
                                    />
                                </div>
                            )}
                        </div>

                        {layoutVariant !== "undian" && (
                            <div className="-me-2 flex items-center sm:hidden">
                                <button
                                    onClick={() =>
                                        setShowingNavigationDropdown(
                                            (previousState) => !previousState
                                        )
                                    }
                                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                                >
                                    <svg
                                        className="h-6 w-6"
                                        stroke="currentColor"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            className={
                                                !showingNavigationDropdown
                                                    ? "inline-flex"
                                                    : "hidden"
                                            }
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                        <path
                                            className={
                                                showingNavigationDropdown
                                                    ? "inline-flex"
                                                    : "hidden"
                                            }
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div
                    className={`sm:hidden transition-all duration-500 ease-in-out overflow-hidden ${
                        showingNavigationDropdown ? "max-h-screen" : "max-h-0"
                    }`}
                >
                    <div className="pt-2 pb-3 space-y-1">
                        {layoutVariant !== "undian" && (
                            <>
                                <ResponsiveNavLink
                                    href={route("home")}
                                    active={route().current("home")}
                                >
                                    Home
                                </ResponsiveNavLink>

                                <button
                                    onClick={() => {
                                        setShowAboutModal(true);
                                        setShowingNavigationDropdown(false);
                                    }}
                                    className="w-full text-start block ps-3 pe-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 focus:outline-none transition duration-150 ease-in-out"
                                >
                                    About Product
                                </button>

                                {/* MENU BARU: Daftar Product Mobile */}
                                <ResponsiveNavLink
                                    href={route("product.index")}
                                    active={route().current("product.index")}
                                >
                                    Daftar Product
                                </ResponsiveNavLink>

                                {/* ... menu lama ... */}
    <ResponsiveNavLink
        href={route("pesanan.check")}
        active={route().current("pesanan.check")}
    >
        Check Pesanan
    </ResponsiveNavLink>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            <main className="flex-grow">{children}</main>
            {layoutVariant !== "undian" && <Footer />}

            <ActivityPopup
                activity={currentActivity}
                onHide={() => setCurrentActivity(null)}
            />

            <button
                onClick={scrollToTop}
                className={`fixed bottom-6 right-6 bg-yellow-500 hover:bg-yellow-400 text-slate-900 p-3 rounded-full shadow-2xl z-50 transition-all duration-300 transform ${
                    showScrollTop
                        ? "translate-y-0 opacity-100 scale-100"
                        : "translate-y-20 opacity-0 scale-75"
                }`}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                </svg>
            </button>

            <AboutProductModal
                show={showAboutModal}
                onClose={() => setShowAboutModal(false)}
            />

            <EventInfoModal
                show={showEventInfoModal}
                onClose={() => setShowEventInfoModal(false)}
                event={globalEvent}
            />
        </div>
    );
}