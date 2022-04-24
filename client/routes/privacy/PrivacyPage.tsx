import React from "react";
import Section from "../../components/Section";
import Segment from "../../components/Segment";
import LoremIpsum from "../../components/LoremIpsum";

export default function PrivacyPage() {
  return (
    <div className="FaqPage">
      <Section>
        <Segment>
          <LoremIpsum count={4} units="paragraph" />
        </Segment>
      </Section>
    </div>
  );
}
