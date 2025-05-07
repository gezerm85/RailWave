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

  const { journey, seat, passenger, pnr, ticketId, userCount = 1 } = state || {};
  const [status, setStatus] = useState("LOADING");

  useEffect(() => {
    const fetchTicketStatus = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/tickets/${ticketId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const fetchedStatus = res.data.status ?? "PENDING";
        setStatus(fetchedStatus);
      } catch (err) {
        console.error("Ticket fetch error:", err);
        setStatus("UNKNOWN");
      }
    };

    if (ticketId) {
      fetchTicketStatus();
    }
  }, [ticketId, token]);

  if (!journey || !seat || !passenger || !pnr) {
    return (
      <p className="text-center text-red-600 mt-10">
        {t("ticket.notFoundRedirect")}
      </p>
    );
  }

  const safeTime = (datetime) => {
    if (!datetime) return "--:--";
    if (typeof datetime === "string") return datetime.slice(11, 16);
    return "--:--";
  };

  const qrRaw = `${t("ticket.pnr")}: ${pnr}
${t("ticket.passenger")}: ${passenger.name} ${passenger.surname}
${t("ticket.trip")}: ${journey.departureStation?.name || journey.departure} → ${journey.arrivalStation?.name || journey.arrival}
${t("ticket.time")}: ${safeTime(journey.departureTime || journey.time)}
${t("ticket.seat")}: ${seat}`;

  const renderStatus = () => {
    switch (status) {
      case "PENDING":
        return <span className="text-yellow-600 font-semibold">{t("ticket.statusAccepted")}</span>;
      case "ACCEPTED":
        return <span className="text-green-600 font-semibold">{t("ticket.statusAccepted")}</span>;
      default:
        return <span className="text-gray-600">{t("ticket.statusUnknown")}</span>;
    }
  };

  const downloadPDF = () => {
    pdfMake.vfs = vfs;
    pdfMake.fonts = {
      OpenSans: {
        normal: "OpenSans-Regular.ttf",
        bold: "OpenSans-Regular.ttf",
        italics: "OpenSans-Regular.ttf",
        bolditalics: "OpenSans-Regular.ttf"
      }
    };

    const passengerText = userCount > 1 ? t("ticket.xPerson", { count: userCount }) : t("ticket.single");

    const docDefinition = {
      pageSize: 'A6',
      pageMargins: [0, 0, 0, 0],
      background: [{ canvas: [{ type: 'rect', x: 0, y: 0, w: 298, h: 420, color: '#0000' }] }],
      content: [
        {
          columns: [
            {
              width: '15%',
              stack: [
                { text: `PNR: ${pnr}`, style: 'sideText', margin: [0, 30, 0, 0] },
                { text: passengerText, style: 'sideText', margin: [0, 10, 0, 0] }
              ],
              fillColor: '#f6e7d8',
              alignment: 'center',
            },
            {
              width: '60%',
              stack: [
                { text: 'RAILWAVE', style: 'mainTitle', margin: [0, 10, 0, 5] },
                { text: t("ticket.ticketTitle"), style: 'subTitle' },
                { text: `${journey.departureStation?.name || journey.departure} → ${journey.arrivalStation?.name || journey.arrival}`, style: 'route' },
                { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 160, y2: 0, lineWidth: 0.5 }], margin: [0, 8] },
                { text: `${t("ticket.date")}: ${journey.departureTime?.slice(0, 10)}`, style: 'info' },
                { text: `${t("ticket.time")}: ${safeTime(journey.departureTime || journey.time)}`, style: 'info' },
                { text: t("ticket.haveAGoodTrip"), style: 'footer', margin: [0, 20, 0, 0] }
              ],
              fillColor: '#f6e7d8',
              margin: [5, 0, 5, 0]
            },
            {
              width: '25%',
              stack: [
                { text: passengerText, style: 'sideText', margin: [0, 20, 0, 0] },
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
        price: { fontSize: 16, bold: true, color: '#1a1a2e', alignment: 'center', margin: [0, 4] },
        info: { fontSize: 9, color: '#333', alignment: 'center' },
        footer: { fontSize: 8, italics: true, alignment: 'center', color: 'gray' }
      },
      defaultStyle: {
        font: 'OpenSans'
      }
    };

    pdfMake.createPdf(docDefinition).download(`bilet_${pnr}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 flex items-center justify-center px-4 py-10">
      <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-xl p-8 w-full max-w-md text-center space-y-6">
        <h2 className="text-3xl font-bold text-blue-700">{t("ticket.title")}</h2>

        <div className="text-left text-gray-700 space-y-2 border border-blue-100 rounded-lg bg-blue-50 p-4 shadow">
          <p><strong>🚄 {t("ticket.trip")}:</strong> {journey.departureStation?.name || journey.departure} → {journey.arrivalStation?.name || journey.arrival}</p>
          <p><strong>🕐 {t("ticket.time")}:</strong> {safeTime(journey.departureTime || journey.time)}</p>
          <p><strong>💺 {t("ticket.seat")}:</strong> {seat}</p>
          <p><strong>👤 {t("ticket.passenger")}:</strong> {passenger.name} {passenger.surname}</p>
          <p><strong>📩 {t("ticket.email")}:</strong> {passenger.email}</p>
          <p><strong>🎟️ {t("ticket.pnr")}:</strong> <span className="text-blue-700 font-semibold">{pnr}</span></p>
          <p><strong>📌 {t("ticket.status")}:</strong> {renderStatus()}</p>
        </div>

        <div className="flex justify-center bg-white p-4 rounded">
          <QRCode value={qrRaw} size={160} />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={downloadPDF}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition"
          >
            {t("ticket.download")}
          </button>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition"
          >
            {t("ticket.backToHome")}
          </button>
        </div>
      </div>
    </div>
  );
}
