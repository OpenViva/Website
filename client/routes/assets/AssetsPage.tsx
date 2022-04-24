import React from "react";
import Section from "../../components/Section";
import Segment from "../../components/Segment";
import LoremIpsum from "../../components/LoremIpsum";
import Profile from "./Profile";
import "./AssetsPage.scss";

export default function AssetsPage() {
  return (
    <div className="AssetsPage">
      <Section vertical className="header">
        <Segment className="text">
          <LoremIpsum count={1} units="paragraph" />
        </Segment>
        <Profile />
      </Section>
    </div>
  );
}
