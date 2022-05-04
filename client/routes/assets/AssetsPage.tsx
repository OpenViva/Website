import React from "react";
import Section from "../../components/Section";
import Segment from "../../components/Segment";
import Paragraph from "../../components/Paragraph";
import Profile from "./Profile";
import "./AssetsPage.scss";

export default function AssetsPage() {
  return (
    <div className="AssetsPage">
      <Section vertical className="header">
        <Segment className="text">
          <Paragraph header="Mods and cards">
            Here you can find mods and characters which are currently only supported on our mod branch and character cards which are currently only supported on the main branch.
            To submit or request a character, mod or card, please join our discord server and ask there.
          </Paragraph>
        </Segment>
        <Profile />
      </Section>
    </div>
  );
}
