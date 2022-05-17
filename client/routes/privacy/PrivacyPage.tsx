import React from "react";
import Section from "../../components/Section";
import Segment from "../../components/Segment";
import Paragraph from "../../components/Paragraph";
import { useConfig } from "../../hooks/usePageData";
import EmailLink from "../../components/EmailLink";

export default function PrivacyPage() {
  const config = useConfig();
  
  return (
    <div className="FaqPage">
      <Section>
        <Segment>
          <Paragraph header="Privacy policy">
            By accessing this site or creating an account, you agree to our privacy policy.<br />
            Viva-project.org is a publicly accessible website and therefore all content uploaded to the site will first be verified before publishing.<br />
            When you login/register, the only information we collect is your email address and ip address. When not logged in, no data is collected.<br />
            We use cookies only for essential site functionality.<br />
            All of the cards hosted on this website are user created. If you would like to request a takedown/dmca for copyright infringement, you can contact us at <EmailLink address={config.contactEmailBase64} /> and we will remove it.<br />
            If you would like additional information pertaining to the privacy policy or to delete your account and it&apos;s associated information, you may contact us via our email and additional clarification can be provided.
          </Paragraph>
        </Segment>
      </Section>
    </div>
  );
}
