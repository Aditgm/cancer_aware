import React, { useEffect, useState } from "react";
import { useStateContext } from "../context";
import { usePrivy } from "@privy-io/react-auth";

const Profile = () => {
  const { currentUser, fetchUserByEmail, updateUser } = useStateContext();
  const { user } = usePrivy();
  const [form, setForm] = useState({ username: "", age: "", location: "" });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      fetchUserByEmail(user?.email?.address);
    } else {
      setForm({
        username: currentUser.username || "",
        age: currentUser.age || "",
        location: currentUser.location || "",
      });
    }
  }, [currentUser, fetchUserByEmail, user]);

  const isIncomplete = !currentUser || !currentUser.username || !currentUser.age || !currentUser.location;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await updateUser(currentUser.id, {
      username: form.username,
      age: Number(form.age),
      location: form.location,
    });
    setLoading(false);
    setEditing(false);
  };

  if (!currentUser) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg text-gray-500">Loading...</div>
      </div>
    );
  }

  if (isIncomplete || editing) {
    return (
      <div className="mx-auto mt-16 max-w-lg rounded-lg bg-[#1c1c24] p-6 shadow-lg">
        <div className="flex flex-col items-center">
          <p className="mb-4 flex h-20 w-20 flex-row items-center justify-center rounded-full bg-[#0092F3]">
            <span className="text-6xl">😊</span>
          </p>
          <h1 className="mb-2 text-3xl font-semibold text-white">Complete Your Profile</h1>
          <form className="mt-4 w-full" onSubmit={handleSubmit}>
            <label className="mb-1 text-sm text-gray-400">Username:</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              className="mb-4 w-full rounded-lg bg-neutral-900 px-4 py-3 text-white focus:border-blue-600 focus:outline-none"
            />
            <label className="mb-1 text-sm text-gray-400">Age:</label>
            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              required
              className="mb-4 w-full rounded-lg bg-neutral-900 px-4 py-3 text-white focus:border-blue-600 focus:outline-none"
            />
            <label className="mb-1 text-sm text-gray-400">Location:</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              className="mb-4 w-full rounded-lg bg-neutral-900 px-4 py-3 text-white focus:border-blue-600 focus:outline-none"
            />
            <button
              type="submit"
              className="w-full rounded-lg bg-[#1dc071] py-3 font-semibold text-white hover:bg-[#16a34a] transition"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-16 max-w-lg rounded-lg bg-[#1c1c24] p-6 shadow-lg">
      <div className="flex flex-col items-center">
        <p className="mb-4 flex h-20 w-20 flex-row items-center justify-center rounded-full bg-[#0092F3]">
          <span className="text-6xl">😊</span>
        </p>
        <h1 className="mb-2 text-3xl font-semibold text-white">User Profile</h1>
        <div className="mt-4 w-full">
          <p className="mb-1 text-sm text-gray-400">Email:</p>
          <p className="mb-4 text-lg font-semibold text-white">
            {currentUser.createdBy}
          </p>

          <p className="mb-1 text-sm text-gray-400">Username:</p>
          <p className="mb-4 text-lg font-semibold text-white">
            {currentUser.username}
          </p>

          <p className="mb-1 text-sm text-gray-400">Age:</p>
          <p className="mb-4 text-lg font-semibold text-white">
            {currentUser.age}
          </p>

          <p className="mb-1 text-sm text-gray-400">Location:</p>
          <p className="text-lg font-semibold text-white">
            {currentUser.location}
          </p>
        </div>
        <button
          className="mt-6 rounded-lg bg-[#8c6dfd] px-6 py-2 font-semibold text-white hover:bg-[#6d4ad1] transition"
          onClick={() => setEditing(true)}
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;
