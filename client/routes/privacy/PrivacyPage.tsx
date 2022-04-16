import React from "react";
import Layout from "../../components/Layout";
import Section from "../../components/Section";
import Segment from "../../components/Segment";
import LoremIpsum from "../../components/LoremIpsum";

export default function PrivacyPage() {
  return (
    <Layout className="FaqPage">
      <Section>
        <Segment>
          <LoremIpsum count={4} units="paragraph" />
        </Segment>
      </Section>
    </Layout>
  );
}
