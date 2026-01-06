# CulinaryOS

CulinaryOS is a comprehensive kitchen management application designed to help you organize your pantry, manage recipes, and plan your meals efficiently.

## Project Structure

The project is divided into two main parts:
- **Client**: A modern React-based frontend.
- **Server**: A robust Node.js/Express backend.

## Technologies Used

### Frontend (Client)
- **Framework**: React 19 (via Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management & Data Fetching**: React Query, Context API
- **Routing**: React Router DOM v7
- **UI Components**: Lucide React (Icons), Sonner (Toasts), Framer Motion (Animations)
- **Utilities**: dnd-kit (Drag & Drop), Axios

### Backend (Server)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database Object Modeling**: Mongoose (MongoDB)
- **Authentication**: JWT (JSON Web Tokens), BcryptJS
- **Validation**: Zod
- **Security**: Cors, Dotenv

## Features & Pages

The application consists of **6 main pages/views**:

1.  **Login Page** (`/login`)
    -   Secure user authentication.
    -   Access to personal dashboard.

2.  **Register Page** (`/register`)
    -   New user sign-up functionality.
    -   Account creation.

3.  **Dashboard Home** (`/`)
    -   **Overview**: A central hub showing a quick summary of your kitchen.
    -   **Navigation**: access to other key areas like Pantry, Recipes, and Planner.

4.  **Pantry View** (`/pantry`)
    -   **Inventory Management**: Add, edit, and delete items in your pantry.
    -   **Categorization**: Organize items by categories (Produce, Dairy, Protein, etc.).
    -   **Search & Filter**: Quickly find ingredients.

5.  **Recipes Grid** (`/recipes`)
    -   **Collection**: Browse your saved recipes.
    -   **Management**: Add new recipes or view details of existing ones.

6.  **Meal Planner** (`/planner`)
    -   **Scheduling**: Plan your meals for the week.
    -   **Drag & Drop**: Easily move meals around your schedule.
    -   **Integration**: Use your saved recipes and pantry items to plan.

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB (Local or Atlas connection string)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-link>
    cd CulinaryOS
    ```

2.  **Install Client Dependencies:**
    ```bash
    cd client
    npm install
    ```

3.  **Install Server Dependencies:**
    ```bash
    cd ../server
    npm install
    ```

### Configuration

Create a `.env` file in the `server` directory with the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### Running the Application

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

Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal).
