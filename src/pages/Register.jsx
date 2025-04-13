import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const schema = yup.object().shape({
  name: yup.string().required("Ad Soyad zorunlu"),
  email: yup.string().email("Geçersiz e-posta").required("E-posta zorunlu"),
  password: yup.string().min(6, "Şifre en az 6 karakter olmalı").required("Şifre zorunlu"),
});

export default function Register() {
  const { login, isLoggedIn, user, setAuthToken } = useAuth();
  const navigate = useNavigate();

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
      const registerRes = await axios.post("http://localhost:8080/auth/register", {
        firstName: data.name.split(" ")[0],
        lastName: data.name.split(" ").slice(1).join(" ") || "-",
        email: data.email,
        password: data.password,
      });

      const token = registerRes.data.token;
      setAuthToken(token);

      const profileRes = await axios.get("http://localhost:8080/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const user = profileRes.data;
      login(user);

      const role = user.role?.toUpperCase();

      if (role === "ADMIN") navigate("/admin", { replace: true });
      else if (role === "MANAGER") navigate("/manager/employees", { replace: true });
      else if (role === "USER") navigate("/user", { replace: true });
      else navigate("/");

    } catch (err) {
      console.error("Kayıt hatası:", err);
      alert("Kayıt başarısız. Bilgileri kontrol et");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-white px-4 py-10">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">Kayıt Ol</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Ad Soyad"
              {...register("name")}
              className="w-full border border-gray-300 rounded px-4 py-2"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <input
              type="email"
              placeholder="E-posta"
              {...register("email")}
              className="w-full border border-gray-300 rounded px-4 py-2"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <input
              type="password"
              placeholder="Şifre"
              {...register("password")}
              className="w-full border border-gray-300 rounded px-4 py-2"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            {isSubmitting ? "Kayıt Olunuyor..." : "Kayıt Ol"}
          </button>
        </form>
      </div>
    </div>
  );
}
