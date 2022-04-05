import React from 'react';
import Layout from "../../components/Layout";
import "./IndexPage.scss";

export default function IndexPage() {
  return (
    <Layout className="IndexPage" stickyFooter>
      <section className="full">
        <img className="logo" src="/static/logoBig.png" alt="OpenViva" />
      </section>
      <section>test</section>
      <section>test</section>
      <section>test</section>
      <section>kek</section>
    </Layout>
  );
}
