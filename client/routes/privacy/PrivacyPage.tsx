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
            Viva-project.org is a publicly accessible website and therefore all content uploaded to the site will first be verified before publishing.
            
            When not logged in, your data will not be collected. After account creation, your email address is collected along with records of your uploads to the site for takedown notices.
            
            We only use cookies for essential functions of the site and are only stored when you are logged in or sign up.
          </Paragraph>
        </Segment>
      </Section>
    </div>
  );
}
