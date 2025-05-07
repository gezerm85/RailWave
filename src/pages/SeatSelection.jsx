/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

const SeatSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();
  const { t } = useTranslation();

  const journey = location.state?.journey || {};
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [error, setError] = useState("");
  const [seatCount, setSeatCount] = useState(0);
  const [reservedSeats, setReservedSeats] = useState([]);
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

  useEffect(() => {
    const fetchReservedSeats = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/tickets/trip/${journey.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const seats = res.data.map(ticket => ticket.seatNumber);
        setReservedSeats(seats);
      } catch (err) {
        console.error("Satın alınmış koltuklar alınamadı:", err);
      }
    };
  
    if (journey.id) fetchReservedSeats();
  }, [journey.id, token]);

  const handleSeatClick = (seat) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seat));
    } else if (selectedSeats.length < passengers) {
      setSelectedSeats([...selectedSeats, seat]);
    } else {
      setError(`${passengers} ${t("seatSelection.maxSeatsError")}`); 
      return;
    }
    setError("");
  };
  

  
  const handleContinue = () => {
    if (selectedSeats.length.toString() !== passengers) {
      setError(t("seatSelection.error")); 
      return;
    }
  
    navigate("/passenger", {
      state: {
        journey,
        seats: selectedSeats,
        passengers,
      },
    });
  };
  

  

  return (
    <div className="min-h-screen  px-4 py-10 flex items-center justify-center">
      <motion.div
        className="bg-white rounded-xl shadow-xl p-6 w-full max-w-xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-blue-800 mb-4 text-center">
          {t("seatSelection.title")}
        </h2>
        <p className="text-center text-gray-600 mb-6">
          {journey?.departureStation?.city} → {journey?.arrivalStation?.city} (
          {journey?.departureTime})
        </p>

        <div className="grid grid-cols-4 gap-4 justify-items-center mb-6">
        {[...Array(seatCount)].map((_, index) => {
          const seatNum = index + 1;
          const isSelected = selectedSeats.includes(seatNum);
          const isReserved = reservedSeats.includes(seatNum);

          return (
            <motion.button
              key={seatNum}
              disabled={isReserved}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: isReserved ? 1.0 : 1.1 }}
              className={`w-12 h-12 rounded-lg border font-semibold text-sm transition-all duration-200 ${
                isReserved
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : isSelected
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
          {t("seatSelection.continue")}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default SeatSelection;
