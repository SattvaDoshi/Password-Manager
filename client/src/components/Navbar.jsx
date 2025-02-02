import React, { useState } from "react";
import { Link as ScrollLink } from "react-scroll";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { MenuIcon, XIcon } from "lucide-react";
import { useAuthStore } from "../store/authStore";

function Navbar() {
  const [toggleMenu, setToggleMenu] = useState(false);
  const { isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
  };

  return (
    <div className="bg-gradient-to-br from-green-100 to-emerald-200 flex flex-col items-center">
      <nav className="bg-green-100 shadow-md w-full md:py-3 py-3 ">
        <div className="mx-auto">
          <div className="flex mx-auto justify-between items-center w-5/6">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <img src="./logo.svg" alt="Logo" className="logo w-10 h-10" />
              <h1 className="text-2xl font-bold text-emerald-700">PassVault</h1>
            </div>

            {/* If User is Authenticated, Show Only Logout Button */}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-xl shadow-md transition duration-300 ease-in-out"
              >
                Logout
              </button>
            ) : (
              <>
                {/* Desktop Navbar */}
                <div className="hidden lg:flex items-center gap-8">
                  <div
                    className="flex gap-8"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    <Link to="/" className="hover:underline text-lg text-green-800">
                      Home
                    </Link>
                    <ScrollLink
                      to="features"
                      smooth={true}
                      duration={500}
                      className="hover:underline text-lg text-green-800 cursor-pointer"
                    >
                      Features
                    </ScrollLink>
                    <ScrollLink to="contact-us"
                      smooth={true}
                      duration={500}
                      className="hover:underline text-lg text-green-800 cursor-pointer">
                      Contact-Us
                    </ScrollLink>
                    <ScrollLink
                      to="pricing"
                      smooth={true}
                      duration={500}
                      className="hover:underline text-lg text-green-800 cursor-pointer"
                    >
                      Pricing
                    </ScrollLink>
                  </div>
                  <button
                    onClick={() => navigate("/login")}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-xl shadow-md transition duration-300 ease-in-out"
                  >
                    Login
                  </button>
                </div>

                {/* Mobile Navbar */}
                <div className="lg:hidden flex gap-3 items-center">
                  <button onClick={() => setToggleMenu(!toggleMenu)}>
                    <MenuIcon className="h-6 text-green-800" />
                  </button>
                </div>

                {/* Mobile Menu */}
                <div
                  className={`lg:hidden fixed top-0 left-0 w-full h-full bg-green-100 z-40 transform transition-all duration-300 ${toggleMenu ? "translate-y-0" : "-translate-y-full"
                    }`}
                >
                  <div className="px-8 py-4 flex justify-between items-center">
                    <h1 className="text-green-800 text-xl font-bold">Menu</h1>
                    <button onClick={() => setToggleMenu(false)}>
                      <XIcon className="h-6 text-green-800" />
                    </button>
                  </div>
                  <div
                    className="flex flex-col gap-8 font-bold tracking-wider px-8 py-6"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    <Link
                      to="/"
                      className="text-green-800"
                      onClick={() => setToggleMenu(false)}
                    >
                      Home
                    </Link>
                    <ScrollLink
                      to="features"
                      smooth={true}
                      duration={500}
                      className="text-green-800 cursor-pointer"
                      onClick={() => setToggleMenu(false)}
                    >
                      Features
                    </ScrollLink>
                    <ScrollLink to="contact-us"
                      smooth={true}
                      duration={500}
                      className="hover:underline text-lg text-green-800 cursor-pointer"
                      onClick={() => setToggleMenu(false)}
                      >
                      Contact-Us
                    </ScrollLink>
                    <ScrollLink
                      to="pricing"
                      smooth={true}
                      duration={500}
                      className="text-green-800 cursor-pointer"
                      onClick={() => setToggleMenu(false)}
                    >
                      Pricing
                    </ScrollLink>
                    <button
                      onClick={() => {
                        setToggleMenu(false);
                        navigate("/login");
                      }}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-xl shadow-md transition duration-300 ease-in-out"
                    >
                      Login
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
