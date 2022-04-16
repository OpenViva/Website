import React from 'react';
import { Link } from "react-router-dom";
import { IndexPageResponse } from "../../../types/api";
import Layout from "../../components/Layout";
import LoremIpsum from '../../components/LoremIpsum';
import Segment from "../../components/Segment";
import Button from "../../components/Button";
import usePageData from "../../hooks/usePageData";
import Section from "../../components/Section";
import ExLink from "../../components/ExLink";
import "./IndexPage.scss";

export default function IndexPage() {
  const [pageData] = usePageData<IndexPageResponse>();
  
  let buttons: React.ReactNode;
  if(pageData?.latest) {
    buttons = <>
      {pageData?.latest ? <Button primary content="Download Latest" label={pageData.latest.version} as={ExLink} to={pageData.latest.url} /> : null}
      <Button content="Other Versions" as={Link} to="/download" />
    </>; // eslint-disable-line react/jsx-closing-tag-location
  } else {
    buttons = <Button content="Downloads" as={Link} to="/download" />;
  }
  
  return (
    <Layout className="IndexPage" stickyFooter>
      <Section full vertical>
        <img className="logo" src="/static/logoBig.png" alt="OpenViva" />
        <Segment className="main">
          <LoremIpsum count={2} units="paragraph" />
          <div className="buttons">{buttons}</div>
        </Segment>
      </Section>
    </Layout>
  );
}
