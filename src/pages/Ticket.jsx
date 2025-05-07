import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import pdfMake from "pdfmake/build/pdfmake";
import { vfs } from "../assets/fonts/OpenSansVFS";
import { useTranslation } from "react-i18next";

export default function Ticket() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { t } = useTranslation();

  console.log(state);
  

  const { journey, seats = [], passengerList = [], ticketIds = [] } = state || {};
  const [statuses, setStatuses] = useState([]);

  

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const responses = await Promise.all(
          ticketIds.map(id =>
            axios.get(`http://localhost:8080/tickets/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
          )
        );
        setStatuses(responses.map(res => res.data.status ?? "PENDING"));
      } catch (err) {
        console.error("Ticket fetch error:", err);
        setStatuses(ticketIds.map(() => "UNKNOWN"));
      }
    };

    if (ticketIds.length) fetchStatuses();
  }, [ticketIds, token]);

  const safeTime = datetime => {
    if (!datetime) return "--:--";
    if (typeof datetime === "string") return datetime.slice(11, 16);
    return "--:--";
  };

  const renderStatus = status => {
    switch (status) {
      case "PENDING":
        return <span className="text-green-600 font-semibold">{t("ticket.statusAccepted")}</span>;
      case "ACCEPTED":
        return <span className="text-green-600 font-semibold">{t("ticket.statusAccepted")}</span>;
      default:
        return <span className="text-green-600 font-semibold">{t("ticket.statusAccepted")}</span>;
    }
  };

  const downloadPDF = (passenger, seat, pnr, price) => {
    const qrRaw = `${t("ticket.pnr")}: ${pnr}
${t("ticket.passenger")}: ${passenger.name} ${passenger.surname}
${t("ticket.trip")}: ${journey.departureStation?.name} → ${journey.arrivalStation?.name}
${t("ticket.time")}: ${safeTime(journey.departureTime)}
${t("ticket.seat")}: ${seat}`;


    pdfMake.vfs = vfs;
    pdfMake.fonts = {
      OpenSans: {
        normal: "OpenSans-Regular.ttf",
        bold: "OpenSans-Regular.ttf",
        italics: "OpenSans-Regular.ttf",
        bolditalics: "OpenSans-Regular.ttf"
      }
    };

    const docDefinition = {
      pageSize: 'A6',
      pageMargins: [0, 0, 0, 0],
      content: [
        {
          columns: [
            {
              width: '15%',
              stack: [
                { text: `PNR: ${pnr}`, style: 'sideText', margin: [0, 30, 0, 0] },
                { text: `${passenger.name} ${passenger.surname}`, style: 'sideText', margin: [0, 10, 0, 0] }
              ],
              fillColor: '#f6e7d8',
              alignment: 'center',
            },
            {
              width: '60%',
              stack: [
                { text: 'RAILWAVE', style: 'mainTitle', margin: [0, 10, 0, 5] },
                { text: t("ticket.ticketTitle"), style: 'subTitle' },
                { text: `${journey.departureStation?.name} → ${journey.arrivalStation?.name}`, style: 'route' },
                { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 160, y2: 0, lineWidth: 0.5 }], margin: [0, 8] },
                { text: `${t("ticket.date")}: ${journey.departureDate}`, style: 'info' },
                { text: `${t("ticket.time")}: ${journey.departureTime} ---> ${journey.arrivalTime}`, style: 'info' },
                { text: `${t("ticket.price")}: ${price}₺`, style: 'info' },
                { text: t("ticket.haveAGoodTrip"), style: 'footer', margin: [0, 20, 0, 0] }
              ],
              fillColor: '#f6e7d8',
              margin: [5, 0, 5, 0]
            },
            {
              width: '25%',
              stack: [
                { text: `${t("ticket.seat")}: ${seat}`, style: 'info', margin: [0, 10, 0, 0] },
                {
                  qr: qrRaw,
                  fit: 60,
                  margin: [0, 10, 0, 0],
                  alignment: 'center'
                }
              ],
              fillColor: '#f6e7d8',
              alignment: 'center',
            }
          ]
        }
      ],
      styles: {
        mainTitle: { fontSize: 18, bold: true, alignment: 'center', color: '#1a1a2e' },
        subTitle: { fontSize: 10, alignment: 'center', color: '#1a1a2e', margin: [0, 0, 0, 5] },
        route: { fontSize: 10, alignment: 'center', bold: true, color: '#333' },
        sideText: { fontSize: 9, bold: true, color: '#1a1a2e', alignment: 'center' },
        info: { fontSize: 9, color: '#333', alignment: 'center' },
        footer: { fontSize: 8, italics: true, alignment: 'center', color: 'gray' }
      },
      defaultStyle: {
        font: 'OpenSans'
      }
    };

    pdfMake.createPdf(docDefinition).download(`bilet_${pnr}.pdf`);
  };

  if (!journey || !seats.length || !passengerList.length || !ticketIds.length) {
    return <p className="text-center mt-10 text-red-600">{t("ticket.notFoundRedirect")}</p>;
  }

  return (
    <div className="min-h-screen  px-4 py-10">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">{t("ticket.title")}</h2>

      <div className="flex flex-wrap justify-center gap-6">
        {seats.map((seat, i) => {
          const passenger = passengerList[i];
          const pnr = ticketIds[i];
          const status = statuses[i];

          const qrRaw = `${t("ticket.pnr")}: ${pnr}
            ${t("ticket.passenger")}: ${passenger.name} ${passenger.surname}
            ${t("ticket.trip")}: ${journey.departureStation?.name} → ${journey.arrivalStation?.name}
            ${t("ticket.time")}: ${safeTime(journey.departureTime)}
            ${t("ticket.seat")}: ${seat}`;

          return (
            <div
              key={i}
              className="bg-white/90 backdrop-blur-md shadow-2xl rounded-xl p-8 w-full max-w-sm text-center space-y-6"
            >
              <h3 className="text-xl font-bold text-blue-700">{t("ticket.passenger")} {i + 1}</h3>

              <div className="text-left text-gray-700 space-y-2 border border-blue-100 rounded-lg bg-blue-50 p-4 shadow">
                <p><strong>🚄 {t("ticket.trip")}:</strong> {journey.departureStation?.name} → {journey.arrivalStation?.name}</p>
                <p><strong>🕐 {t("ticket.time")}:</strong> {journey.departureTime} → {journey.departureTime}</p>
                <p><strong>💺 {t("ticket.seat")}:</strong> {seat}</p>
                <p><strong>👤 {t("ticket.passenger")}:</strong> {passenger.name} {passenger.surname}</p>
                <p><strong>📩 {t("ticket.email")}:</strong> {passenger.email}</p>
                <p><strong>🎟️ {t("ticket.pnr")}:</strong> <span className="text-blue-700 font-semibold">{pnr}</span></p>
                <p><strong>📌 {t("ticket.status")}:</strong> {renderStatus(status)}</p>
              </div>

              <div className="flex justify-center bg-white p-4 rounded">
                <QRCode value={qrRaw} size={120} />
              </div>

              <button
                onClick={() => downloadPDF(passenger, seat, pnr, journey.price)}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition"
              >
                {t("ticket.download")}
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center mt-10">
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition"
        >
          {t("ticket.backToHome")}
        </button>
      </div>
    </div>
  );
}
