import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";

function Wir_cal() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [powerwatt, setpowerwatt] = useState("");
  const [wirePrice, setwirePrice] = useState("");
  const [breakerPrice, setbreakerPrice] = useState("");

  const exchangeRate = 4100;

  const watt = parseFloat(powerwatt) || 0;
  const currentAmp = watt / (220 * 0.85);
  const safeAmp = currentAmp * 1.25;

  const getwire = (amp) => {
    if (amp === 0) return { size: "0", breaker: "0" };
    if (amp <= 10) return { size: "1.5 mm²", breaker: "10A - 16A" };
    if (amp <= 16) return { size: "2.5 mm²", breaker: "16A - 20A" };
    if (amp <= 25) return { size: "4.0 mm²", breaker: "25A - 32A" };
    if (amp <= 35) return { size: "6.0 mm²", breaker: "40A" };
    return { size: "10.0 mm² or Large", breaker: "50A+" };
  };

  const result = getwire(safeAmp);

  const priceWire = parseFloat(wirePrice) || 0;
  const priceBreaker = parseFloat(breakerPrice) || 0;

  const totalPriceUSD = priceWire + priceBreaker;
  const totalPriceKHR = totalPriceUSD * exchangeRate;

  useEffect(() => {
    const saveData = async () => {
      const isInputComplete =
        powerwatt !== "" && parseFloat(powerwatt) > 0 &&
        wirePrice !== "" && parseFloat(wirePrice) > 0 &&
        breakerPrice !== "" && parseFloat(breakerPrice) > 0;

      if (isInputComplete && watt > 0 && totalPriceUSD > 0) {
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
            tool: "Wire Size Calculator",
            type: "Wire Length & Size",
            watt: watt,
            wireSize: result.size,
            breaker: result.breaker,
            costUSD: totalPriceUSD,
            costKHR: totalPriceKHR,

            userId: currentUser ? currentUser.uid : "guest",
            userName: userName,
            userEmail: userEmail,
            userRole: userRole,

            createdAt: new Date().toISOString(),
            timestamp: serverTimestamp(),
          });
          console.log("Wire calculation saved successfully!");
        } catch (error) {
          console.error("Error saving wire calculation:", error);
        }
      }
    };

    const timer = setTimeout(() => {
      saveData();
    }, 2000);

    return () => clearTimeout(timer);
  }, [powerwatt, wirePrice, breakerPrice, watt, result.size, result.breaker, totalPriceUSD, totalPriceKHR]);

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
          <u>Wire Size Calculator</u>
        </h1>
        <br />
        <p className="font-biorhyme text-sm sm:text-base">
          Please fill information below to calculate wire size and breaker on
          your room.
        </p>
      </div>
      <br />
      <br />

      <div className="max-w-[1000px] mx-auto flex flex-col items-center">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
          <div>
            <label className="font-inter font-bold block">Power load (W)</label>
            <input
              type="number"
              placeholder="e.g. 1500"
              value={powerwatt}
              onChange={(e) => setpowerwatt(e.target.value)}
              className="font-bold border-2 border-black w-full h-[50px] rounded-[10px] p-3 mt-1"
            />
            <span className="text-[11px] text-gray-500 block mt-1">
              Ex: Light=100W, AC=1500W
            </span>
          </div>

          <div>
            <label className="font-inter font-bold block">
              Est. Wire Price ($)
            </label>
            <input
              type="number"
              placeholder="e.g. 15"
              value={wirePrice}
              onChange={(e) => setwirePrice(e.target.value)}
              className="font-bold border-2 border-black w-full h-[50px] rounded-[10px] p-3 mt-1"
            />
          </div>

          <div>
            <label className="font-inter font-bold block">
              Est. Breaker Price ($)
            </label>
            <input
              type="number"
              placeholder="e.g. 5"
              value={breakerPrice}
              onChange={(e) => setbreakerPrice(e.target.value)}
              className="font-bold border-2 border-black w-full h-[50px] rounded-[10px] p-3 mt-1"
            />
          </div>
        </div>

        <br />
        <br />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center bg-gray-300 p-5 rounded-[10px] border-2 border-white shadow-[0px_0px_10px_rgba(0,0,0,0.3)] w-full">
          <div>
            <h1 className="font-adlam text-xl sm:text-2xl text-blue-800">
              <u>Current Result</u>
            </h1>
            <br />
            <div className="space-y-2">
              <p className="font-bold font-inter text-sm">
                Calculated Current
                <span className="text-green-800 block text-base">
                  {currentAmp.toFixed(2)} A
                </span>
              </p>
              <p className="font-bold font-inter text-sm">
                Safety Current (+25%)
                <span className="text-green-800 block text-base">
                  {safeAmp.toFixed(2)} A
                </span>
              </p>
            </div>
          </div>

          <div>
            <h1 className="font-adlam text-xl sm:text-2xl text-blue-800">
              <u>Wire & Breaker</u>
            </h1>
            <br />
            <div className="space-y-2">
              <p className="font-bold font-inter text-sm">
                Recommended Wire
                <span className="text-green-800 block text-base">
                  {result.size}
                </span>
              </p>
              <p className="font-bold font-inter text-sm">
                Recommended Breaker
                <span className="text-green-800 block text-base">
                  {result.breaker}
                </span>
              </p>
            </div>
          </div>

          <div>
            <h1 className="font-adlam text-xl sm:text-2xl text-blue-800">
              <u>Total Cost</u>
            </h1>
            <br />
            <div className="font-bold font-inter">
              <p className="text-red-700 text-lg">
                {totalPriceUSD.toFixed(2)} $
              </p>
              <p className="text-green-800 text-sm mt-1">
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

export default Wir_cal;