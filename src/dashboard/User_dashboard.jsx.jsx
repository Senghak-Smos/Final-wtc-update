import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

function UserDashboard() {
  const exchangeRate = 4100;
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    let unsubscribeSnapshot = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUserEmail(currentUser.email);
        setLoading(true);
        setErrorMsg("");

        const q = query(
          collection(db, "calculations"),
          where("userId", "==", currentUser.uid)
        );

        unsubscribeSnapshot = onSnapshot(
          q,
          (querySnapshot) => {
            const data = querySnapshot.docs.map((docSnap) => ({
              id: docSnap.id,
              ...docSnap.data(),
            }));
            setHistory(data);
            setLoading(false);
          },
          (error) => {
            console.error("Error fetching data: ", error);
            setErrorMsg(error.message);
            setLoading(false);
          }
        );
      } else {
        setUserEmail("");
        setHistory([]);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this saved calculation?")) {
      try {
        await deleteDoc(doc(db, "calculations", id));
        setHistory((prevHistory) => prevHistory.filter((item) => item.id !== id));
      } catch (error) {
        console.error("Error deleting document: ", error);
        alert("Failed to delete: " + error.message);
      }
    }
  };

  const totalSavedCalculations = history.length;

  const totalCostUSD = history.reduce((sum, item) => {
    const val = Number(item.costUSD) || Number(item.cost) || 0;
    return sum + val;
  }, 0);

  const totalCostKHR = history.reduce((sum, item) => {
    const val = Number(item.costKHR) || (Number(item.costUSD || 0) * exchangeRate);
    return sum + val;
  }, 0);

  const getAutoLogo = () => {
    if (!userEmail) return "C-E-R";
    const firstChar = userEmail.charAt(0).toUpperCase();
    return firstChar;
  };

  if (loading) {
    return (
      <div className="pt-36 text-center font-bold text-slate-600 min-h-screen bg-gray-100">
        Loading your calculations from Firebase...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-100 pt-28 pb-16 px-4 sm:px-8 font-inter">
      <div className="max-w-[1280px] mx-auto">
        
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md text-center font-bold">
            Firestore Error: {errorMsg} <br />
            <span className="text-sm font-normal">
              (Please check your Firestore Security Rules to ensure Read permission is enabled)
            </span>
          </div>
        )}

        <div className="flex flex-col border-2 border-black p-4 rounded-[10px] sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 bg-white shadow-[0px_0px_10px_rgba(0,0,0,0.1)]">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 font-adlam">
              Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Welcome back, <span className="font-semibold text-blue-600">{userEmail || "Guest"}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 bg-blue-500 px-4 py-2 rounded-full w-30 shadow-md">
            <span className="text-xl font-adlam text-white">
              {getAutoLogo()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border-2 border-black rounded-[10px] p-5 shadow-[0px_0px_10px_rgba(0,0,0,0.1)]">
            <h3 className="text-xs font-bold text-gray-500 uppercase">Total Saved</h3>
            <p className="text-3xl font-extrabold text-blue-600 mt-2">
              {totalSavedCalculations}
            </p>
          </div>

          <div className="bg-white border-2 border-black rounded-[10px] p-5 shadow-[0px_0px_10px_rgba(0,0,0,0.1)]">
            <h3 className="text-xs font-bold text-gray-500 uppercase">Total Cost ($)</h3>
            <p className="text-3xl font-extrabold text-red-600 mt-2">
              ${totalCostUSD.toFixed(2)}
            </p>
          </div>

          <div className="bg-white border-2 border-black rounded-[10px] p-5 shadow-[0px_0px_10px_rgba(0,0,0,0.1)]">
            <h3 className="text-xs font-bold text-gray-500 uppercase">Total Cost (KHR)</h3>
            <p className="text-3xl font-extrabold text-green-600 mt-2">
              {totalCostKHR.toLocaleString()} Riel
            </p>
          </div>
        </div>

        <div className="bg-white border-2 border-black rounded-[10px] shadow-[0px_0px_10px_rgba(0,0,0,0.1)] overflow-hidden">
          <div className="p-5 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 font-adlam">Calculation History</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-black text-gray-700 font-bold text-sm">
                  <th className="p-4">Type</th>
                  <th className="p-4">Dimensions / Space</th>
                  <th className="p-4">Equipment Required</th>
                  <th className="p-4">Total Cost ($)</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {history.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500 font-medium">
                      No calculations saved yet. Try using the Calculators!
                    </td>
                  </tr>
                ) : (
                  history.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="p-4 font-bold text-blue-800">
                        {item.type || item.tool || "Calculation"}
                      </td>

                      <td className="p-4 text-gray-700">
                        {item.area ? (
                          <>
                            {item.area} m² {item.length && item.width ? `(${item.length}m × ${item.width}m)` : ""}
                          </>
                        ) : item.watt ? (
                          `Power Load: ${item.watt} W`
                        ) : (
                          "N/A"
                        )}
                      </td>

                      <td className="p-4 font-semibold text-gray-800">
                        {item.acCount !== undefined && (
                          <span>
                            {item.acCount} Unit{item.acCount > 1 ? "s" : ""} ({item.recommendedHP})
                          </span>
                        )}

                        {item.quantity !== undefined && item.fanType && (
                          <span>
                            {item.quantity} Fan{item.quantity > 1 ? "s" : ""}
                          </span>
                        )}

                        {item.buluCount !== undefined && (
                          <span>
                            {item.buluCount} Bulb{item.buluCount > 1 ? "s" : ""} {item.bulwatt ? `(${item.bulwatt}W)` : ""}
                          </span>
                        )}

                        {item.wireSize && (
                          <span>
                            Wire: {item.wireSize} | Breaker: {item.breaker}
                          </span>
                        )}
                      </td>

                      <td className="p-4 font-bold text-red-600">
                        ${Number(item.costUSD || item.cost || 0).toFixed(2)}
                      </td>

                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="px-3 py-1 text-xs font-bold text-white bg-red-600 hover:bg-red-700 border border-black rounded-[6px] transition cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

export default UserDashboard;