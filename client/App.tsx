import React, { useEffect } from 'react';
import { Redirect, Route, Switch } from "react-router";
import { hot } from 'react-hot-loader';
import { ToastContainer } from "react-toastify";
import { usePageDataInit, PageDataContext } from "./hooks/usePageData";
import Layout from "./components/Layout";
import IndexPage from "./routes/index/IndexPage";
import DownloadPage from "./routes/downloads/DownloadPage";
import FaqPage from "./routes/faq/FaqPage";
import PrivacyPage from "./routes/privacy/PrivacyPage";
import "./globals.scss";

interface Props {
  initialData: any;
}

declare global {
  interface Window {
    _csrf: string;
  }
}

// eslint-disable-next-line prefer-arrow-callback
export default hot(module)(function App({ initialData }: Props) {
  const contextData = usePageDataInit(initialData);
  
  useEffect(() => {
    window._csrf = initialData._csrf;
  }, [initialData._csrf]);
  
  // if(initialData._error) {
  //   return <ErrorPage error={initialData._error} />;
  // }
  
  return (
    <PageDataContext.Provider value={contextData}>
      <Switch>
        <Route path="/" exact render={() => <Layout stickyFooter page={IndexPage} />} />
        <Route path="/download" exact render={() => <Layout page={DownloadPage} />} />
        <Route path="/mods" exact render={() => <Layout page={IndexPage} />} />
        <Route path="/faq" exact render={() => <Layout page={FaqPage} />} />
        <Route path="/privacy" exact render={() => <Layout page={PrivacyPage} />} />
        <Redirect to="/" />
      </Switch>
      <ToastContainer position="bottom-right" newestOnTop />
    </PageDataContext.Provider>
  );
});
