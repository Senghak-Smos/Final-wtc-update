// 
import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

function Contact() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  const TELEGRAM_BOT_TOKEN = process.env.REACT_APP_TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.REACT_APP_TELEGRAM_CHAT_ID;

  useEffect(() => {
    window.scrollTo(0, 0);
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setFormData((prev) => ({
          ...prev,
          name: currentUser.displayName || currentUser.email.split("@")[0],
          email: currentUser.email || "",
        }));
      }
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setStatus("Please log in first to send a message.");
      return;
    }

    setStatus("Sending...");

    try {
      await addDoc(collection(db, "contacts"), {
        userName: formData.name,
        userEmail: formData.email,
        subject: formData.subject,
        description: formData.message,
        userId: user.uid,
        userRole: "user",
        createdAt: serverTimestamp(),
      });

      if (TELEGRAM_BOT_TOKEN && CHAT_ID) {
        const text = `New Contact Form Message:\nName: ${formData.name}\nEmail: ${formData.email}\nSubject: ${formData.subject}\nMessage: ${formData.message}`;
        await fetch(
          `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: CHAT_ID,
              text: text,
            }),
          }
        );
      }

      setStatus("Message sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
      setStatus("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen pt-[130px] px-4 pb-12 bg-gray-100">
      <div className="text-center mb-6">
        <h1 className="font-adlam text-center mb-2 text-4xl">
          <u>Contact Us</u>
        </h1>
        <p className="font-biorhyme text-gray-600">
          Everyone can fill information if you have any problems or ideas to
          upgrade this project. Thank you!
        </p>
      </div>
      <br />
      <div className="max-w-[500px] w-full mx-auto p-6 border-black rounded-[10px] bg-white shadow-[0px_0px_5px_rgba(0,0,0,0.4)]">
        
        {!user && (
          <div className="mb-4 p-3 text-center text-sm font-semibold text-red-700 bg-red-100 border border-red-400 rounded-[10px]">
            Please log in first to send a message!
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="font-inter font-bold">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Your name"
              required
              disabled={!user}
              value={formData.name}
              onChange={handleChange}
              className="border-2 border-black h-[45px] w-full rounded-[10px] p-2 mt-1 focus:outline-none focus:border-blue-600 disabled:bg-gray-200 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="font-inter font-bold">Email</label>
            <input
              type="email"
              name="email"
              placeholder="your@example.com"
              required
              disabled={!user}
              value={formData.email}
              onChange={handleChange}
              className="border-2 border-black h-[45px] w-full rounded-[10px] p-2 mt-1 focus:outline-none focus:border-blue-600 disabled:bg-gray-200 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="font-inter font-bold">Subject</label>
            <input
              type="text"
              name="subject"
              placeholder="Your suggestion"
              required
              disabled={!user}
              value={formData.subject}
              onChange={handleChange}
              className="border-2 border-black h-[45px] w-full rounded-[10px] p-2 mt-1 focus:outline-none focus:border-blue-600 disabled:bg-gray-200 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="font-inter font-bold">Message</label>
            <textarea
              name="message"
              required
              disabled={!user}
              placeholder="Description & Contact"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              className="border-2 border-black w-full rounded-[10px] p-2 mt-1 focus:outline-none focus:border-blue-600 disabled:bg-gray-200 disabled:cursor-not-allowed"
            />
          </div>

          <button
            type="submit"
            disabled={!user}
            className={`border-2 border-black h-[45px] w-full rounded-[10px] font-bold transition duration-200 ${
              user
                ? "bg-blue-600 text-white hover:bg-green-500 cursor-pointer"
                : "bg-gray-400 text-gray-700 cursor-not-allowed"
            }`}
          >
            {user ? "Send Message" : "Please Login to Send Message"}
          </button>

          {status && (
            <div className="mt-2 p-2 text-center text-sm font-semibold rounded bg-gray-200 border border-black">
              {status}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Contact;