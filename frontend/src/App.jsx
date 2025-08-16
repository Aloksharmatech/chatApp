import { Route, Routes } from "react-router-dom";
import LoginSignUpPage from "./pages/LoginSignUpPage";
import HomePage from "./pages/HomePage";
import PrivateRoutes from "./routes/PrivateRoutes";
import { useEffect } from "react";
import { getUser } from "./store/auth/auth-slice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./components/common/Loader";
import ChatSidebar from "./components/features/sidebar/ChatSidebar";
import Search from "./components/features/search/Search";

function App() {
  const dispatch = useDispatch();
  const { isBootstrapped } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  if (!isBootstrapped) {
    return <Loader message="Loading authentication..." />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginSignUpPage />} />
      <Route path="/" element={<LoginSignUpPage />} />

      {/* Private Routes */}
      <Route
        path="/home"
        element={
          <PrivateRoutes>
            <HomePage />
          </PrivateRoutes>
        }
      >
        {/* Nested Routes */}
        <Route index element={<ChatSidebar className="shrink-0" />} />
        <Route path="search" element={<Search />} />
      </Route>
    </Routes>
  );
}

export default App;
