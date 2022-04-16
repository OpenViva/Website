import React, { useCallback, useRef, useState } from "react";
import { Config } from "../../../types/api";
import { useConfig } from "../../hooks/usePageData";
import { classJoin } from "../../helpers/utils";
import Layout from "../../components/Layout";
import LoremIpsum from "../../components/LoremIpsum";
import Section from "../../components/Section";
import Segment from "../../components/Segment";
import ExLink from "../../components/ExLink";
import EmailLink from "../../components/EmailLink";
import "./FaqPage.scss";

interface QuestionDef {
  question: string;
  answer: (config: Config) => React.ReactNode;
}

/* eslint-disable react/display-name */
/* eslint-disable react/jsx-closing-tag-location */
const questions: QuestionDef[] = [
  {
    question: "What Happened to the original Viva?",
    answer: () => <LoremIpsum count={2} units="paragraph" />,
  }, {
    question: "My VR control buttons don't work!",
    answer: () => <img src="/static/faq/controlls.jpg" alt="VR control tutorial" />,
  }, {
    question: "My loli looks glitchy/invisible when I spawn her!",
    answer: () => <>
      We&apos;re sorry to say this, but it appears you&apos;re using an old, unsupported graphic card.<br />
      If you&apos;re seeing graphic issues such as the image below:
      <img src="/static/faq/outdated-gc.png" alt="outdated graphic card example" />
      This confirm your hardware is unsupported.<br /><br />
      You can still contact us via our Discord server if your graphic issue look different.
    </>,
  }, {
    question: "How do I install custom character/clothing cards?",
    answer: () => <>
      If you downloaded the cards on this website, please refer to the &quot;HOWTOINSTALL.txt&quot; file inside the downloaded archive.<br /><br />
      If you downloaded the cards via another method, you should have two pictures for character cards or one for clothing cards.
      The cards must go in their own folders, all located in <i>&quot;Viva Folder/Cards&quot;</i>. All clothing cards goes into the <i>Clothing</i> folders.
      You should have a Character and Skin card for your character, simply drop them in their respective folders.
    </>,
  }, {
    question: "Default character/clothing cards are not working!",
    answer: () => <>
      You cannot play inside the ZIP/RAR file. Please extract the game in a folder of your choice.<br /><br />
      You may use archive tools such as WinRAR or 7zip to extract the game. If your archive tool does not work/refuse to extract the game,
      your tool might be outdated, please search for an up to date version.<br />
      We saw users struggling with 7zip because they were using an outdated version. Please double check this before messaging us on Discord.
    </>,
  }, {
    question: "I installed new characters/clothes but they're not showing in-game!",
    answer: () => <>
      First of all, please check if you extracted the game from the ZIP/RAR file described in detail in the question above.<br /><br />
      If you already extracted the game, please double check that you put the cards in the right folders.<br />
      Check the cards properties <i>(right click the card, properties).</i> All cards, characters and clothing,
      should have a size of 1024x1536 pixels <i>(Details tab)</i> and must be in PNG format.<br /><br />
      If everything is okay but you still can&apos;t see your character/clothes in the game, please contact a developer on Viva&apos;s Discord server.
    </>,
  }, {
    question: "How do I switch between VR and non-VR mode?",
    answer: () => <>
      To switch between the two modes please open the book menu <i>(P key in desktop mode)</i>,
      go to controls and press &quot;Switch to VR&quot; or &quot;Switch to Keyboard&quot;.<br /><br />
      NOTE: you must have SteamVR installed and running with a working VR headset plugged-in to be able to switch to VR mode.
    </>,
  }, {
    question: "Something is not working in-game!",
    answer: (config) => <>
      We&apos;re sorry to hear that. Here is what you can do to help us fix this asap:<br />
      Contact a developer on Viva&apos;s <ExLink to={config.discordInvite}>Discord</ExLink> server or <EmailLink address={config.contactEmailBase64}>send us an email</EmailLink>.<br />
      If you&apos;re getting an error message/log, please take a screenshot of the game and attach it to your message.<br />
      Please also tell us what you did to replicate the problem. We will reply as soon as possible.
    </>,
  },
];
/* eslint-enable react/display-name */
/* eslint-enable react/jsx-closing-tag-location */

export default function FaqPage() {
  const config = useConfig();
  const [active, setActive] = useState<number | null>(null);
  
  return (
    <Layout className="FaqPage">
      <Section>
        <Segment>
          {questions.map(({ question, answer }, id) => <Question key={id} id={id} question={question} answer={answer(config)} open={active === id} onOpen={setActive} />)}
          <div>
            Have another question? Please contact us on <ExLink to={config.discordInvite}>Discord</ExLink> server or email us: <EmailLink address={config.contactEmailBase64} />
          </div>
        </Segment>
      </Section>
    </Layout>
  );
}

interface QuestionProps {
  id: number;
  question: string;
  answer: React.ReactNode;
  open: boolean;
  onOpen: (id: number | null) => void;
}

function Question({ id, question, answer, open, onOpen }: QuestionProps) {
  const onClick = useCallback(() => onOpen(open ? null : id), [open, id, onOpen]);
  const answerRef = useRef<HTMLDivElement>(null);
  
  return (
    <div className={classJoin("Question", open && "open")}>
      <h3 className="question" onClick={onClick}>Q{id + 1}. {question}</h3>
      <div className="answer" ref={answerRef} style={{ maxHeight: open && answerRef.current?.scrollHeight || undefined }}>{answer}</div>
    </div>
  );
}
