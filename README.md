# CulinaryOS 🍳

**CulinaryOS** is a next-generation kitchen management platform designed to revolutionize how you cook, plan, and organize. By combining traditional pantry management with **cutting-edge AI tools**, CulinaryOS helps you manage everything from ingredients to complex cooking schedules with ease.

## 🚀 New AI-Powered Features

We've upgraded CulinaryOS with advanced intelligent features:

-   **🤖 AI Chef Chatbot**: A global, context-aware culinary assistant available on every screen. Ask for cooking tips, recipes, or technique advice instantly.
-   **👨‍🍳 Kitchen Order System (`/orders`)**: Manage your kitchen like a pro. Schedule cooking tasks with precise start/end times and track their status in real-time.
-   **🎥 AI Video Search (`/videos`)**: Don't just search—ask. Let our AI recommend the perfect dish and automatically find the best video tutorials for it.
-   **❤️ Diabetes Care Suite**: Smart features for health-conscious cooking:
    -   **Sugar Alerts**: Automatically detects high-sugar ingredients in recipes.
    -   **Smart Substitutes**: AI-powered suggestions for healthier alternatives (e.g., Stevia instead of Sugar).
    -   **Diabetic Friendly Badges**: Visual indicators for low-calorie/diabetic-friendly recipes.

---

## 🏗️ Project Structure

The project is divided into two main parts:
-   **Client**: A modern React-based frontend built into a responsive SPA.
-   **Server**: A robust Node.js/Express backend API.

## 🛠️ Technologies Used

### Frontend (Client)
-   **Framework**: React 19 (via Vite)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS
-   **State Management**: React Query, Context API
-   **Routing**: React Router DOM v7
-   **UI & Animations**: Lucide React, Sonner (Toasts), Framer Motion
-   **Utilities**: dnd-kit, Axios

### Backend (Server)
-   **Runtime**: Node.js & Express.js
-   **Database**: Mongoose (MongoDB)
-   **Auth**: JWT & BcryptJS
-   **Validation**: Zod
-   **Security**: Cors, Helmet

---

## 📱 Features & Pages

The application now consists of **8 main pages/views**:

1.  **Dashboard Home** (`/`)
    -   Central hub for your kitchen overview.
    -   Quick access to all modules.

2.  **Kitchen Orders** (`/orders`) **[NEW]**
    -   Professional scheduling system for cooking tasks.
    -   Track duration, specifications, and progress.

3.  **Video Recipes** (`/videos`) **[NEW]**
    -   AI-driven video recommendations.
    -   Search and watch cooking tutorials.

4.  **Pantry View** (`/pantry`)
    -   Inventory management with categorization.
    -   Track what you have in stock.

5.  **Recipes Collection** (`/recipes`)
    -   Browse and manage your personal cookbook.
    -   **Diabetic Care**: Automatic warnings and badges for ingredients.

6.  **Meal Planner** (`/planner`)
    -   Drag-and-drop weekly meal scheduling.
    -   Integrated with your saved recipes.

7.  **Authentication** (`/login` & `/register`)
    -   Secure access to your personal culinary data.

---

## ⚡ Getting Started

### Prerequisites
-   Node.js (v18+ recommended)
-   MongoDB (Local or Atlas)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-link>
    cd CulinaryOS
    ```

2.  **Install Dependencies:**
    ```bash
    # Install server deps
    cd server
    npm install

    # Install client deps
    cd ../client
    npm install
    ```

### Configuration

Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### Running the App

1.  **Start the Server:**
    ```bash
    cd server
    npm run dev
    ```

2.  **Start the Client:**
    ```bash
    cd client
    npm run dev
    ```

3.  **Explore**: Open `http://localhost:5173` in your browser.

---

*Built with ❤️ by the CulinaryOS Team.*
