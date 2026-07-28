import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [calculations, setCalculations] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("Admin");
  const [activeTab, setActiveTab] = useState("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError("");

    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUserEmail(currentUser.email);
        setUserName(currentUser.displayName || currentUser.email.split("@")[0]);
      } else {
        setUserEmail("Guest");
      }
    });

    const unsubUsers = onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        const userList = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        setUsers(userList);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching users:", err);
        setError("Failed to fetch dashboard data.");
        setLoading(false);
      },
    );

    const unsubCalcs = onSnapshot(
      collection(db, "calculations"),
      (snapshot) => {
        const calcList = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        setCalculations(calcList);
      },
      (err) => console.error("Error fetching calculations:", err),
    );

    const unsubContacts = onSnapshot(
      collection(db, "contacts"),
      (snapshot) => {
        const contactList = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        setContacts(contactList);
      },
      (err) => console.error("Error fetching contacts:", err),
    );

    return () => {
      unsubAuth();
      unsubUsers();
      unsubCalcs();
      unsubContacts();
    };
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { role: newRole });
    } catch (err) {
      console.error("Error updating role:", err);
      alert("Failed to update user role.");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (
      window.confirm("Are you sure you want to delete this account record?")
    ) {
      try {
        await deleteDoc(doc(db, "users", userId));
      } catch (err) {
        console.error("Error deleting user:", err);
        alert("Failed to delete user record.");
      }
    }
  };

  const handleDeleteCalc = async (calcId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this calculation history?",
      )
    ) {
      try {
        await deleteDoc(doc(db, "calculations", calcId));
      } catch (err) {
        console.error("Error deleting calculation:", err);
        alert("Failed to delete calculation.");
      }
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        await deleteDoc(doc(db, "contacts", contactId));
      } catch (err) {
        console.error("Error deleting contact message:", err);
        alert("Failed to delete contact message.");
      }
    }
  };

  const formatDate = (dateField) => {
    if (!dateField) return "N/A";
    if (dateField.toDate) return dateField.toDate().toLocaleDateString();
    return new Date(dateField).toLocaleDateString();
  };

  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === "admin").length;
  const userCount = users.filter((u) => u.role === "user" || !u.role).length;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-inter">
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 shrink-0">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-700 hover:text-blue-600 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
          <span className="font-bold text-lg text-blue-600 truncate">
            C-E-R
          </span>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <span className="text-xs sm:text-sm text-gray-600 hidden sm:inline">
            {userEmail}
          </span>
          <button
            onClick={() => auth.signOut()}
            className="bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition"
          >
            Sign Out
          </button>
        </div>
      </header>

      <div className="flex flex-1 relative">
        {isMobileMenuOpen && (
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
          ></div>
        )}

        <aside
          className={`
          absolute md:relative inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out shrink-0
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
        >
          <div className="p-4 overflow-y-auto flex-1">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-3">
              ADMIN MANAGEMENT
            </h3>
            <nav className="flex flex-col space-y-1">
              <button
                onClick={() => {
                  setActiveTab("overview");
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  activeTab === "overview"
                    ? "bg-blue-600 text-white font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  setActiveTab("calculations");
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  activeTab === "calculations"
                    ? "bg-blue-600 text-white font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Projects Overview ({calculations.length})
              </button>
              <button
                onClick={() => {
                  setActiveTab("users");
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  activeTab === "users"
                    ? "bg-blue-600 text-white font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                User Management ({users.length})
              </button>
              <button
                onClick={() => {
                  setActiveTab("messages");
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  activeTab === "messages"
                    ? "bg-blue-600 text-white font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                User Management ({contacts.length})
              </button>
            </nav>
          </div>

          <div className="p-4 border-t border-gray-200 flex items-center space-x-3 bg-white shrink-0 mt-auto">
            <div className="w-9 h-9 bg-blue-500 text-white font-bold rounded-full flex items-center justify-center text-sm shrink-0">
              {userName ? userName.charAt(0).toUpperCase() : "H"}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-gray-900 truncate">
                {userEmail}
              </p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
        </aside>

        <main className="flex-1 p-4 sm:p-6 md:p-8 min-w-0 bg-gray-50 flex flex-col justify-between">
          <div>
            <div className="mb-6 sm:mb-8">
              <h1 className="font-adlam text-xl sm:text-2xl text-gray-900">
                Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Welcome back,{" "}
                <span className="text-blue-600 font-medium">{userEmail}</span>
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6 sm:mb-8">
              <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm">
                <h3 className="text-xs font-bold text-gray-400 uppercase">
                  TOTAL ACCOUNTS
                </h3>
                <p className="text-2xl sm:text-3xl font-extrabold text-blue-600 mt-2">
                  {loading ? "..." : totalUsers}
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm">
                <h3 className="text-xs font-bold text-gray-400 uppercase">
                  ADMINS
                </h3>
                <p className="text-2xl sm:text-3xl font-extrabold text-green-600 mt-2">
                  {loading ? "..." : adminCount}
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm">
                <h3 className="text-xs font-bold text-gray-400 uppercase">
                  USERS
                </h3>
                <p className="text-2xl sm:text-3xl font-extrabold text-red-500 mt-2">
                  {loading ? "..." : userCount}
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm">
                <h3 className="text-xs font-bold text-gray-400 uppercase">
                  Project Overview
                </h3>
                <p className="text-2xl sm:text-3xl font-extrabold text-yellow-600 mt-2">
                  {loading ? "..." : calculations.length}
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm">
                <h3 className="text-xs font-bold text-gray-400 uppercase">
                  USER MESSAGES
                </h3>
                <p className="text-2xl sm:text-3xl font-extrabold text-orange-400 mt-2">
                  {loading ? "..." : contacts.length}
                </p>
              </div>
            </div>

            {error && (
              <div className="p-4 mb-6 bg-red-100 text-red-700 text-center font-semibold rounded-lg border border-red-200 text-sm">
                {error}
              </div>
            )}

            {(activeTab === "overview" || activeTab === "calculations") && (
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-8">
                <div className="p-4 sm:p-5 border-b border-gray-200">
                  <h2 className="text-blue-700 text-base sm:text-lg font-bold text-gray-800">
                    Projects Overview (<span className="text-yellow-600">{calculations.length}</span>)
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold text-xs uppercase">
                        <th className="p-3 sm:p-4">Date</th>
                        <th className="p-3 sm:p-4">User</th>
                        <th className="p-3 sm:p-4">Type</th>
                        <th className="p-3 sm:p-4">Dimensions & Details</th>
                        <th className="p-3 sm:p-4">Estimated Cost</th>
                        <th className="p-3 sm:p-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-sm">
                      {loading ? (
                        <tr>
                          <td
                            colSpan="6"
                            className="p-6 text-center text-gray-500"
                          >
                            Loading...
                          </td>
                        </tr>
                      ) : calculations.length === 0 ? (
                        <tr>
                          <td
                            colSpan="6"
                            className="p-6 text-center text-gray-500"
                          >
                            No project calculations found.
                          </td>
                        </tr>
                      ) : (
                        calculations.map((calc) => (
                          <tr key={calc.id} className="hover:bg-gray-50">
                            <td className="p-3 sm:p-4 text-gray-500 text-xs">
                              {formatDate(calc.createdAt || calc.date)}
                            </td>
                            <td className="p-3 sm:p-4">
                              <p className="font-medium text-gray-900">
                                {calc.userName || "N/A"}
                              </p>
                              <p className="text-xs text-gray-500">
                                {calc.userEmail || "No Email"}
                              </p>
                            </td>
                            <td className="p-3 sm:p-4">
                              <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase">
                                {calc.tool || calc.type || "Calculator"}
                              </span>
                            </td>
                            <td className="p-3 sm:p-4 text-gray-600 text-xs space-y-1">
                              <p>
                                <span className="font-semibold">Size:</span>{" "}
                                {calc.length || 0}m × {calc.width || 0}m (
                                {calc.area || 0} m²)
                              </p>
                              <p>
                                <span className="font-semibold">Lighting:</span>{" "}
                                {calc.roomlux || 0} Lux | {calc.buluCount || 0}{" "}
                                Bulbs ({calc.bulwatt || 0}W)
                              </p>
                            </td>
                            <td className="p-3 sm:p-4">
                              <p className="font-bold text-green-600 text-xs">
                                ${calc.costUSD || 0}
                              </p>
                              <p className="text-gray-500 text-xs">
                                {calc.costKHR || 0} Riels
                              </p>
                            </td>
                            <td className="p-3 sm:p-4 text-center">
                              <button
                                onClick={() => handleDeleteCalc(calc.id)}
                                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold"
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
            )}

            {(activeTab === "overview" || activeTab === "messages") && (
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-8">
                <div className="p-4 sm:p-5 border-b border-gray-200">
                  <h2 className="text-blue-700 text-base sm:text-lg font-bold text-gray-800">
                    User Messages (<span className="text-orange-400">{contacts.length}</span>)
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold text-xs uppercase">
                        <th className="p-3 sm:p-4">Date</th>
                        <th className="p-3 sm:p-4">name</th>
                        <th className="p-3 sm:p-4">Email</th>
                        <th className="p-3 sm:p-4">Subject</th>
                        <th className="p-3 sm:p-4">Description</th>
                        <th className="p-3 sm:p-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-sm">
                      {loading ? (
                        <tr>
                          <td
                            colSpan="5"
                            className="p-6 text-center text-gray-500"
                          >
                            Loading...
                          </td>
                        </tr>
                      ) : contacts.length === 0 ? (
                        <tr>
                          <td
                            colSpan="5"
                            className="p-6 text-center text-gray-500"
                          >
                            No messages found.
                          </td>
                        </tr>
                      ) : (
                        contacts.map((msg) => (
                          <tr key={msg.id} className="hover:bg-gray-50">
                            <td className="p-3 sm:p-4 text-gray-500 text-xs">
                              {formatDate(msg.createdAt)}
                            </td>
                            <td className="p-3 sm:p-4 font-medium text-gray-900">
                              {msg.userName || msg.name || "Guest"}
                            </td>
                            <td className="p-3 sm:p-4 font-medium text-gray-900">
                              {msg.userEmail || msg.email || "N/A"}
                            </td>
                            <td className="p-3 sm:p-4 text-blue-600 font-medium">
                              {msg.subject}
                            </td>
                            <td className="p-3 sm:p-4 text-gray-600">
                              {msg.description}
                            </td>
                            <td className="p-3 sm:p-4 text-center">
                              <button
                                onClick={() => handleDeleteContact(msg.id)}
                                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold"
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
            )}

            {(activeTab === "overview" || activeTab === "users") && (
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-8">
                <div className="p-4 sm:p-5 border-b border-gray-200">
                  <h2 className="text-blue-700 text-base sm:text-lg font-bold text-gray-800">
                    User Management (<span className="text-red-700">{users.length}</span>)
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold text-xs uppercase">
                        <th className="p-3 sm:p-4">Name</th>
                        <th className="p-3 sm:p-4">Email</th>
                        <th className="p-3 sm:p-4">Joined Date</th>
                        <th className="p-3 sm:p-4">Role</th>
                        <th className="p-3 sm:p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-sm">
                      {users.map((u) => (
                        <tr key={u.id} className="hover:bg-gray-50">
                          <td className="p-3 sm:p-4 font-medium text-gray-900">
                            {u.name || "N/A"}
                          </td>
                          <td className="p-3 sm:p-4 text-gray-600">
                            {u.email}
                          </td>
                          <td className="p-3 sm:p-4 text-gray-500 text-xs">
                            {formatDate(u.createdAt || u.lastLogin)}
                          </td>
                          <td className="p-3 sm:p-4">
                            <select
                              value={u.role || "user"}
                              onChange={(e) =>
                                handleRoleChange(u.id, e.target.value)
                              }
                              className="px-2 py-1 bg-blue-200 border rounded text-xs font-semibold bg-gray-50"
                            >
                              <option value="user" className="bg-gray-200">user</option>
                              <option value="admin" className="bg-gray-200">admin</option>
                            </select>
                          </td>
                          <td className="p-3 sm:p-4 text-center">
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          <footer className="w-full border-t border-gray-200 py-4 text-center text-xs text-gray-500 mt-auto shrink-0">
            © My react. All rights reserved.
          </footer>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
