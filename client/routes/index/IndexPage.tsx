import React from 'react';
import { Link } from "react-router-dom";
import { IndexPageResponse } from "../../../types/api";
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
      {pageData?.latest ? <Button primary label={pageData.latest.version} as={ExLink} to={pageData.latest.url}>Download Latest</Button> : null}
      <Button as={Link} to="/download">Other Versions</Button>
    </>; // eslint-disable-line react/jsx-closing-tag-location
  } else {
    buttons = <Button as={Link} to="/download">Downloads</Button>;
  }
  
  return (
    <div className="IndexPage">
      <Section full vertical>
        <img className="logo" src="/static/logoBig.png" alt="OpenViva" />
        <Segment className="main">
          <LoremIpsum count={2} units="paragraph" />
          <div className="buttons">{buttons}</div>
        </Segment>
      </Section>
    </div>
  );
}
