import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import AuthCallback from "./pages/AuthCallback";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Payment from "./pages/Payment";
import { Toaster } from "react-hot-toast";
import OrderDetails from "./pages/OrderDetails";
import Dashboard from "./pages/admin/Dashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminOrderDetail from "./pages/admin/AdminOrderDetail";

import AdminOnly from "./components/AdminOnly";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/auth/callback" element={<AuthCallback />} />

            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />

            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />

            <Route path="/orders/:id" element={<OrderDetails />} />

            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />

            <Route
              path="/payment"
              element={
                <ProtectedRoute>
                  <Payment />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes (now 100% protected) */}
            <Route
              path="/admin"
              element={
                <AdminOnly>
                  <Dashboard />
                </AdminOnly>
              }
            />

            <Route
              path="/admin/orders"
              element={
                <AdminOnly>
                  <AdminOrders />
                </AdminOnly>
              }
            />

            <Route
              path="/admin/orders/:id"
              element={
                <AdminOnly>
                  <AdminOrderDetail />
                </AdminOnly>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>

      <Toaster position="top-center" />
    </Router>
  );
}

export default App;



//import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";
// import Home from "./pages/Home";
// import Product from "./pages/Product";
// import Cart from "./pages/Cart";
// import AuthCallback from "./pages/AuthCallback";
// import Checkout from "./pages/Checkout";
// import Orders from "./pages/Orders";
// import Profile from "./pages/Profile";
// import Login from "./pages/Login";
// import ProtectedRoute from "./components/ProtectedRoute";
// import Payment from "./pages/Payment";
// import { Toaster } from "react-hot-toast";
// import OrderDetails from "./pages/OrderDetails";
// import Dashboard from "./pages/admin/Dashboard";
// import AdminOrders from "./pages/admin/AdminOrders";
// import AdminOrderDetail from "./pages/admin/AdminOrderDetail";

// function App() {
//   return (
//     <Router>
//       <div className="flex flex-col min-h-screen">
//         <Navbar />
//         <main className="flex-1 p-4">
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/product/:id" element={<Product />} />
//             <Route path="/cart" element={<Cart />} />
//             <Route path="/auth/callback" element={<AuthCallback />} />
//             <Route
//               path="/checkout"
//               element={
//                 <ProtectedRoute>
//                   <Checkout />
//                 </ProtectedRoute>
//               }
//             />

//             <Route
//               path="/orders"
//               element={
//                 <ProtectedRoute>
//                   <Orders />
//                 </ProtectedRoute>
//               }
//             />
//             <Route path="/orders/:id" element={<OrderDetails />} />

//             <Route path="/profile" element={<Profile />} />
//             <Route path="/login" element={<Login />} />

//             <Route
//               path="/payment"
//               element={
//                 <ProtectedRoute>
//                   <Payment />
//                 </ProtectedRoute>
//               }
//             />

//             {/* Admin routes (open for now — will restrict later) */}
//             <Route path="/admin" element={<Dashboard />} />
//             <Route path="/admin/orders" element={<AdminOrders />} />
//             <Route path="/admin/orders/:id" element={<AdminOrderDetail />} />
//           </Routes>
//         </main>
//         <Footer />
//       </div>

//       <Toaster position="top-center" />
//     </Router>
//   );
// }

// export default App;
