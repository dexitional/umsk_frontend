import React, { useRef } from "react";
import { IoArrowBackCircle, IoPrint } from "react-icons/io5";
import { Outlet, useNavigate, useNavigation } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useUserStore } from "../../utils/authService";
import Footer from "../Footer";
import Header from "../Header";
import Loader from "../Loader";

type Props = {
  children?: React.ReactNode;
};

function PrintLayout({ children }: Props) {
  const navigation = useNavigation();
  const navigate = useNavigate();
  const loading = navigation.state === "loading";
  const printRef: any = useRef();
  const { logout, user } = useUserStore((state) => state);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  return (
    <div className="w-full h-screen flex flex-col justify-between">
      <Header user={user} logout={logout} />
      <main className="w-full flex-1 flex flex-col md:overflow-y-scroll">
        <section className="md:mx-auto w-full md:max-w-7xl flex">
          <div
            ref={printRef}
            className={`${loading && "overflow-hidden"} flex-1`}
          >
            {loading && <Loader />}
            <div className="mx-auto mt-6 w-full max-w-6xl print:hidden flex items-center space-x-3">
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-1 rounded bg-primary-accent text-white font-bold flex items-center space-x-2"
              >
                <IoArrowBackCircle className="h-5 w-5 text-white" />
                <span>Go Back</span>
              </button>
              <button
                className="px-4 py-1 rounded bg-primary text-white font-bold flex items-center space-x-2"
                onClick={handlePrint}
              >
                <IoPrint className="h-5 w-5" />
                <span>Print</span>
              </button>
            </div>
            <Outlet />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default PrintLayout;
