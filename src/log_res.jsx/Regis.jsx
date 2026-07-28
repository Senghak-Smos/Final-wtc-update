import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const ADMIN_EMAILS = ["admin@cer.com"];

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setpass] = useState("");
  const [showpass, setshowpass] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (pass.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const user = userCredential.user;

      const userRole = ADMIN_EMAILS.includes(email.toLowerCase()) ? "admin" : "user";

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        email: email,
        role: userRole,
        createdAt: new Date().toISOString(),
      });

      navigate("/");
    } catch (err) {
      console.error("Register error:", err.code);

      if (err.code === "auth/email-already-in-use") {
        setError("This email address is already in use!");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else {
        setError("Failed to create account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen pt-[110px]">
      <div className="flex-grow px-4 pb-12">
        <div className="grid grid-cols-1 max-w-[500px] w-full p-5 sm:p-8 justify-center items-center mx-auto border-2 border-white rounded-[10px] shadow-[0px_0px_10px_rgba(0,0,0,0.3)] bg-white">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-adlam">Welcome to C-E-R</h1>
            <p className="font-biorhyme mt-1">Register your account now!</p>
          </div>
          <br />

          <form onSubmit={handleRegister} className="flex flex-col w-full max-w-[400px] mx-auto">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-[10px] text-sm text-center mb-4 font-inter font-semibold">
                {error}
              </div>
            )}

            <label className="font-inter font-bold">Enter name</label>
            <input
              type="text"
              required
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-2 border-black h-[50px] w-full rounded-[10px] p-2 font-inter mt-1 focus:outline-none focus:border-blue-600"
            />
            <br />

            <label className="font-inter font-bold">Email Address</label>
            <input
              type="email"
              required
              placeholder="your@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-2 border-black h-[50px] w-full rounded-[10px] p-2 font-inter mt-1 focus:outline-none focus:border-blue-600"
            />
            <br />

            <label className="font-inter font-bold">Password</label>
            <input
              type={showpass ? "text" : "password"}
              required
              placeholder="Your password"
              value={pass}
              onChange={(e) => setpass(e.target.value)}
              className="border-2 border-black h-[50px] w-full rounded-[10px] p-2 font-inter  mt-1 focus:outline-none focus:border-blue-600"
            />

            <div className="flex items-center mt-2 cursor-pointer">
              <input
                type="checkbox"
                id="showpass-register"
                checked={showpass}
                onChange={(e) => setshowpass(e.target.checked)}
                className="w-4 h-4 border-2 border-black cursor-pointer"
              />
              <label htmlFor="showpass-register" className="px-2 text-gray-500 font-inter select-none cursor-pointer">
                Show password
              </label>
            </div>
            <br />

            <button
              type="submit"
              disabled={loading}
              className="border-2 border-black h-[45px] w-full rounded-[10px] bg-blue-600 text-white font-bold hover:bg-green-500 transition duration-200 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
          <br />

          <div className="text-center">
            <p className="font-inter">
              Already have an account?{" "}
              <Link to="/login">
                <span className="text-green-700 font-bold cursor-pointer hover:underline">
                  Login Now!
                </span>
              </Link>
            </p>
          </div>
        </div>
      </div>

      <footer className="w-full bg-gray-300 py-4 border-t border-gray-400/40 text-center mt-auto">
        <p className="text-gray-700 font-biorhyme text-xs sm:text-sm">
          2026 C-E-R. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default Register;