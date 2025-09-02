<div align="center">

# 🚂 RailWave - Tren Bilet Rezervasyon Sistemi

**React, Spring Boot ve MySQL ile Geliştirilmiş Modern Tren Bilet Rezervasyon Platformu**

[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3.3-6DB33F?style=for-the-badge&logo=spring&logoColor=white)](https://spring.io/projects/spring-boot)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[🚀 Demo](#-demo) • [📋 Özellikler](#-özellikler) • [🛠️ Teknolojiler](#️-teknolojiler) • [🚀 Kurulum](#-kurulum)

</div>

---

## 📖 Hakkında

**RailWave**, modern web teknolojileri kullanılarak geliştirilmiş kapsamlı bir tren bilet rezervasyon sistemidir. React frontend ve Spring Boot backend ile oluşturulmuş olup, kullanıcılara güvenli, hızlı ve kullanıcı dostu tren bilet rezervasyon deneyimi sunmaktadır.

### 🎯 Projenin Amacı

- 🚂 **Tren Bilet Rezervasyonu** - Kapsamlı bilet rezervasyon sistemi
- 🌍 **Çoklu Dil Desteği** - 8 farklı dil desteği
- 💳 **Güvenli Ödeme** - Güvenli ödeme işlemleri
- 📱 **Responsive Tasarım** - Tüm cihazlarda uyumlu arayüz
- 🔐 **Güvenlik** - JWT tabanlı kimlik doğrulama
- 📊 **Admin Paneli** - Kapsamlı yönetim paneli

---

## 🚀 Demo

**🔗 [Canlı Demo](https://your-demo-url.com)**

Uygulama şu anda geliştirme aşamasındadır. Demo linki yakında eklenecektir.

---

## 🚀 Kurulum

### Gereksinimler

- **Node.js** (v18 veya üzeri)
- **Java** (v17 veya üzeri)
- **MySQL** (v8.0 veya üzeri)
- **Maven** (v3.6 veya üzeri)
- **npm** veya **yarn**

### Backend Kurulumu

1. **Backend klasörüne gidin**
   ```bash
   cd RailWave-backend
   ```

2. **MySQL veritabanını oluşturun**
   ```sql
   CREATE DATABASE trainticketsystem;
   ```

3. **Application properties'i yapılandırın**
   ```properties
   # src/main/resources/application.properties
   spring.datasource.url=jdbc:mysql://localhost:3306/trainticketsystem
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   spring.jpa.hibernate.ddl-auto=update
   ```

4. **Backend'i başlatın**
   ```bash
   mvn spring-boot:run
   ```

### Frontend Kurulumu

1. **Frontend klasörüne gidin**
   ```bash
   cd RailWave-front-end
   ```

2. **Bağımlılıkları yükleyin**
   ```bash
   npm install
   # veya
   yarn install
   ```

3. **Environment variables'ları ayarlayın**
   ```env
   VITE_API_BASE_URL=http://localhost:8080
   ```

4. **Frontend'i başlatın**
   ```bash
   npm run dev
   # veya
   yarn dev
   ```

### Build Komutları

```bash
# Frontend build
npm run build

# Backend build
mvn clean package

# Backend JAR çalıştırma
java -jar target/trainticketsystem-0.0.1-SNAPSHOT.jar
```

---

## 📋 Geliştirdiğim Özellikler

### 🚂 Tren Bilet Sistemi
- [x] **Bilet Arama** - Tarih, istasyon ve yolcu sayısına göre arama
- [x] **Koltuk Seçimi** - Interaktif koltuk seçim sistemi
- [x] **Yolcu Bilgileri** - Detaylı yolcu bilgi girişi
- [x] **Bilet Rezervasyonu** - Güvenli bilet rezervasyon işlemi
- [x] **Bilet Yönetimi** - Bilet görüntüleme ve iptal etme

### 💳 Ödeme Sistemi
- [x] **Güvenli Ödeme** - Kredi kartı ile güvenli ödeme
- [x] **Kupon Sistemi** - İndirim kuponları
- [x] **Ödeme Onayı** - Lottie animasyonlu onay sistemi
- [x] **E-posta Bildirimi** - EmailJS ile otomatik bildirim
- [x] **PDF Bilet** - PDF formatında bilet oluşturma

### 🌍 Çoklu Dil Desteği
- [x] **8 Dil Desteği** - TR, EN, ES, AR, FR, PT, DE, RU
- [x] **i18next Entegrasyonu** - Profesyonel çeviri sistemi
- [x] **Dinamik Dil Değişimi** - Anlık dil değiştirme
- [x] **Bayrak Gösterimi** - Ülke bayrakları ile dil seçimi

### 👥 Kullanıcı Yönetimi
- [x] **Kayıt/Giriş** - Güvenli kullanıcı kayıt ve giriş
- [x] **Şifre Sıfırlama** - E-posta ile şifre sıfırlama
- [x] **Profil Yönetimi** - Kullanıcı profil düzenleme
- [x] **Bilet Geçmişi** - Kullanıcı bilet geçmişi
- [x] **JWT Authentication** - Güvenli token tabanlı kimlik doğrulama

### 🛠️ Admin Paneli
- [x] **İstasyon Yönetimi** - Tren istasyonları CRUD işlemleri
- [x] **Tren Yönetimi** - Tren bilgileri yönetimi
- [x] **Sefer Yönetimi** - Tren seferleri planlama
- [x] **Bilet Yönetimi** - Tüm biletleri görüntüleme ve yönetme
- [x] **Çalışan Yönetimi** - Sistem çalışanları yönetimi

### 🎨 UI/UX Geliştirmeleri
- [x] **Modern Tasarım** - Material-UI ve Tailwind CSS
- [x] **Responsive Layout** - Tüm cihazlarda uyumlu
- [x] **Animasyonlar** - Framer Motion ile smooth animasyonlar
- [x] **Loading States** - Kullanıcı dostu loading bileşenleri
- [x] **Error Handling** - Kapsamlı hata yönetimi

---

## 🛠️ Teknolojiler

### Frontend
- **React** `19.0.0` - UI library
- **Vite** `6.2.0` - Build tool
- **React Router DOM** `7.5.0` - Client-side routing
- **Material-UI** `7.0.2` - Component library
- **Tailwind CSS** `4.1.3` - Utility-first CSS
- **Framer Motion** `12.6.5` - Animation library

### Backend
- **Spring Boot** `3.3.3` - Java framework
- **Spring Security** - Authentication & authorization
- **Spring Data JPA** - Database operations
- **MySQL** `8.0` - Relational database
- **JWT** `0.11.5` - Token-based authentication
- **MapStruct** `1.5.5` - Object mapping

### Internationalization
- **i18next** `25.0.2` - Internationalization framework
- **react-i18next** `15.5.1` - React i18n integration
- **i18next-browser-languagedetector** `8.0.5` - Language detection

### Payment & Communication
- **EmailJS** `4.4.1` - Email service
- **PDF Generation** - jsPDF, PDF-lib, React-PDF
- **QR Code** `1.5.4` - QR code generation

### Development Tools
- **Lombok** `1.18.30` - Java boilerplate reduction
- **Swagger/OpenAPI** `2.5.0` - API documentation
- **ESLint** `9.21.0` - Code linting

---

## 📁 Proje Yapısı

```
RailWave/
├── RailWave-front-end/          # React Frontend
│   ├── src/
│   │   ├── components/          # React bileşenleri
│   │   │   ├── BackgroundSlider.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── RoleRoute.jsx
│   │   │   └── SearchForm.jsx
│   │   ├── pages/               # Sayfa bileşenleri
│   │   │   ├── admin/           # Admin panel sayfaları
│   │   │   ├── employees/       # Çalışan sayfaları
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── UserDashboard.jsx
│   │   │   ├── SearchResults.jsx
│   │   │   ├── SeatSelection.jsx
│   │   │   ├── Payment.jsx
│   │   │   └── Ticket.jsx
│   │   ├── context/             # React Context
│   │   │   └── AuthContext.jsx
│   │   ├── i18n/                # Çoklu dil desteği
│   │   │   └── i18n.js
│   │   ├── router/              # Routing yapılandırması
│   │   │   ├── AdminRoute.jsx
│   │   │   └── index.jsx
│   │   └── assets/              # Statik varlıklar
│   │       ├── css/
│   │       ├── flags/           # Ülke bayrakları
│   │       ├── fonts/
│   │       ├── images/
│   │       └── lottie/          # Animasyonlar
│   └── public/
│       ├── locales/             # Çeviri dosyaları
│       └── images/
└── RailWave-backend/            # Spring Boot Backend
    ├── src/main/java/com/trainticket/trainticketsystem/
    │   ├── business/            # İş mantığı
    │   │   ├── abstracts/       # Interface'ler
    │   │   └── concretes/       # Implementation'lar
    │   ├── controller/          # REST API Controller'lar
    │   │   ├── AuthController.java
    │   │   ├── TicketController.java
    │   │   ├── TrainController.java
    │   │   └── TripController.java
    │   ├── entities/            # JPA Entity'ler
    │   │   ├── User.java
    │   │   ├── Ticket.java
    │   │   ├── Train.java
    │   │   └── Trip.java
    │   ├── dto/                 # Data Transfer Objects
    │   │   ├── request/
    │   │   ├── response/
    │   │   └── converter/
    │   ├── security/            # Güvenlik yapılandırması
    │   │   ├── JwtUtil.java
    │   │   ├── SecurityConfig.java
    │   │   └── AuthenticationService.java
    │   └── dataAccess/          # Repository'ler
    │       ├── UserRepository.java
    │       ├── TicketRepository.java
    │       └── TrainRepository.java
    └── src/main/resources/
        └── application.properties
```

---

## 🔧 Geliştirme

### Backend Geliştirme

```bash
# Backend development server
mvn spring-boot:run

# Test çalıştırma
mvn test

# JAR oluşturma
mvn clean package
```

### Frontend Geliştirme

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview build
npm run preview

# Linting
npm run lint
```

### API Endpoints

```bash
# Authentication
POST /auth/register
POST /auth/login
POST /auth/forgot-password
POST /auth/reset-password

# Tickets
GET /tickets
POST /tickets
PUT /tickets/{id}
DELETE /tickets/{id}

# Trains
GET /trains
POST /trains
PUT /trains/{id}
DELETE /trains/{id}

# Trips
GET /trips
POST /trips
PUT /trips/{id}
DELETE /trips/{id}
```

### Database Schema

```sql
-- Users table
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    role ENUM('USER', 'ADMIN', 'EMPLOYEE')
);

-- Trains table
CREATE TABLE trains (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    train_name VARCHAR(255) NOT NULL,
    capacity INT NOT NULL,
    type VARCHAR(100)
);

-- Tickets table
CREATE TABLE tickets (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    trip_id BIGINT,
    seat_number INT,
    status ENUM('ACCEPTED', 'PENDING', 'REJECTED'),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (trip_id) REFERENCES trips(id)
);
```

---

## 🚀 Deployment

### Backend Deployment

```bash
# Docker ile deployment
docker build -t railwave-backend .
docker run -p 8080:8080 railwave-backend

# Heroku deployment
git subtree push --prefix RailWave-backend heroku main
```

### Frontend Deployment

```bash
# Vercel deployment
vercel --prod

# Netlify deployment
npm run build
# dist/ klasörünü Netlify'e upload et
```

### Environment Variables

```env
# Backend (.env)
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/trainticketsystem
SPRING_DATASOURCE_USERNAME=your_username
SPRING_DATASOURCE_PASSWORD=your_password
JWT_SECRET=your_jwt_secret

# Frontend (.env)
VITE_API_BASE_URL=http://localhost:8080
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

---

## 🤝 Katkıda Bulunma

1. Bu depoyu fork edin
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some AmazingFeature'`)
4. Branch'inizi push edin (`git push origin feature/AmazingFeature`)
5. Pull Request oluşturun

### Geliştirme Kuralları
- Java coding standards'larına uyun
- React best practices'leri takip edin
- Responsive tasarım prensiplerini uygulayın
- Test coverage'ı artırın
- API documentation'ı güncelleyin

---

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

---

## 👨‍💻 Geliştirici

**Bu projeyi geliştiren: Mehmet Çelebi Gezer**

Bu tren bilet rezervasyon sistemi, modern web teknolojileri kullanılarak geliştirilmiştir. React frontend ve Spring Boot backend ile oluşturulmuş olup, güvenli ödeme işlemleri, çoklu dil desteği ve kapsamlı admin paneli ile profesyonel bir tren bilet rezervasyon deneyimi sunmaktadır.

### 🎯 Proje Detayları
- **Geliştirme Süresi:** [X] hafta/gün
- **Kullanılan Teknolojiler:** React, Spring Boot, MySQL, JWT, i18next
- **Özellikler:** Bilet rezervasyonu, Ödeme sistemi, Çoklu dil, Admin paneli
- **Platform:** Web (Responsive)

---

## 🙏 Teşekkürler

- [React](https://reactjs.org/) ekibine
- [Spring Boot](https://spring.io/projects/spring-boot) ekibine
- [Material-UI](https://mui.com/) ekibine
- [Tailwind CSS](https://tailwindcss.com/) ekibine
- [i18next](https://www.i18next.com/) ekibine
- Tüm açık kaynak katkıda bulunanlara

---

## 📞 İletişim

**Proje Hakkında Sorularınız İçin:**

- 📧 **E-posta:** [gezermcelebi@gmail.com](mailto:gezermcelebi@gmail.com)
- 💼 **LinkedIn:** [Mehmet Çelebi Gezer](https://www.linkedin.com/in/mehmet-%C3%A7elebi-gezer-605a38217/)
- 🐙 **GitHub:** [@gezerm85](https://github.com/gezerm85)
---

<div align="center">

**⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!**

Made with ❤️ by **Mehmet Çelebi Gezer**

*Modern web teknolojileri ile geliştirilmiş profesyonel tren bilet rezervasyon sistemi*

</div>
