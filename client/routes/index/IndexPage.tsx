import React from 'react';
import { Link } from "react-router-dom";
import { IndexPageResponse } from "../../../types/api";
import Segment from "../../components/Segment";
import Button from "../../components/Button";
import usePageData from "../../hooks/usePageData";
import Section from "../../components/Section";
import ExLink from "../../components/ExLink";
import Paragraph from "../../components/Paragraph";
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
          <Paragraph header="About">
            We are a group of users dedicated to continuing viva project as a free and open source game under the name "OpenViva".
            Our goal is to polish 0.8.03 and replace any and all third party paid assets with either free or custom assets.
            All assets and scripts will be available to anyone who wants to download them or fork the project on our github.
          </Paragraph>
          <Paragraph header="Plans">
            Our plans are to clean up and improve the AI that runs the characters, add more extensive character support such as .pmx parsing,
            quest 2 support, steam releases, steam achievements and a proper modloader that works with the steam workshop.
          </Paragraph>
          <div className="buttons">{buttons}</div>
        </Segment>
      </Section>
    </div>
  );
}
