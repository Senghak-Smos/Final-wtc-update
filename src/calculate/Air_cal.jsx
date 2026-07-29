import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";

function Air_cal() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [length, setlength] = useState("");
  const [width, setwidth] = useState("");
  const [roomType, setroomType] = useState(600);
  const [people, setpeople] = useState("");
  const [price, setprice] = useState("");

  const exchangeRate = 4100;

  const area = (parseFloat(length) || 0) * (parseFloat(width) || 0);
  const occupants = parseInt(people) || 0;

  const totalBTU = area * roomType + occupants * 500;

  let recommendedHP = "0 HP";
  let acCount = 0;

  if (totalBTU > 0) {
    if (totalBTU <= 9000) {
      recommendedHP = "1.0 HP";
      acCount = 1;
    } else if (totalBTU <= 12000) {
      recommendedHP = "1.5 HP";
      acCount = 1;
    } else if (totalBTU <= 18000) {
      recommendedHP = "2.0 HP";
      acCount = 1;
    } else if (totalBTU <= 24000) {
      recommendedHP = "2.5 HP";
      acCount = 1;
    } else {
      acCount = Math.ceil(totalBTU / 24000);
      recommendedHP = `${acCount} x 2.5 HP`;
    }
  }

  const unitPrice = parseFloat(price) || 0;
  const totalPriceUSD = acCount * unitPrice;
  const totalPriceKHR = totalPriceUSD * exchangeRate;

  useEffect(() => {
    const saveCalculation = async () => {
      const isInputComplete =
        length !== "" && parseFloat(length) > 0 &&
        width !== "" && parseFloat(width) > 0 &&
        people !== "" && parseInt(people) >= 0 &&
        price !== "" && parseFloat(price) > 0;

      if (isInputComplete && area > 0 && totalPriceUSD > 0) {
        try {
          const currentUser = auth.currentUser;
          let userRole = "guest";
          let userName = "Guest Account";
          let userEmail = "N/A";

          if (currentUser) {
            userEmail = currentUser.email || "N/A";
            userName = currentUser.displayName || currentUser.email.split("@")[0];

            const userDoc = await getDoc(doc(db, "users", currentUser.uid));
            if (userDoc.exists()) {
              userRole = userDoc.data().role || "user";
              if (userDoc.data().name) {
                userName = userDoc.data().name;
              }
            }
          }

          await addDoc(collection(db, "calculations"), {
            tool: "Air Calculator",
            type: "Air Conditioner Sizing",
            length: parseFloat(length),
            width: parseFloat(width),
            area: area,
            roomType: roomType,
            occupants: occupants,
            totalBTU: totalBTU,
            acCount: acCount,
            recommendedHP: recommendedHP,
            costUSD: totalPriceUSD,
            costKHR: totalPriceKHR,

            userId: currentUser ? currentUser.uid : "guest",
            userName: userName,
            userEmail: userEmail,
            userRole: userRole,

            createdAt: new Date().toISOString(),
            timestamp: serverTimestamp(),
          });
          console.log("Air calculation saved successfully!");
        } catch (error) {
          console.error("Error saving air calculation:", error);
        }
      }
    };

    const timer = setTimeout(() => {
      saveCalculation();
    }, 2000);

    return () => clearTimeout(timer);
  }, [
    length,
    width,
    roomType,
    people,
    price,
    area,
    totalBTU,
    acCount,
    totalPriceUSD,
    totalPriceKHR,
    recommendedHP,
    occupants,
  ]);

  return (
    <div className="pt-[90px] pb-12 px-4">
      <div className="max-w-[1000px] mx-auto mb-4">
        <Link
          to="/#service"
          className="border-2 border-white shadow-lg inline-flex 
          items-center gap-2 px-2 py-1 bg-blue-400 text-white hover:bg-gray-300 font-bold rounded-[10px] transition-all"
        >
          ← Back
        </Link>
      </div>
      <div className="text-center max-w-[800px] mx-auto">
        <h1 className="text-2xl sm:text-3xl font-adlam text-green-800">
          <u>Air Conditioner Calculator</u>
        </h1>
        <br />
        <p className="font-biorhyme text-sm sm:text-base">
          Please fill information below to calculate AC BTU sizing for your room.
        </p>
      </div>
      <br />
      <br />

      <div className="max-w-[800px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
          <div>
            <label className="font-inter font-bold">Enter Length (m)</label>
            <input
              type="number"
              placeholder="Your length"
              value={length}
              onChange={(e) => setlength(e.target.value)}
              className="border-2 border-black w-full h-[50px] rounded-[10px] p-3 mt-1"
            />
          </div>

          <div>
            <label className="font-inter font-bold">Enter Width (m)</label>
            <input
              type="number"
              placeholder="Your width"
              value={width}
              onChange={(e) => setwidth(e.target.value)}
              className="border-2 border-black w-full h-[50px] rounded-[10px] p-3 mt-1"
            />
          </div>

          <div>
            <label className="font-inter font-bold">Room Condition / Type</label>
            <select
              value={roomType}
              onChange={(e) => setroomType(Number(e.target.value))}
              className="h-[50px] w-full border-2 border-black rounded-[10px] font-bold font-inter px-3 mt-1"
            >
              <option value={600}>Normal Room / Bedroom (600 BTU/m²)</option>
              <option value={700}>Living Room / Office (700 BTU/m²)</option>
              <option value={800}>Sunny Room / Glass Walls (800 BTU/m²)</option>
            </select>
          </div>

          <div>
            <label className="font-inter font-bold">Number of Occupants</label>
            <input
              type="number"
              placeholder="e.g. 2"
              value={people}
              onChange={(e) => setpeople(e.target.value)}
              className="border-2 border-black w-full h-[50px] rounded-[10px] p-3 mt-1"
            />
          </div>
        </div>

        <br />

        <div className="flex flex-col items-center justify-center w-full mt-2">
          <div className="w-full sm:w-[50%]">
            <label className="font-inter font-bold block text-center sm:text-left">
              Price per AC Unit ($)
            </label>
            <input
              type="number"
              placeholder="e.g. 350"
              value={price}
              onChange={(e) => setprice(e.target.value)}
              className="border-2 border-black w-full h-[50px] rounded-[10px] p-3 mt-1 text-center sm:text-left"
            />
          </div>
        </div>

        <br />
        <br />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center bg-gray-300 p-5 rounded-[10px] border-2 border-white shadow-[0px_0px_10px_rgba(0,0,0,0.3)] w-full">
          <div>
            <h1 className="font-adlam text-xl sm:text-2xl text-blue-800">
              <u>Area</u>
            </h1>
            <p className="font-bold font-inter mt-1">
              <span className="text-green-800">
                {area} m<sup>2</sup>
              </span>
            </p>
          </div>

          <div>
            <h1 className="font-adlam text-xl sm:text-2xl text-blue-800">
              <u>Total BTU</u>
            </h1>
            <p className="font-bold font-inter mt-1">
              <span className="text-green-800"> {totalBTU.toLocaleString()} BTU</span>
            </p>
          </div>

          <div>
            <h1 className="font-adlam text-xl sm:text-2xl text-blue-800">
              <u>Total AC Units</u>
            </h1>
            <p className="font-bold font-inter mt-1">
              <span className="text-green-800">{acCount}</span> Unit
              <br />
              <span className="text-gray-700">({recommendedHP})</span>
            </p>
          </div>

          <div>
            <h1 className="font-adlam text-xl sm:text-2xl text-blue-800">
              <u>Total Cost</u>
            </h1>
            <div className="font-bold font-inter mt-1">
              <p className="text-red-700">{totalPriceUSD.toFixed(2)} $</p>
              <p className="text-green-800 text-sm">
                {totalPriceKHR.toLocaleString()} Riel
              </p>
            </div>
          </div>
        </div>

        <br />

        <div className="text-center py-4 border-t border-gray-400/40 w-full">
          <p className="text-gray-400 font-biorhyme text-xs sm:text-sm">
            2026 C-E-R. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Air_cal;