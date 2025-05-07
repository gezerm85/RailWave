import React from "react";
import { useAuth } from "../context/AuthContext";
import SearchForm from "../components/SearchForm";
import { useTranslation } from "react-i18next";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
 

export default function UserDashboard() {
  const { user } = useAuth();
  const { t } = useTranslation(); 

  return (
    <div className="min-h-screen relative flex flex-col items-center px-4 py-16 overflow-hidden">
      {/* Başlık ve açıklama */}
      <div className="relative z-10 text-center mb-10">
        <h1 className="text-5xl md:text-7xl font-extrabold text-blue-800 drop-shadow-lg">
          RailWave
        </h1>
        <p className="mt-4 text-lg md:text-2xl text-white max-w-xl mx-auto">
          {t("dashboard.subtitle")}
        </p>
        {user?.firstName && (
          <p className="mt-4 text-md text-blue-700 capitalize">
            {t("dashboard.welcome", { name: user.firstName })}
          </p>
        )}
      </div>

      <div className="relative z-10 w-full max-w-2xl mb-16">
        <SearchForm />
      </div>

      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full px-4">
        {[
          {
            icon: "/images/customer.png",
            title: t("dashboard.cards.support"),
            desc: t("dashboard.cards.supportDesc"),
          },
          {
            icon: "/images/payment.png",
            title: t("dashboard.cards.secure"),
            desc: t("dashboard.cards.secureDesc"),
          },
          {
            icon: "/images/trustworthiness.png",
            title: t("dashboard.cards.budget"),
            desc: t("dashboard.cards.budgetDesc"),
          },
          {
            icon: "/images/train.png",
            title: t("dashboard.cards.brands"),
            desc: t("dashboard.cards.brandsDesc"),
          },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition duration-200"
          >
            <img
              src={item.icon}
              alt={item.title}
              className="h-16 w-16 mx-auto mb-4"
            />
            <h3 className="text-lg font-semibold text-blue-800">
              {item.title}
            </h3>
            <p className="text-gray-600 text-sm mt-2">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-4xl w-full mt-20">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          {t("dashboard.faqTitle")}
        </h2>

        {[
          {
            question: t("dashboard.faq.q1"),
            answer: t("dashboard.faq.a1"),
          },
          {
            question: t("dashboard.faq.q2"),
            answer: t("dashboard.faq.a2"),
          },
          {
            question: t("dashboard.faq.q3"),
            answer: t("dashboard.faq.a3"),
          },
          {
            question: t("dashboard.faq.q4"),
            answer: t("dashboard.faq.a4"),
          },
          {
            question: t("dashboard.faq.q5"),
            answer: t("dashboard.faq.a5"),
          },
        ].map((item, index) => (
          <Accordion key={index} className="mb-2">
            <AccordionSummary expandIcon={<ExpandMoreIcon />} className="">
              <Typography className="font-medium text-gray-800">
                {item.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography className="text-gray-600">{item.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>

    </div>
  );
}
