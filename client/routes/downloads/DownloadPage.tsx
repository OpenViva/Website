import React, { useCallback, useState } from "react";
import { DownloadsPageResponse, Releases } from "../../../types/api";
import usePageData from "../../hooks/usePageData";
import Layout from "../../components/Layout";
import Section from "../../components/Section";
import Segment from "../../components/Segment";
import LoremIpsum from "../../components/LoremIpsum";
import ExLink from "../../components/ExLink";
import Button from "../../components/Button";
import "./DownloadPage.scss";

export default function DownloadPage() {
  const [pageData] = usePageData<DownloadsPageResponse>();
  const [active, setActive] = useState<number | null>(0);
  
  return (
    <Layout className="DownloadPage">
      <Section>
        <Segment>
          <LoremIpsum count={3} />
          <div className="list">
            {pageData?.releases?.map((release, id) => <Release key={release.id} release={release} id={id} active={active === id} setActive={setActive} />)}
          </div>
          <Button className="githubButton" content="More Versions" as={ExLink} to="https://github.com/OpenViva/OpenViva/releases/" />
        </Segment>
      </Section>
    </Layout>
  );
}

interface ReleaseProps {
  release: ArrayElement<Releases>;
  id: number;
  active: boolean;
  setActive: (id: number | null) => void;
}

function Release({ release, id, active, setActive }: ReleaseProps) {
  const onActiveToggle = useCallback((ev: React.MouseEvent) => {
    ev.preventDefault();
    setActive(active ? null : id);
  }, [active, id, setActive]);
  
  return (
    <div className="Release">
      <div className="header">
        <span className="name">
          {release.name}
          <span className="meta">{new Date(release.created_at).toLocaleDateString()}</span>
          {id === 0 && <span className="meta">(latest)</span>}
        </span>
        <div>
          <a href="#" onClick={onActiveToggle}>Notes&nbsp;{active ? "▲" : "▼"}</a>
          <ExLink to={release.html_url}>GitHub</ExLink>
          {release.assets[0] && <ExLink to={release.assets[0].browser_download_url}>Download</ExLink>}
        </div>
      </div>
      {/* eslint-disable-next-line @typescript-eslint/naming-convention */}
      {active && <div className="notes" dangerouslySetInnerHTML={{ __html: release.body_html || "" }} />}
    </div>
  );
}
