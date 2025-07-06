import React, { useState, useEffect } from "react";
import { IconCirclePlus } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { usePrivy } from "@privy-io/react-auth";
import { useStateContext } from "../../context/index";
import CreateRecordModal from "./components/create-record-modal";
import RecordCard from "./components/record-card";

const MedicalRecords = () => {
  const navigate = useNavigate();
  const { user } = usePrivy();
  const {
    records,
    fetchUserRecords,
    createRecord,
    fetchUserByEmail,
    createUser,
    currentUser,
    testDatabaseConnection,
  } = useStateContext();
  const [userRecords, setUserRecords] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      if (user && user.email?.address) {
        await fetchUserByEmail(user.email.address);
      }
      setLoading(false);
    };
    loadData();
  }, [user, fetchUserByEmail]);

  useEffect(() => {
    const ensureUser = async () => {
      if (user?.email?.address && currentUser === null) {
        const username =
          user.name ||
          user.displayName ||
          (user.email?.address ? user.email.address.split("@")[0] : "");
        await createUser({
          username,
          age: 0,
          location: "",
          folders: [],
          treatmentCounts: 0,
          folder: [],
          createdBy: user.email.address,
          cancerHistory: "no",
          screeningStatus: "never",
          cancerType: "",
        });
        await fetchUserByEmail(user.email.address);
      }
    };
    ensureUser();
  }, [user, currentUser, createUser, fetchUserByEmail]);

  useEffect(() => {
    const fetchRecords = async () => {
      if (user && user.email?.address) {
        await fetchUserRecords(user.email.address);
      }
    };
    fetchRecords();
  }, [user, fetchUserRecords, currentUser]);

  useEffect(() => {
    if (records) {
      const sorted = [...records].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setUserRecords(sorted);
    }
  }, [records]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleTestDatabase = async () => {
    const isConnected = await testDatabaseConnection();
    if (isConnected) {
      alert("Database connection successful!");
    } else {
      alert("Database connection failed! Check console for details.");
    }
  };

  const createFolder = async (foldername) => {
    try {
      setError(null);
      if (!currentUser) {
        setError("User not found. Please try again.");
        return;
      }
      
      console.log("Creating record with data:", {
        userId: currentUser.id,
        recordName: foldername,
        createdBy: user.email.address,
      });
      
      const newRecord = await createRecord({
        userId: currentUser.id,
        recordName: foldername,
        createdBy: user.email.address,
      });
      
      console.log("Record creation result:", newRecord);
      
      if (newRecord) {
        await fetchUserRecords(user.email.address);
        handleCloseModal();
      } else {
        setError("Failed to create folder. Please try again.");
      }
    } catch (e) {
      console.error("Error creating folder:", e);
      setError("Error creating folder: " + e.message);
      handleCloseModal();
    }
  };

  const handleNavigate = (name) => {
    const filteredRecords = userRecords.filter(
      (record) => record.recordName === name,
    );
    navigate(`/medical-records/${name}`, {
      state: filteredRecords[0],
    });
  };

  if (loading) {
    return (
      <div className="flex flex-wrap gap-[26px]">
        <div className="w-full flex justify-center items-center min-h-[400px]">
          <div className="text-white text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-[26px]">
      <button
        type="button"
        className="mt-6 inline-flex items-center gap-x-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-[#13131a] dark:text-white dark:hover:bg-neutral-800"
        onClick={handleOpenModal}
      >
        <IconCirclePlus />
        Create Record
      </button>

      <button
        type="button"
        className="mt-6 inline-flex items-center gap-x-2 rounded-full border border-gray-200 bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-600 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700"
        onClick={handleTestDatabase}
      >
        Test Database
      </button>

      <CreateRecordModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onCreate={createFolder}
      />

      {error && (
        <div className="w-full text-center text-red-400 mt-4">{error}</div>
      )}

      <div className="grid w-full gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {userRecords && userRecords.length > 0 ? (
          userRecords.map((record) => (
            <RecordCard
              key={record.recordName}
              record={record}
              onNavigate={handleNavigate}
              numFiles={record.files ? record.files.length : 0}
            />
          ))
        ) : (
          <div className="col-span-full flex justify-center items-center min-h-[200px]">
            <div className="text-white text-lg">No records found. Create your first record!</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalRecords; 
