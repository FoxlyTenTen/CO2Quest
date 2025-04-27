# 🌱 CO2Quest

> Track, analyze, and reduce your company's transport-related carbon footprint — and earn rewards!  
> Built for Small and Medium Enterprises (SMEs) to encourage sustainability and operational efficiency.

---

## 📱 App Features

- 🚗 **Vehicle Tracking**: Record business trips with real-time distance tracking.
- ⛽ **Fuel-Based Carbon Calculation**: Input fuel usage (Petrol/Diesel) and calculate emissions using Malaysia’s official emission factors.
- 📈 **Daily Carbon Dashboard**: View your carbon emission stats by day.
- 🎯 **Personalized AI Assistant**: Get carbon reduction tips using AI-powered analysis.
- 🎁 **Reward System**: Redeem vouchers, discounts, and training credits based on sustainable activities.
- 🛠️ **Firebase Integration**: Secure cloud storage for user data, carbon records, and point system.
- 🖥️ **Modern UI/UX**: Clean, minimal, business-friendly design with white background bottom tab.

---

## 🛠 Tech Stack

| Technology | Purpose |
|:-----------|:--------|
| **React Native (Expo)** | Cross-platform mobile development |
| **Expo Router** | File-based navigation |
| **Firebase Firestore** | Real-time cloud database |
| **Firebase Auth** | User authentication |
| **Google Generative AI** | Carbon assistant (recommendation engine) |
| **LightGBM/XGBoost** | Machine learning model for carbon prediction |
| **Location API** | Real-time distance tracking for trips |

---

## 📊 Database Structure (Firebase Firestore)


> Each date stores an **array of trip objects** for that day.

---

## 📈 Carbon Emission Formula


**Emission Factors** (Malaysia standard):
- Petrol: `2.32 kg CO₂/liter`
- Diesel: `2.68 kg CO₂/liter`

---

## 🚀 Key Screens

- **Home**: Quick access to dashboard and tracking
- **Dashboard**: Visualize daily emissions and future prediction
- **Vehicle Tracking**: Add company vehicles, start/stop tracking journeys
- **AI Chatbot**: Personalized advice to reduce transport emissions
- **Rewards**: View available incentives and redeem based on performance

---

## 🏆 SME Rewards

| Reward | Description |
|:-------|:------------|
| ☕ 10% Discount at Starbucks (SME Plan) | Use at business meetings |
| 🚚 50% Off Grab for Business | Delivery service discounts |
| 💻 RM500 Google Ads Credit | Kickstart online marketing |
| 📚 Free Digital Marketing Course | Boost your online presence |
| 🖨️ RM100 Office Supplies Voucher | Redeem with SME partners |

---

## 📈 Machine Learning (Prediction)

- Predicts **tomorrow's carbon emission** based on the past 3 days (`prev1`, `prev2`, `prev3`).
- Models tested:
  - Linear Regression
  - Random Forest

✅ Final model: **Random Forest** for better balance between speed and accuracy.

---

## ⚙️ Installation

```bash
git clone https://github.com/your-username/sme-carbon-tracker.git
cd sme-carbon-tracker
npm install
npx expo start
