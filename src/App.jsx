import { Outlet, useLocation } from "react-router-dom";
import { Header, Footer, ScrollToTop } from "./component";
import { useSelector } from "react-redux";

function App() {
  const location = useLocation();
  const hideHeaderFooterRoutes = ["/login", "/signup"];
  const userData = useSelector((state) => state.auth.userData);
  console.log(userData, "app js");

  const shouldHideHeaderFooter = hideHeaderFooterRoutes.includes(
    location.pathname
  );
  return (
    <>
      <ScrollToTop />
      {!shouldHideHeaderFooter && <Header />}
      <main className="relative">
        <Outlet />
      </main>
      {!shouldHideHeaderFooter && <Footer />}
    </>
  );
}

export default App;
