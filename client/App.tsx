import React, { useEffect } from 'react';
import { Route, Routes } from "react-router";
import { ToastContainer } from "react-toastify";
import { PageDataProvider } from "./hooks/usePageData";
import { SSRProvider } from "./hooks/useSSR";
import { LocalUserProvider } from "./hooks/useLocalUser";
import IndexPage from "./routes/index/IndexPage";
import NotFoundPage from "./routes/notFound/NotFoundPage";
import DownloadPage from "./routes/downloads/DownloadPage";
import FaqPage from "./routes/faq/FaqPage";
import PrivacyPage from "./routes/privacy/PrivacyPage";
import AssetsPage from "./routes/assets/AssetsPage";
import Layout from "./components/Layout";
import VerifyEmailPage from "./routes/verifyEmail/VerifyEmailPage";
import "./globals.scss";

interface AppProps {
  initialData: any;
}

declare global {
  interface Window {
    _csrf: string;
  }
}

// eslint-disable-next-line prefer-arrow-callback
export default function App({ initialData }: AppProps) {
  useEffect(() => {
    window._csrf = initialData._csrf;
  }, [initialData._csrf]);
  
  // if(initialData._error) {
  //   return <ErrorPage error={initialData._error} />;
  // }
  
  return (
    <SSRProvider>
      <PageDataProvider initialData={initialData}>
        <LocalUserProvider defaultUser={initialData._user}>
          <Routes>
            <Route path="/" element={<Layout stickyFooter title="About"><IndexPage /></Layout>} />
            <Route path="/download" element={<Layout title="Downloads"><DownloadPage /></Layout>} />
            <Route path="/assets" element={<Layout title="Mods & Cards"><AssetsPage /></Layout>} />
            <Route path="/faq" element={<Layout title="FAQ"><FaqPage /></Layout>} />
            <Route path="/privacy" element={<Layout title="Privacy Policy"><PrivacyPage /></Layout>} />
            <Route path="/verifyEmail" element={<Layout><VerifyEmailPage /></Layout>} />
            <Route path="*" element={<Layout title="Page Not Found"><NotFoundPage /></Layout>} />
          </Routes>
          <ToastContainer position="bottom-right" newestOnTop />
        </LocalUserProvider>
      </PageDataProvider>
    </SSRProvider>
  );
}
