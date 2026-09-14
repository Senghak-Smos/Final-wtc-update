import { Link } from "react-router-dom";
import locat from "../image/pin.png";
import Call from "../image/phone-call.png";
import mail from "../image/mail.png";

function Footer() {
  return (
    <footer className="bg-gray-200 w-full">
      {/*  Converted grid-cols-5 to responsive breakpoints: 1 col (mobile) -> 2 cols (tablet) -> 5 cols (desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 max-w-[1280px] mx-auto px-6 py-8">
        {/* ===== Column 1: About ===== */}
        <div>
          <h1 className="font-adlam text-xl sm:text-2xl">
            <u>About</u>
          </h1>
          <br />
          <p className="font-inter text-sm sm:text-base leading-relaxed">
            C-E-R (Calculate Electrical Room) is a smart planning tool designed
            to help you estimate lighting requirements, AC capacity, fan count,
            and wiring needs based on your specific room dimensions. Plan
            smarter and save on energy costs.
          </p>
        </div>

        {/* ===== Column 2: Quick Links ===== */}
        <div className="text-left sm:text-center">
          <h1 className="font-adlam text-xl sm:text-2xl">
            <u>Quick Link</u>
          </h1>
          <br />
          <ul className="space-y-2 font-bold text-green-800 text-sm sm:text-base">
            <li className="hover:text-blue-800 transition">
              <a href="#">
                <u>Home</u>
              </a>
            </li>
            <li className="hover:text-blue-800 transition">
              <a href="#about">
                <u>About</u>
              </a>
            </li>
            <li className="hover:text-blue-800 transition">
              <a href="#service">
                <u>Service</u>
              </a>
            </li>
            <li className="hover:text-blue-800 transition">
              <a href="#contact">
                <u>Contact</u>
              </a>
            </li>
            {/* <li className="hover:text-blue-800 transition">
              <a href="#owner">
                <u>Founder</u>
              </a>
            </li> */}
          </ul>
        </div>

        {/* ===== Column 3: Help & Support ===== */}
        <div className="text-left sm:text-center">
          <h1 className="font-adlam text-xl sm:text-2xl">
            <u>Help & Support</u>
          </h1>
          <br />
          <ul className="space-y-2 font-adlam text-green-800 text-sm sm:text-base">
            <li className="hover:text-blue-800 transition">
              <Link to="/qa">
                <u>Q&A</u>
              </Link>
            </li>
            <li className="hover:text-blue-800 transition">
              <Link to="/how">
                <u>How it works</u>
              </Link>
            </li>
          </ul>
        </div>

        {/* ===== Column 4: Service Links ===== */}
        <div className="text-left sm:text-center">
          <h1 className="font-adlam text-xl sm:text-2xl">
            <u>Service</u>
          </h1>
          <br />
          <ul className="space-y-2 font-adlam text-green-800 text-sm sm:text-base">
            <li className="hover:text-blue-800 transition">
              <a href="#service">
                <u>Lighting Requirment</u>
              </a>
            </li>
            <li className="hover:text-blue-800 transition">
              <a href="#service">
                <u>Air Conditioner Sizing</u>
              </a>
            </li>
            <li className="hover:text-blue-800 transition">
              <a href="#service">
                <u>Fan Estimation</u>
              </a>
            </li>
            <li className="hover:text-blue-800 transition">
              <a href="#service">
                <u>Wire Length & Size</u>
              </a>
            </li>
          </ul>
        </div>

        {/* ===== Column 5: Contact ===== */}
        <div>
          <h1 className="font-adlam text-xl sm:text-2xl ">
            <u>Contact</u>
          </h1>
          <br />
          <ul className="font-inter space-y-2 text-sm sm:text-base ">
            <div className="flex">
              <img src={locat} alt="" className="w-6" />
              <li className="ml-2"> Cambodia</li>
            </div>
            {/* <div className="flex">
              <img src={Call} alt="" className="w-6" />
              <li className="ml-2"> +(855)-15-475-879</li>
            </div> */}
            <div className="flex">
              <img src={mail} alt="" className="w-6" />
              <li className="ml-2"> nangsenghak1@gmail.com</li>
            </div>
          </ul>
        </div>
      </div>

      {/* ===== Bottom Copyright Bar ===== */}
      <div className="text-center py-4 border-t border-gray-400/50">
        <p className="text-gray-600 font-biorhyme text-xs sm:text-sm">
          2026 C-E-R. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
