import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";

const App: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

   const slides = [
    "https://picsum.photos/id/1015/800/300",
    "https://picsum.photos/id/1016/800/300",
    "https://picsum.photos/id/1018/800/300",
    "https://picsum.photos/id/1020/800/300",
  ];

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      {/* Navbar */}
      <nav className="border-red w-full bg-blue-600 text-white py-3 px-6 sticky top-0 z-50">
        <h1 className="text-lg font-semibold">My Navbar</h1>
      </nav>

      {/* Layout wrapper */}
      <div className="flex border-red">
        {/* Sidebar */}
        <aside className="sticky top-[3.5rem] h-screen w-[205px] bg-gray-800 text-white p-4 border-red">
          <ul className="space-y-3">
            <li className="hover:bg-gray-700 p-2 rounded">Dashboard</li>
            <li className="hover:bg-gray-700 p-2 rounded">Settings</li>
            <li className="hover:bg-gray-700 p-2 rounded">Profile</li>
            <li className="hover:bg-gray-700 p-2 rounded">Logout</li>
          </ul>
        </aside>

        {/* Main content wrapper (takes rest of space) */}
        <main className="flex-1 min-h-screen bg-gray-100 p-6 overflow-hidden border-red">
          <div className="flex transition-all duration-500 ease-in-out w-full">
            {/* Left side: Swiper + Content */}
            <div
              className={`transition-all duration-500 ease-in-out min-w-[400px] ${
                isExpanded ? "w-[70%]" : "w-full"
              }`}
            >
              {/* Swiper Section */}
              <Swiper
                modules={[Pagination, Autoplay]}
                slidesPerView={1}
                pagination={{ clickable: true }}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                loop={true}
                className="rounded-xl shadow mb-8 flex-shrink-0 h-56 sm:h-64 md:h-72 lg:h-80"
              >
                {slides.map((src, i) => (
                  <SwiperSlide key={i}>
                    <div className="w-full h-full bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                      <img
                        src={src}
                        alt={`Slide ${i + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Content Section */}
              <div className="border-red">
                <h2 className="text-xl font-semibold mb-4">Content Section</h2>
                <div
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="cursor-pointer bg-white shadow rounded p-6 hover:shadow-lg transition"
                >
                  <h3 className="font-semibold mb-2">Card Title</h3>
                  <p className="text-gray-600">
                    Click me to {isExpanded ? "close" : "open"} sidebar.
                  </p>
                </div>
              </div>
            </div>

            {/* Inner Sidebar (pushes only main content) */}
            <div
              className={`border-red transition-all duration-500 ease-in-out bg-white shadow-lg rounded p-4 overflow-hidden ${
                isExpanded
                  ? "w-[30%] opacity-100 translate-x-0"
                  : "w-0 opacity-0 translate-x-full"
              }`}
            >
              {isExpanded && (
                <div>
                  <h3 className="font-semibold text-lg mb-4">Inner Sidebar</h3>
                  <p className="text-gray-700 mb-3">
                    This panel pushes the content, not the full page.
                  </p>
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="px-3 py-2 bg-blue-600 text-white rounded"
                  >
                    Close
                  </button>
                  <p></p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
