import React, { useState } from "react";

export default function SettingsForm() {
  const [form, setForm] = useState({
    name: "",
    address: "",
    bio: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Info:", form);
    alert("Settings updated successfully!");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Settings</h2>

        <label className="block mb-2">Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded-lg"
          placeholder="Enter your name"
        />

        <label className="block mb-2">Address</label>
        <input
          type="text"
          name="address"
          value={form.address}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded-lg"
          placeholder="Enter your address"
        />

        <label className="block mb-2">Bio</label>
        <textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded-lg"
          placeholder="Write something about yourself..."
        />

        <label className="block mb-2">Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded-lg"
          placeholder="Enter new password"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
