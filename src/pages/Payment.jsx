import { useLocation, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import Lottie from "lottie-react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import successAnimation from "../assets/lottie/check .json";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import styles from "../assets/css/Payment.module.css";
import { useTranslation } from "react-i18next";
import emailjs from "@emailjs/browser";

export default function Payment() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { journey, seats = [], passengerList = [] } = state || {};
  const { token, addTicket } = useAuth();

  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [phone, setPhone] = useState("");
  const [showCvv, setShowCvv] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedCouponId, setSelectedCouponId] = useState("");
  const [expiryError, setExpiryError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  if (!journey || !seats.length || !passengerList.length) {
    return (
      <p className="text-center mt-10 text-red-600">
        {t("payment.missingInfo")}
      </p>
    );
  }

  const coupons = [
    { id: "TRAIN50", label: t("coupons.TRAIN50"), minAmount: 500, discount: 50 },
    { id: "CEPTE150", label: t("coupons.CEPTE150"), minAmount: 1000, discount: 150 },
    { id: "YÖRÜK300", label: t("coupons.YÖRÜK300"), minAmount: 2000, discount: 300 },
  ];
  const selectedCoupon = coupons.find(c => c.id === selectedCouponId);

  const originalTotal = journey.price * seats.length;
  let finalTotal = originalTotal;
  if (selectedCoupon && originalTotal >= selectedCoupon.minAmount) {
    finalTotal = originalTotal - selectedCoupon.discount;
  }

  const formatCardNumber = val =>
    val.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim().slice(0, 19);
  const formatCVV = val => val.replace(/\D/g, "").slice(0, 3);
  const formatExpiry = val => {
    const cleaned = val.replace(/\D/g, "").slice(0, 4);
    return cleaned.length < 3
      ? cleaned
      : cleaned.slice(0, 2) + "/" + cleaned.slice(2);
  };

  const fakeCards = [
    {
      number: "1111222233334444",
      cvv: "123",
      expiry: "12/30",
      name: "Rabianur Aygün",
      type: "success"
    },
    {
      number: "5555666677778888",
      cvv: "456",
      expiry: "11/25",
      name: "Hatice Yaren Bulut",
      type: "insufficient"
    }
  ];

  const handlePayment = async e => {
    e.preventDefault();
    setErrorMessage("");

    const sanitizedCard = cardNumber.replace(/\s/g, "");
    const found = fakeCards.find(
      c => c.number === sanitizedCard && c.cvv === cvv && c.expiry === expiry
    );

    if (!found) {
      setErrorMessage(t("payment.invalidCard"));
      return;
    }
    if (found.type === "insufficient") {
      setErrorMessage(t("payment.insufficientFunds"));
      return;
    }
    setCardName(found.name);

    if (!/^05\d{9}$/.test(phone)) {
      alert(t("payment.invalidPhone"));
      return;
    }
    if (selectedCoupon && originalTotal < selectedCoupon.minAmount) {
      alert(t("coupons.notEligible"));
      return;
    }
    if (!isValidExpiryDate(expiry)) {
      setExpiryError(t("payment.invalidExpiry"));
      return;
    }

    try {
      const payload = seats.map(seatNum => ({
        tripId: journey.id,
        seatNumber: seatNum
      }));
      const res = await axios.post(
        "http://localhost:8080/tickets/multiple",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const tickets = res.data;
      tickets.forEach((ticket, idx) => {
        const passenger = passengerList[idx];
        addTicket({
          id: ticket.id,
          from: journey.departureStation.name,
          to: journey.arrivalStation.name,
          time: journey.departureTime,
          seat: ticket.seatNumber,
          passenger,
          date: journey.departureDate
        });
        const perPerson = finalTotal / seats.length;
        sendEmail(ticket, ticket.seatNumber, journey, passenger, perPerson);
      });
      setShowModal(true);
      setTimeout(() => {
        navigate("/ticket", {
          state: {
            journey,
            seats,
            passengerList,
            ticketIds: tickets.map(t => t.id)
          }
        });
      }, 2500);
    } catch {
      alert(t("payment.error"));
    }
  };

  const sendEmail = (ticket, seatNum, trip, passenger, paidAmount) => {
    emailjs
      .send(
        "service_xpa8d6k",
        "template_ogd71zb",
        {
          user_name: `${passenger.name} ${passenger.surname}`,
          user_email: passenger.email,
          seat_number: seatNum,
          departure_station: trip.departureStation?.name,
          arrival_station: trip.arrivalStation?.name,
          departure_time: trip.departureTime,
          arrival_time: trip.arrivalTime,
          departure_date: trip.departureDate,
          pnr: ticket.id,
          paid_amount: `${paidAmount}₺`,
        },
        "rKdcfd9B19xh1cXKX"
      )
      .then()
      .catch();
  };

  const isValidExpiryDate = value => {
    const [month, year] = value.split("/");
    if (!month || !year || month.length !== 2 || year.length !== 2) return false;
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt("20" + year, 10);
    if (isNaN(monthNum) || isNaN(yearNum) || monthNum < 1 || monthNum > 12) {
      return false;
    }
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    if (yearNum < currentYear) return false;
    if (yearNum === currentYear && monthNum < currentMonth) return false;
    return true;
  };

  return (
    <div className="min-h-screen px-4 py-10">
      {errorMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {errorMessage}
        </div>
      )}
      <div className="max-w-xl mx-auto bg-white/80 backdrop-blur-lg p-8 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-blue-800 text-center mb-2">
          {t("payment.title")}
        </h2>
        <p className="text-center text-gray-600 mb-6">
          {t("payment.subtitle")}
        </p>
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm">
          <h3 className="text-md font-semibold text-gray-800 mb-1">
            {t("payment.journey")}
          </h3>
          <p className="text-sm text-gray-700">
            {journey.departureStation.name} → {journey.arrivalStation.name}
          </p>
          <p className="text-sm text-gray-700">
            🗓️ {journey.departureDate} → {journey.arrivalDate}
          </p>
          <p className="text-sm text-gray-700">
            🕒 {t("payment.departureTime")}: {journey.departureTime}
          </p>
          <p className="text-sm text-gray-700">
            🕓 {t("payment.arrivalTime")}: {journey.arrivalTime}
          </p>
          <p className="text-sm text-gray-700">
            💸 {t("payment.price")}:{" "}
            {selectedCoupon && originalTotal >= selectedCoupon.minAmount ? (
              <>
                <del className="text-red-500">{originalTotal}₺</del>{" "}
                <span className="text-green-600 font-semibold">
                  {finalTotal}₺
                </span>
              </>
            ) : (
              <span>{originalTotal}₺</span>
            )}
          </p>
          <h3 className="text-md font-semibold text-gray-800 mt-4 mb-1">
            {t("payment.passengers")}
          </h3>
          <ul className="list-disc list-inside space-y-1">
            {passengerList.map((p, i) => (
              <li key={i} className="text-sm text-gray-700">
                {t("payment.passenger")} {i + 1}: {p.name} {p.surname} —{" "}
                {p.email} — {t("payment.seat")}: {seats[i]}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col space-y-2 mb-6">
          <label className="text-sm font-medium text-gray-700">
            {t("coupons.chooseCoupon")}
          </label>
          <select
            value={selectedCouponId}
            onChange={e => setSelectedCouponId(e.target.value)}
            className="w-full border border-gray-500 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
          >
            <option value="">{t("coupons.chooseCoupon")}</option>
            {coupons.map(c => (
              <option key={c.id} value={c.id}>
                {c.id} — {c.label}
              </option>
            ))}
          </select>
          {selectedCoupon && originalTotal < selectedCoupon.minAmount && (
            <p className="text-sm text-red-600">{t("coupons.notEligible")}</p>
          )}
        </div>
        <div className="flex justify-center mb-6">
          <div className={styles["flip-card"]}>
            <div className={styles["flip-card-inner"]}>
              <div className={styles["flip-card-front"]}>
                <p className={styles["heading_8264"]}>MASTERCARD</p>
                <svg
                  className={styles["logo"]}
                  xmlns="http://www.w3.org/2000/svg"
                  width="36"
                  height="36"
                  viewBox="0 0 48 48"
                >
                  <path
                    fill="#ff9800"
                    d="M32 10A14 14 0 1 0 32 38A14 14 0 1 0 32 10Z"
                  />
                  <path
                    fill="#d50000"
                    d="M16 10A14 14 0 1 0 16 38A14 14 0 1 0 16 10Z"
                  />
                  <path
                    fill="#ff3d00"
                    d="M18,24c0,4.755,2.376,8.95,6,11.48c3.624-2.53,6-6.725,6-11.48s-2.376-8.95-6-11.48C20.376,15.05,18,19.245,18,24z"
                  />
                </svg>
                <p className={styles["number"]}>
                  {cardNumber || "0000 0000 0000 0000"}
                </p>
                <p className={styles["date_8264"]}>{expiry || "MM/YY"}</p>
                <p className={styles["name"]}>{cardName || t("payment.defaultName")}</p>
              </div>
              <div className={styles["flip-card-back"]}>
                <div className={styles["strip"]}></div>
                <div className={styles["mstrip"]}></div>
                <div className={styles["sstrip"]}>
                  <p className={styles["code"]}>{cvv || "***"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <form onSubmit={handlePayment} className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {t("payment.cardNumber")}
            </label>
            <input
              type="text"
              placeholder="XXXX XXXX XXXX XXXX"
              value={cardNumber}
              onChange={e => setCardNumber(formatCardNumber(e.target.value))}
              required
              className="w-full border border-gray-500 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {t("payment.cardName")}
            </label>
            <input
              type="text"
              placeholder={t("register.name")}
              value={cardName}
              onChange={e => setCardName(e.target.value)}
              required
              className="w-full border border-gray-500 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {t("employees.phone")}
            </label>
            <input
              type="tel"
              placeholder="05xx xxx xx xx"
              maxLength={11}
              value={phone}
              onChange={e => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
              required
              className="w-full border border-gray-500 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1 flex flex-col space-y-2">
              <label className="text-sm font-medium text-gray-700">
                {t("payment.expiry")}
              </label>
              <input
                type="text"
                placeholder="AA/YY"
                value={expiry}
                onChange={e => setExpiry(formatExpiry(e.target.value))}
                required
                className="w-full border border-gray-500 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
              />
              {expiryError && (
                <p className="text-red-600 text-sm">{t("payment.invalidExpiry")}</p>
              )}
            </div>
            <div className="flex-1 flex flex-col space-y-2 relative">
              <label className="text-sm font-medium text-gray-700">
                {t("payment.cvv")}
              </label>
              <input
                type={showCvv ? "text" : "password"}
                placeholder="CVV"
                value={cvv}
                onChange={e => setCvv(formatCVV(e.target.value))}
                required
                className="w-full border border-gray-500 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-10 text-gray-500"
                onClick={() => setShowCvv(!showCvv)}
              >
                {showCvv ? <HiEyeOff size={20} /> : <HiEye size={20} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
          >
            {t("payment.payNow")}
          </button>
        </form>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-xl px-8 py-6 flex flex-col items-center w-[300px]">
            <Lottie animationData={successAnimation} loop={false} style={{ width: 160, height: 160 }} />
            <p className="text-2xl font-bold text-green-600 mt-2">{t("payment.success")}</p>
            <p className="text-sm text-gray-500 mt-1 text-center">{t("payment.redirecting")}</p>
          </div>
        </div>
      )}
    </div>
  );
}
