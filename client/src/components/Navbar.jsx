import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { MenuIcon, XIcon } from "lucide-react";
import { useAuthStore } from "../store/authStore";

function Navbar() {
  const [toggleMenu, setToggleMenu] = useState(false);
  const {isAuthenticated,logout} = useAuthStore();

  const navigate = useNavigate();

  const handleLogout = () => {
     logout();
  };

  return (
    <div className="bg-gradient-to-br from-green-100 to-emerald-200 flex flex-col items-center">
      <nav className="bg-green-100 shadow-md w-full md:py-3 py-2">
        <div className="mx-auto ">
          <div className="flex mx-auto justify-between items-center w-5/6">
            <div className="flex items-center space-x-4">
              <img src="" alt="Logo" className="logo w-28 h-15" />
            </div>
            <div className="hidden lg:flex items-center gap-8">
              <div className="flex gap-8" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                {["Home", "Internships", "Users", "Contact-Us", "Blog"].map((item, index) => {
                  let href;
                  switch (item) {
                    case "Home":
                      href = "/";
                      break;
                    case "Internships":
                      href = "/admin/internship-details";
                      break;
                    case "Users":
                      href = "/admin/user-details";
                      break;
                    case "Contact-Us":
                      href = "/admin/contact-form";
                      break;
                    case "Blog":
                      href = "/admin/blogging";
                      break;
                    default:
                      href = "#";
                  }
                  return (
                    <Link
                      key={index}
                      to={href}
                      className="hover:underline text-lg text-green-800"
                    >
                      {item}
                    </Link>
                  );
                })}
              </div>
              {isAuthenticated ? (<button
                onClick={handleLogout}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-xl shadow-md transition duration-300 ease-in-out"
              >
                Logout
              </button>) : (<button
                onClick={() => navigate("/login")}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-xl shadow-md transition duration-300 ease-in-out"
              >
                Login
              </button>)}
            </div>

            <div className="lg:hidden flex gap-3 items-center">
              <button onClick={() => setToggleMenu(!toggleMenu)}>
                <MenuIcon className="h-6 text-green-800" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden fixed top-0 left-0 w-full h-full bg-green-100 z-40 transform transition-all duration-300 ${
            toggleMenu ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <div className="px-8 py-4 flex justify-between items-center">
            <h1 className="text-green-800 text-xl font-bold">Menu</h1>
            <button onClick={() => setToggleMenu(false)}>
              <XIcon className="h-6 text-green-800" />
            </button>
          </div>
          <div
            className="flex flex-col gap-8 font-bold tracking-wider px-8"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            {["Home", "Internships", "Users", "Contact-Us", "Blog"].map((item, index) => {
              let href;
              switch (item) {
                case "Home":
                  href = "/";
                  break;
                case "Internships":
                  href = "/admin/internship-details";
                  break;
                case "Users":
                  href = "/admin/user-details";
                  break;
                case "Contact-Us":
                  href = "/admin/contact-form";
                  break;
                case "Blog":
                  href = "/admin/blogging";
                  break;
                default:
                  href = "#";
              }
              return (
                <Link
                  key={index}
                  to={href}
                  className="text-green-800"
                  onClick={() => setToggleMenu(false)}
                >
                  {item}
                </Link>
              );
            })}
            <button
              onClick={() => {
                setToggleMenu(false);
                handleLogout();
              }}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-xl shadow-md transition duration-300 ease-in-out"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
