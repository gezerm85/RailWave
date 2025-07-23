import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import axios from "axios";
import pdfMake from "pdfmake/build/pdfmake";
import { vfs } from "../assets/fonts/OpenSansVFS";
import { useTranslation } from "react-i18next";

export default function TicketDetail() {
  const { state } = useLocation();
  const { ticket } = state || {};
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const token = localStorage.getItem("token");

  if (!ticket) {
    return <p className="text-center mt-10 text-red-600">{t("ticket.notFound")}</p>;
  }

  const safeTime = datetime => {
    if (!datetime) return "--:--";
    return typeof datetime === "string" ? datetime.slice(0, 5) : "--:--";
  };

  const handleDelete = async () => {
    if (!window.confirm(t("ticket.confirmCancel"))) return;
    setIsDeleting(true);
    try {
      await axios.delete(`http://localhost:8080/tickets/${ticket.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDeleted(true);
      setTimeout(() => navigate("/tickets"), 2000);
    } catch {
      alert(t("ticket.cancelError"));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownloadPDF = () => {
    pdfMake.vfs = vfs;
    pdfMake.fonts = {
      OpenSans: {
        normal: "OpenSans-Regular.ttf",
        bold: "OpenSans-Regular.ttf",
        italics: "OpenSans-Regular.ttf",
        bolditalics: "OpenSans-Regular.ttf"
      }
    };

    const qrContent = 
      `${t("ticket.pnr")}: ${ticket.id}\n` +
      `${t("ticket.trip")}: ${ticket.trip.departureStation.name} → ${ticket.trip.arrivalStation.name}\n` +
      `${t("ticket.date")}: ${ticket.trip.departureDate}\n` +
      `${t("ticket.time")}: ${safeTime(ticket.trip.departureTime)} → ${safeTime(ticket.trip.arrivalTime)}\n` +
      `${t("ticket.price")}: ${ticket.trip.price}₺\n` +
      `${t("ticket.seat")}: ${ticket.seatNumber}`;

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
                { text: ticket.id, style: 'sideText', margin: [0, 30, 0, 0] },
                { text: ticket.userCount > 1 ? t("ticket.xPerson", { count: ticket.userCount }) : t("ticket.single"), style: 'sideText', margin: [0, 10, 0, 0] }
              ],
              fillColor: '#f6e7d8',
              alignment: 'center'
            },
            {
              width: '60%',
              stack: [
                { text: 'RAILWAVE', style: 'mainTitle', margin: [0, 10, 0, 5] },
                { text: t("ticket.ticketTitle"), style: 'subTitle' },
                { text: `${ticket.trip.departureStation.name} → ${ticket.trip.arrivalStation.name}`, style: 'route' },
                { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 160, y2: 0, lineWidth: 0.5 }], margin: [0, 8] },
                { text: `${t("ticket.date")}: ${ticket.trip.departureDate}`, style: 'info' },
                { text: `${t("ticket.time")}: ${safeTime(ticket.trip.departureTime)} → ${safeTime(ticket.trip.arrivalTime)}`, style: 'info' },
                { text: `${t("ticket.price")}: ${ticket.trip.price}₺`, style: 'info' },
                { text: t("ticket.haveAGoodTrip"), style: 'footer', margin: [0, 20, 0, 0] }
              ],
              fillColor: '#f6e7d8',
              margin: [5, 0, 5, 0]
            },
            {
              width: '25%',
              stack: [
                { text: `${t("ticket.seat")}: ${ticket.seatNumber}`, style: 'info', margin: [0, 10, 0, 0] },
                {
                  qr: qrContent,
                  fit: 60,
                  margin: [0, 10, 0, 0],
                  alignment: 'center'
                }
              ],
              fillColor: '#f6e7d8',
              alignment: 'center'
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
      defaultStyle: { font: 'OpenSans' }
    };

    pdfMake.createPdf(docDefinition).download(`bilet_${ticket.id}.pdf`);
  };

  const renderStatus = () => {
    if (ticket.status === "ACCEPTED") return <span className="text-green-600 font-semibold">{t("ticket.statusAccepted")}</span>;
    if (ticket.status === "PENDING" || ticket.status === null) return <span className="text-green-600 font-semibold">{t("ticket.statusAccepted")}</span>;
    return <span className="text-gray-500">{t("ticket.statusUnknown")}</span>;
  };

  const qrValue = 
    `${t("ticket.pnr")}: ${ticket.id}\n` +
    `${t("ticket.trip")}: ${ticket.trip.departureStation.name} → ${ticket.trip.arrivalStation.name}\n` +
    `${t("ticket.date")}: ${ticket.trip.departureDate}\n` +
    `${t("ticket.time")}: ${safeTime(ticket.trip.departureTime)} → ${safeTime(ticket.trip.arrivalTime)}\n` +
    `${t("ticket.price")}: ${ticket.trip.price}₺\n` +
    `${t("ticket.seat")}: ${ticket.seatNumber}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-xl shadow-lg p-6 text-center space-y-4 max-w-md w-full">
        <h2 className="text-2xl font-bold text-blue-700">{t("ticket.title")}</h2>

        {deleted ? (
          <p className="text-green-600 font-semibold">{t("ticket.deleted")}</p>
        ) : (
          <>
            <div className="text-gray-700 space-y-1 text-left">
              <p><strong>{t("ticket.trip")}:</strong> {ticket.trip.departureStation.name} → {ticket.trip.arrivalStation.name}</p>
              <p><strong>{t("ticket.date")}:</strong> {ticket.trip.departureDate}</p>
              <p><strong>{t("ticket.time")}:</strong> {safeTime(ticket.trip.departureTime)} → {safeTime(ticket.trip.arrivalTime)}</p>
              <p><strong>{t("ticket.seat")}:</strong> {ticket.seatNumber}</p>
              <p><strong>{t("ticket.status")}:</strong> {renderStatus()}</p>
              <p><strong>{t("ticket.pnr")}:</strong> <span className="text-blue-700 font-semibold">{ticket.id}</span></p>
            </div>

            <div className="flex justify-center bg-white p-4 rounded">
              <QRCode value={qrValue} size={150} />
            </div>

            <div className="flex flex-col gap-2">
              <button onClick={handleDownloadPDF} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                {t("ticket.download")}
              </button>
              <button onClick={handleDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded disabled:opacity-50">
                {isDeleting ? t("ticket.canceling") : t("ticket.cancel")}
              </button>
              <button onClick={() => navigate("/tickets")} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                {t("ticket.backToList")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
