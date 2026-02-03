// import { useEffect, useState } from "react";
// import { Menu, X, LogOut, User, Settings } from "lucide-react";
// import { FaGoogle, FaFacebook } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

// const Header = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [avatarUrl, setAvatarUrl] = useState("");
//   const [role, setRole] = useState("");
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const navigate = useNavigate();
//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   const scrollToSection = (sectionId: string) => {
//     const element = document.getElementById(sectionId);
//     element?.scrollIntoView({ behavior: "smooth" });
//     setIsMenuOpen(false);
//   };
//   const openLoginModal = () => {
//     setIsLoginModalOpen(true);
//   };
//   const closeLoginModal = () => {
//     setIsLoginModalOpen(false);
//   };
//   const handleLogout = () => {
//     fetch("http://localhost:3001/logout", {
//       method: "GET",
//       credentials: "include", // Đảm bảo gửi cookie session
//     })
//       .then((res) => res.json())
//       .then(() => {
//         setIsLoggedIn(false); // Cập nhật trạng thái đăng xuất
//         setAvatarUrl(""); // Xóa ảnh đại diện
//         setRole(""); // Xóa vai trò
//         setName(""); // Xóa tên
//         setEmail(""); // Xóa email
//         window.location.href = "/"; // Chuyển hướng về trang chủ
//       })
//       .catch((err) => {
//         console.error("Error during logout:", err);
//       });
//   };
//   const toggleDropdown = () => {
//     setIsDropdownOpen(!isDropdownOpen);
//   };
//   useEffect(() => {
//     fetch("http://localhost:3001/profile", {
//       credentials: "include",
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         if (data && data.email) {
//           setIsLoggedIn(true);
//           setAvatarUrl(data.avatarUrl || "");
//           setRole(data.role || "user"); // Mặc định là 'user' nếu không có vai trò
//           setName(data.name || ""); // Lấy tên người dùng
//           setEmail(data.email || ""); // Lấy email người dùng
//         }
//       })
//       .catch(() => setIsLoggedIn(false));
//   }, []);

//   return (
//     <>
//       <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50">
//         <div className="container mx-auto px-4 py-4">
//           <div className="flex items-center justify-between">
//             <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//               TTCorp
//             </div>

//             {/* Desktop Navigation */}
//             <nav className="hidden md:flex space-x-8">
//               <button
//                 onClick={() => scrollToSection("home")}
//                 className="text-gray-700 hover:text-blue-600 transition-colors"
//               >
//                 Trang chủ
//               </button>
//               <button
//                 onClick={() => scrollToSection("about")}
//                 className="text-gray-700 hover:text-blue-600 transition-colors"
//               >
//                 Về chúng tôi
//               </button>
//               <button
//                 onClick={() => navigate("/recruit")}
//                 className="text-gray-700 hover:text-blue-600 transition-colors"
//               >
//                 Tuyển dụng
//               </button>
//               <button
//                 onClick={() => scrollToSection("services")}
//                 className="text-gray-700 hover:text-blue-600 transition-colors"
//               >
//                 Dịch vụ
//               </button>
//               <button
//                 onClick={() => scrollToSection("team")}
//                 className="text-gray-700 hover:text-blue-600 transition-colors"
//               >
//                 Đội ngũ
//               </button>
//               <button
//                 onClick={() => scrollToSection("contact")}
//                 className="text-gray-700 hover:text-blue-600 transition-colors"
//               >
//                 Liên hệ
//               </button>
//               {isLoggedIn ? (
//                 <div className="relative">
//                   <img
//                     src={avatarUrl}
//                     alt="Avatar"
//                     className="w-10 h-10 rounded-full cursor-pointer"
//                     onClick={toggleDropdown}
//                   />
//                   {isDropdownOpen && (
//                     <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg">
//                       <div className="flex items-center  px-4 py-2 text-gray-700">
//                         <img
//                           src={avatarUrl}
//                           alt="Avatar"
//                           className="w-14 h-14 rounded-full mr-3 cursor-pointer"
//                         />
//                         <div className="flex flex-col">
//                           <span className="text-md font-medium">{name}</span>
//                           <span className="text-md text-gray-500">{email}</span>
//                         </div>
//                       </div>

//                       {role === "admin" && (
//                         <button
//                           onClick={() => navigate("/admin")}
//                           className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
//                         >
//                           <Settings className="w-4 h-4 mr-3 text-gray-600" />
//                           Quản lý tuyển dụng
//                         </button>
//                       )}
//                       <button className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
//                         <User className="w-4 h-4 mr-3 text-gray-600" />
//                         Thông tin cá nhân
//                       </button>
//                       <button
//                         onClick={handleLogout}
//                         className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
//                       >
//                         <LogOut className="w-4 h-4 mr-3" />
//                         Đăng xuất
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <button
//                   onClick={openLoginModal}
//                   className="text-left text-gray-700 hover:text-blue-600 transition-colors"
//                 >
//                   Đăng nhập
//                 </button>
//               )}
//             </nav>

//             {/* Mobile Menu Button */}
//             <button
//               onClick={toggleMenu}
//               className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
//             >
//               {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
//             </button>
//           </div>

//           {/* Mobile Navigation */}
//           {isMenuOpen && (
//             <nav className="md:hidden mt-4 py-4 border-t border-gray-200">
//               <div className="flex flex-col space-y-4">
//                 <button
//                   onClick={() => scrollToSection("home")}
//                   className="text-left text-gray-700 hover:text-blue-600 transition-colors"
//                 >
//                   Trang chủ
//                 </button>
//                 <button
//                   onClick={() => scrollToSection("about")}
//                   className="text-left text-gray-700 hover:text-blue-600 transition-colors"
//                 >
//                   Về chúng tôi
//                 </button>
//                 <button
//                   onClick={() => navigate("/recruit")}
//                   className="text-left text-gray-700 hover:text-blue-600 transition-colors"
//                 >
//                   Tuyển dụng
//                 </button>
//                 <button
//                   onClick={() => scrollToSection("services")}
//                   className="text-left text-gray-700 hover:text-blue-600 transition-colors"
//                 >
//                   Dịch vụ
//                 </button>
//                 <button
//                   onClick={() => scrollToSection("team")}
//                   className="text-left text-gray-700 hover:text-blue-600 transition-colors"
//                 >
//                   Đội ngũ
//                 </button>
//                 <button
//                   onClick={() => scrollToSection("contact")}
//                   className="text-left text-gray-700 hover:text-blue-600 transition-colors"
//                 >
//                   Liên hệ
//                 </button>
//                 {isLoggedIn ? (
//                   <div className="relative">
//                     <img
//                       src={avatarUrl}
//                       alt="Avatar"
//                       className="w-10 h-10 rounded-full cursor-pointer"
//                       onClick={toggleDropdown}
//                     />
//                     {isDropdownOpen && (
//                       <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg">
//                         <button
//                           onClick={handleLogout}
//                           className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
//                         >
//                           Đăng xuất
//                         </button>
//                         {role === "admin" && (
//                           <button
//                             onClick={() => navigate("/admin")}
//                             className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
//                           >
//                             Quản lý tuyển dụng
//                           </button>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 ) : (
//                   <button
//                     onClick={openLoginModal}
//                     className="text-left text-gray-700 hover:text-blue-600 transition-colors"
//                   >
//                     Đăng nhập
//                   </button>
//                 )}
//               </div>
//             </nav>
//           )}
//         </div>
//       </header>
//       {/* Login Modal */}
//       {isLoginModalOpen && (
//         <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/30  flex items-center justify-center ">
//           <div className="bg-white rounded-lg p-6 w-[29rem] shadow-lg">
//             {/* Banner chào mừng */}
//             <img
//               src="https://res.cloudinary.com/do46eak3c/image/upload/v1753411170/1_uqdout.png"
//               alt="Banner"
//               className="mb-4 rounded-lg"
//             />
//             <h2 className="text-xl font-bold mb-4">Đăng nhập</h2>

//             <button
//               onClick={() =>
//                 (window.location.href = "https://manage-recruitment-api.vercel.app/auth/google")
//               }
//               className="w-full py-2 mb-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center"
//             >
//               <FaGoogle className="mr-2" />
//               Đăng nhập bằng Google
//             </button>
//             <button
//               onClick={() => alert("Đăng nhập bằng Facebook")}
//               className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
//             >
//               <FaFacebook className="mr-2" />
//               Đăng nhập bằng Facebook
//             </button>
//             <button
//               onClick={closeLoginModal}
//               className="mt-4 w-full py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
//             >
//               Đóng
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Header;
import { useEffect, useState } from "react";
import { Menu, X, LogOut, Settings } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const API_URL = "https://manage-recruitment-api.vercel.app";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  /* =========================
     HANDLE LOGIN CALLBACK
     ========================= */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      window.history.replaceState({}, document.title, "/");
      fetchProfile(token);
    }
  }, [location.search]);

  /* =========================
     FETCH PROFILE WITH JWT
     ========================= */
  const fetchProfile = async (token?: string) => {
    const jwt = token || localStorage.getItem("token");
    if (!jwt) return;

    try {
      const res = await axios.get(`${API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      setIsLoggedIn(true);
      setAvatarUrl(res.data.avatar_url || "");
      setRole(res.data.role || "user");
      setName(res.data.name || "");
      setEmail(res.data.email || "");
    } catch {
      setIsLoggedIn(false);
      localStorage.removeItem("token");
    }
  };

  /* =========================
     INIT ON LOAD
     ========================= */
  useEffect(() => {
    fetchProfile();
  }, []);

  /* =========================
     LOGOUT
     ========================= */
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setAvatarUrl("");
    setRole("");
    setName("");
    setEmail("");
    navigate("/");
  };

  /* =========================
     UI HELPERS
     ========================= */
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TTCorp
            </div>

            {/* Desktop */}
            <nav className="hidden md:flex space-x-8">
              <button onClick={() => scrollToSection("home")}>Trang chủ</button>
              <button onClick={() => scrollToSection("about")}>Về chúng tôi</button>
              <button onClick={() => navigate("/recruit")}>Tuyển dụng</button>
              <button onClick={() => scrollToSection("services")}>Dịch vụ</button>
              <button onClick={() => scrollToSection("team")}>Đội ngũ</button>
              <button onClick={() => scrollToSection("contact")}>Liên hệ</button>

              {isLoggedIn ? (
                <div className="relative">
                  <img
                    src={avatarUrl}
                    className="w-10 h-10 rounded-full cursor-pointer"
                    onClick={toggleDropdown}
                  />
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg">
                      <div className="flex px-4 py-3">
                        <img src={avatarUrl} className="w-14 h-14 rounded-full mr-3" />
                        <div>
                          <div className="font-medium">{name}</div>
                          <div className="text-gray-500">{email}</div>
                        </div>
                      </div>

                      {role === "admin" && (
                        <button
                          onClick={() => navigate("/admin")}
                          className="flex items-center w-full px-4 py-2 hover:bg-gray-100"
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Quản lý tuyển dụng
                        </button>
                      )}

                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 hover:bg-gray-100"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={openLoginModal}>Đăng nhập</button>
              )}
            </nav>

            {/* Mobile */}
            <button onClick={toggleMenu} className="md:hidden">
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      {/* LOGIN MODAL */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-[29rem]">
            <h2 className="text-xl font-bold mb-4">Đăng nhập</h2>

            <button
              onClick={() =>
                (window.location.href = `${API_URL}/auth/google`)
              }
              className="w-full py-2 bg-red-500 text-white rounded-lg flex justify-center items-center"
            >
              <FaGoogle className="mr-2" />
              Đăng nhập bằng Google
            </button>

            <button
              onClick={closeLoginModal}
              className="mt-4 w-full py-2 bg-gray-300 rounded-lg"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
