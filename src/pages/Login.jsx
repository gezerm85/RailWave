import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { FaEye, FaEyeSlash } from "react-icons/fa";


const schema = yup.object().shape({
  email: yup.string().email("auth.invalidEmail").required("auth.emailRequired"),
  password: yup.string().min(6, "auth.passwordMin").required("auth.passwordRequired"),
});

export default function Login({ minimal = false }) {
  const { login, isLoggedIn, user, setAuthToken } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (isLoggedIn && user) {
      const role = user.role?.toUpperCase();
      if (role === "ADMIN") navigate("/admin", { replace: true });
      else if (role === "MANAGER") navigate("/manager/employees", { replace: true });
      else if (role === "USER") navigate("/user", { replace: true });
    }
  }, [isLoggedIn, user, navigate]);

  const onSubmit = async (data) => {
    try {
      const loginRes = await axios.post("http://localhost:8080/auth/login", {
        email: data.email,
        password: data.password,
      });

      const token = loginRes.data.token;
      setAuthToken(token);

      const profileRes = await axios.get("http://localhost:8080/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userData = profileRes.data;
      login(userData);

      const role = userData.role?.toUpperCase();

      if (role === "ADMIN") navigate("/admin", { replace: true });
      else if (role === "MANAGER") navigate("/manager/employees", { replace: true });
      else if (role === "USER") navigate("/user", { replace: true });
      else navigate("/");

    } catch (err) {
      console.error("Giriş hatası:", err);
      alert(t("auth.loginFailed"));
    }
  };

  return (
    <div className={`${!minimal ? " flex items-center justify-center px-4 " : ""}`}>
      <div className=" rounded-lg p-8 w-full max-w-md">


        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder={t("auth.emailPlaceholder")}
              {...register("email")}
              className="w-full border border-gray-300 rounded px-4 py-2"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{t(errors.email.message)}</p>}
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder={t("auth.passwordPlaceholder")}
              {...register("password")}
              className="w-full border border-gray-300 rounded px-4 py-2 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-2 flex items-center text-gray-600"
              tabIndex={-1}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{t(errors.password.message)}</p>
            )}
          </div>


          <div className="text-right text-sm">
            <Link to="/forgot-password" className="text-blue-600 hover:underline">
              {t("auth.forgotPassword")}
            </Link>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            {isSubmitting ? t("auth.loggingIn") : t("auth.loginButton")}
          </button>
        </form>
      </div>
    </div>
  );
}
