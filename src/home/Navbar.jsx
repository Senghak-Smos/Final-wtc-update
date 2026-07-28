import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const ADMIN_EMAILS = ["admin@cer.com"];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);

        if (ADMIN_EMAILS.includes(user.email?.toLowerCase())) {
          setIsAdmin(true);
        } else {
          try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists() && userDoc.data().role === "admin") {
              setIsAdmin(true);
            } else {
              setIsAdmin(false);
            }
          } catch (err) {
            console.error("Error fetching user role:", err);
            setIsAdmin(false);
          }
        }
      } else {
        setCurrentUser(null);
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsOpen(false);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const getclick = (path, hash = "") => {
    const basecase =
      "px-5 py-2 rounded-[10px] font-bold transition duration-200 block text-center cursor-pointer";

    if (hash) {
      const isHashActive =
        location.pathname === path &&
        (location.hash === hash || (hash === "#home" && !location.hash));

      return isHashActive
        ? `${basecase} bg-blue-500 text-white`
        : `${basecase} hover:bg-gray-200 text-gray-800`;
    }

    const isPathActive = location.pathname === path && !location.hash;

    return isPathActive
      ? `${basecase} bg-blue-500 text-white`
      : `${basecase} hover:bg-gray-200 text-gray-800`;
  };

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-white shadow-md">
      <div className="flex flex-row justify-between items-center w-full max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12 py-3">
        <div>
          <Link
            to="/#home"
            className="font-adlam text-xl sm:text-2xl font-bold text-black whitespace-nowrap shrink-0"
          >
            C-E-R
          </Link>
        </div>

        {/* Desktop Navigation Menu */}
        <div className="hidden md:flex gap-6 items-center">
          <Link to="/#home" className={getclick("/", "#home")}>
            Home
          </Link>
          <Link to="/#about" className={getclick("/", "#about")}>
            About
          </Link>
          <Link to="/#service" className={getclick("/", "#service")}>
            Service
          </Link>
          <Link to="/#contact" className={getclick("/", "#contact")}>
            Contact
          </Link>

          <Link to="/user" className={getclick("/user")}>
            Dashboard
          </Link>

          {isAdmin && (
            <Link to="/admin" className={getclick("/admin")}>
              Admin
            </Link>
          )}

          <div className="border-l h-5 border-gray-400"></div>

          {currentUser ? (
            <div className="flex items-center gap-3">
              <span className="px-3 py-2 text-sm font-bold text-gray-700 bg-gray-100 rounded-[10px] border border-gray-300">
                {currentUser.email?.split("@")[0]} {isAdmin && "(Admin)"}
              </span>
              <button
                onClick={handleLogout}
                className="px-5 py-2 rounded-[10px] font-bold text-white bg-red-600 hover:bg-red-700 transition duration-200 cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link to="/login" className={getclick("/login")}>
              Login
            </Link>
          )}
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          aria-label="Toggle Navigation"
          className="md:hidden flex items-center justify-center p-2 text-2xl text-gray-800 focus:outline-none shrink-0 cursor-pointer"
        >
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden w-full bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-3 shadow-xl">
          <Link
            to="/#home"
            onClick={() => setIsOpen(false)}
            className={getclick("/", "#home")}
          >
            Home
          </Link>
          <Link
            to="/#about"
            onClick={() => setIsOpen(false)}
            className={getclick("/", "#about")}
          >
            About
          </Link>
          <Link
            to="/#service"
            onClick={() => setIsOpen(false)}
            className={getclick("/", "#service")}
          >
            Service
          </Link>
          <Link
            to="/#contact"
            onClick={() => setIsOpen(false)}
            className={getclick("/", "#contact")}
          >
            Contact
          </Link>

          <Link
            to="/user"
            onClick={() => setIsOpen(false)}
            className={getclick("/user")}
          >
            Dashboard
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setIsOpen(false)}
              className={getclick("/admin")}
            >
              Admin
            </Link>
          )}

          <div className="border-t my-1 border-gray-200"></div>

          {currentUser ? (
            <div className="flex flex-col gap-2">
              <span className="px-5 py-2 text-center text-sm font-bold text-gray-700 bg-gray-100 rounded-[10px] border border-gray-300">
                {currentUser.email?.split("@")[0]} {isAdmin && "(Admin)"}
              </span>
              <button
                onClick={handleLogout}
                className="w-full px-5 py-2 rounded-[10px] font-bold text-white bg-red-600 hover:bg-red-700 transition duration-200 cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className={getclick("/login")}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;
