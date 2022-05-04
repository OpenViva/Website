import React from "react";
import Section from "../../components/Section";
import Segment from "../../components/Segment";
import Paragraph from "../../components/Paragraph";

export default function PrivacyPage() {
  return (
    <div className="FaqPage">
      <Section>
        <Segment>
          <Paragraph header="Privacy policy">
            In order to comply with state and federal law, this privacy policy was created as is as following:
            Due to the nature of this game, we do not collect any data from the user and any data
            we get is voluntarily given to use by the user for debugging purposes.
          </Paragraph>
        </Segment>
      </Section>
    </div>
  );
}
