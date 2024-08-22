import { useNavigate, useLocation } from "react-router-dom";

export const headers = [
  {
    title: "Messages",
    url: "/messages",
  },
  {
    title: "Logout",
    url: "/login",
  },
];

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (url: string) => location.pathname === url;

  return (
    <div className="flex space-x-4 p-4">
      {headers.map((header) => (
        <button
          key={header.title}
          onClick={() => navigate(header.url)}
          className={` font-medium px-3 py-2 rounded-lg transition-colors relative 
                        ${
                          isActive(header.url)
                            ? "text-blue-400"
                            : "hover:text-blue-400 hover:after:w-full"
                        }
                    `}
        >
          {header.title}
          <span
            className={`absolute bottom-0 left-0 h-1 w-0 bg-blue-400 transition-all duration-300 ${
              isActive(header.url) ? "w-full" : "hover:w-full"
            }`}
          ></span>
        </button>
      ))}
    </div>
  );
}

export default Header;
