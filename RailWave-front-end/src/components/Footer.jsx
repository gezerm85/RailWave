import React from "react";
import { useTranslation } from "react-i18next";
import { FaFacebookF, FaInstagram, FaTwitter, FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className=" bg-white/70 border-t border-gray-300 text-gray-600  text-sm">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Marka ve açıklama */}
        <div>
          <h2 className="text-xl font-bold text-blue-800 mb-2">RailWave</h2>
          <p>{t("footer.description")}</p>
        </div>

        {/* Menü Linkleri */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">
            {t("footer.links")}
          </h3>
          <ul className="space-y-1">
            <li>
              <Link to="/support" className="hover:text-blue-600">
                {t("footer.support")}
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-blue-600">
                {t("footer.privacy")}
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-blue-600">
                {t("footer.terms")}
              </Link>
            </li>
          </ul>
        </div>

        {/* Sosyal Medya */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">
            {t("footer.followUs")}
          </h3>
          <div className="flex gap-4 text-xl">
            <a
              href="https://www.facebook.com/share/15FDyLR1ry/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://www.instagram.com/railwave?igsh=dW1yNGVnbWFuaTcz"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-500"
            >
              <FaInstagram />
            </a>
            <a
              href="https://x.com/i/flow/login?redirect_after_login=%2Frailwavetrain"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400"
            >
              <FaTwitter />
            </a>
          </div>
        </div>
      </div>

      <div className="text-center text-gray-500 text-xs border-t border-gray-300   pt-4 pb-6 px-4">
        © {new Date().getFullYear()} TrainBooker • {t("footer.rights")}
      </div>
    </footer>
  );
}
