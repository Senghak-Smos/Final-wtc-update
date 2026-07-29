import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";

function Lighting() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [length, setlength] = useState("");
  const [width, setwidth] = useState("");
  const [roomlux, setroomlux] = useState(150);
  const [bulwatt, setbulwatt] = useState(9);
  const [price, setprice] = useState("");
  const exchangeRate = 4100;

  const area = (parseFloat(length) || 0) * (parseFloat(width) || 0);
  const lumenPerBulb = bulwatt * 85;
  const totalLumen = area * roomlux;

  const buluCount = area > 0 ? Math.ceil(totalLumen / lumenPerBulb) : 0;

  const unitPrice = parseFloat(price) || 0;
  const totalPriceUSD = buluCount * unitPrice;
  const totalPriceKHR = totalPriceUSD * exchangeRate;

  useEffect(() => {
    const saveCalculation = async () => {
      const isInputComplete =
        length !== "" && parseFloat(length) > 0 &&
        width !== "" && parseFloat(width) > 0 &&
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
            tool: "Lighting Calculator",
            type: "Lighting Requirement",
            length: parseFloat(length),
            width: parseFloat(width),
            area: area,
            roomlux: roomlux,
            bulwatt: bulwatt,
            buluCount: buluCount,
            costUSD: totalPriceUSD,
            costKHR: totalPriceKHR,

            userId: currentUser ? currentUser.uid : "guest",
            userName: userName,
            userEmail: userEmail,
            userRole: userRole,

            createdAt: new Date().toISOString(),
            timestamp: serverTimestamp(),
          });

          console.log("Lighting calculation saved successfully!");
        } catch (error) {
          console.error("Error saving calculation:", error);
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
    roomlux,
    bulwatt,
    price,
    area,
    buluCount,
    totalPriceUSD,
    totalPriceKHR,
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
          <u>Lighting Calculator</u>
        </h1>
        <br />
        <p className="font-biorhyme text-sm sm:text-base">
          Please fill information below to calculate lighting on your room.
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
            <label className="font-inter font-bold">Choosing your room</label>
            <select
              value={roomlux}
              onChange={(e) => setroomlux(Number(e.target.value))}
              className="h-[50px] w-full border-2 border-black rounded-[10px] font-bold font-inter px-3 mt-1"
            >
              <option value={150}>Bedroom - (150lux)</option>
              <option value={200}>Living room - (200lux)</option>
              <option value={300}>Office/Study room - (300lux)</option>
            </select>
          </div>

          <div>
            <label className="font-bold font-inter">Type lighting using (Watt)</label>
            <select
              value={bulwatt}
              onChange={(e) => setbulwatt(Number(e.target.value))}
              className="h-[50px] w-full border-2 border-black rounded-[10px] font-bold font-inter px-3 mt-1"
            >
              <option value={9}>9w LED (~765 lumens)</option>
              <option value={12}>12w LED (~1020 lumens)</option>
              <option value={18}>18w LED (~1530 lumens)</option>
            </select>
          </div>
        </div>

        <br />

        <div className="flex flex-col items-center justify-center w-full mt-2">
          <div className="w-full sm:w-[50%]">
            <label className="font-inter font-bold block text-center sm:text-left">
              Price per Bulb ($)
            </label>
            <input
              type="number"
              placeholder="e.g. 2.5"
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
              <u>Result</u>
            </h1>
            <p className="font-bold font-inter mt-1">
              Area:
              <span className="text-green-800">
                {" "}
                {area} m<sup>2</sup>
              </span>
            </p>
          </div>

          <div>
            <h1 className="font-adlam text-xl sm:text-2xl text-blue-800">
              <u>Total lumens</u>
            </h1>
            <p className="font-bold font-inter mt-1">
              Lighting:
              <span className="text-green-800"> {totalLumen} lm</span>
            </p>
          </div>

          <div>
            <h1 className="font-adlam text-xl sm:text-2xl text-blue-800">
              <u>Total bulbs </u>
            </h1>
            <p className="font-bold font-inter mt-1">
              <span className="text-green-800">{buluCount} </span>Bulbs (
              <span className="text-green-800"> {bulwatt}w </span>)
            </p>
          </div>

          <div>
            <h1 className="font-adlam text-xl sm:text-2xl text-blue-800">
              <u>Total Cost </u>
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

export default Lighting;