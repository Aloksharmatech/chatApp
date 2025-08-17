import { Navigate, Route, Routes } from "react-router-dom";
import LoginSignUpPage from "./pages/LoginSignUpPage";
import HomePage from "./pages/HomePage";
import PrivateRoutes from "./routes/PrivateRoutes";
import { useEffect } from "react";
import { getUser } from "./store/auth/auth-slice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./components/common/Loader";
import ChatSidebar from "./components/features/sidebar/ChatSidebar";
import Search from "./components/features/search/Search";
import Settings from "./components/common/Settings";

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
    <>
      <Routes>
        <Route path="/login" element={<LoginSignUpPage />} />

        <Route
          path="/home"
          element={
            <PrivateRoutes>
              <HomePage />
            </PrivateRoutes>
          }
        >
          <Route index element={<ChatSidebar className="shrink-0" />} />
          <Route path="search" element={<Search />} />  
          <Route path="settings" element={<Settings />} />  
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default App;
