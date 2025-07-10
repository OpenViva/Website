import React from 'react';
import { Link } from "react-router-dom";
import { IndexPageResponse } from "../../../types/api";
import Segment from "../../components/Segment";
import Button from "../../components/Button";
import usePageData, { useConfig } from "../../hooks/usePageData";
import Section from "../../components/Section";
import ExLink from "../../components/ExLink";
import Paragraph from "../../components/Paragraph";
import "./IndexPage.scss";

export default function IndexPage() {
  const config = useConfig();
  const [pageData] = usePageData<IndexPageResponse>();
  
  let buttons: React.ReactNode;
  if(config.steamLink) {
    buttons = <>
      <Button primary as={ExLink} to={config.steamLink}>Wishlist On Steam</Button>
      <Button as={Link} to="/download">Other Versions</Button>
    </>; // eslint-disable-line react/jsx-closing-tag-location
  } else if(pageData?.latest) {
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
            OpenViva is an free and open source continuation of Project Viva, originally made by Sir Hal. Viva is a VR
            and non-VR compatible game where you can interact with your very own AI anime character! It is an advanced AI
            simulation that can interact and respond to many of your actions in a dynamic way through inverse kinematics,
            complex behaviors, and currently over 200 animations. The character mood is dynamic and responds to how you treat it.
            You can play with it, feed it, or just be friends with it. You can download and play OpenViva for free using buttons below.
          </Paragraph>
          <Paragraph header="Team">
            We are a group of users dedicated to continuing viva project as a free and open source game under the name &quot;OpenViva&quot;.
            Our goal is to polish 0.8.03 and replace any and all third party paid assets with either free or custom assets.
            All assets and scripts are be available to anyone who wants to download them or fork the project on our
            {" "}<ExLink to="https://github.com/OpenViva">GitHub</ExLink>. If you have any questions or want to help us, you can join our
            community on <ExLink to={config.discordInvite} className="discord">Discord</ExLink>.
          </Paragraph>
          <div className="buttons">{buttons}</div>
        </Segment>
      </Section>
    </div>
  );
}
