/* eslint-disable no-unused-vars */
// src/pages/SeatSelection.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const SeatSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();

  const journey = location.state?.journey || {};
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [error, setError] = useState("");
  const [seatCount, setSeatCount] = useState(0);

  const passengers = location.state?.passengers || 1;

  useEffect(() => {
    const fetchSeatCount = async () => {
      try {
        const res = await axios.get("http://localhost:8080/trains/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const train = res.data.find((t) => t.id === journey.train?.id);
        if (train) {
          setSeatCount(train.seatCount);
        } else {
          setSeatCount(25); 
        }
      } catch (err) {
        console.error("Koltuk sayısı alınamadı:", err);
        setSeatCount(25); 
      }
    };

    if (journey.train?.id) {
      fetchSeatCount();
    }
  }, [journey.train?.id, token]);

  const handleSeatClick = (seat) => {
    setSelectedSeat(seat);
    setError("");
  };

  const handleContinue = () => {
    if (!selectedSeat) {
      setError("Lütfen bir koltuk seçin.");
      return;
    }

    navigate("/passenger", {
      state: {
        journey,
        seat: selectedSeat,
        passengers,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 px-4 py-10 flex items-center justify-center">
      <motion.div
        className="bg-white rounded-xl shadow-xl p-6 w-full max-w-xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-blue-800 mb-4 text-center">
          Koltuk Seçimi
        </h2>
        <p className="text-center text-gray-600 mb-6">
          {journey?.departureStation?.name} → {journey?.arrivalStation?.name} ({journey?.departureTime?.slice(11, 16)})
        </p>

        <div className="grid grid-cols-4 gap-4 justify-items-center mb-6">
          {[...Array(seatCount)].map((_, index) => {
            const seatNum = index + 1;
            const isSelected = selectedSeat === seatNum;

            return (
              <motion.button
                key={seatNum}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
                className={`w-12 h-12 rounded-lg border font-semibold text-sm transition-all duration-200 ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white hover:bg-blue-100 text-gray-700"
                }`}
                onClick={() => handleSeatClick(seatNum)}
              >
                {seatNum}
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {error && (
            <motion.p
              className="text-red-500 text-center mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <motion.button
          onClick={handleContinue}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-all duration-200"
        >
          Devam Et
        </motion.button>
      </motion.div>
    </div>
  );
};

export default SeatSelection;
