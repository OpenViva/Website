import React from "react";
import { useSearchParams } from "react-router-dom";
import { Asset, AssetsPageRequest, AssetsPageResponse, AssetsSearchRequest, AssetsSearchResponse } from "../../../types/api";
import { qsParse } from "../../helpers/utils";
import useEndlessPage from "../../hooks/useEndlessPage";
import usePageData from "../../hooks/usePageData";
import Section from "../../components/Section";
import Segment from "../../components/Segment";
import Paragraph from "../../components/Paragraph";
import Placeholders from "../../components/Placeholders";
import Loader from "../../components/Loader";
import Profile from "./Profile";
import AssetCard from "./AssetCard";
import SearchControls from "./SearchControls";
import "./AssetsPage.scss";

export default function AssetsPage() {
  const [pageData] = usePageData<AssetsPageResponse>(false);
  const [searchParams] = useSearchParams();
  const search: AssetsPageRequest = qsParse(searchParams.toString());
  
  const { items, fetching } = useEndlessPage<AssetsSearchResponse, AssetsSearchRequest, Asset>({
    pathname: "/api/assets",
    initialPage: pageData?.assets,
    search,
    responseMap: assets => assets,
  }, [searchParams]);
  
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
      <Section className="controlsWrap">
        <SearchControls />
      </Section>
      <div className="cards">
        {items.map(asset => <AssetCard key={asset.id} asset={asset} />)}
        <Placeholders count={10} />
        {fetching &&
          <div className="loaderWrap">
            <Loader />
          </div>
        }
        {!fetching && items.length === 0 &&
          <div className="noResults">
            No results found.
          </div>
        }
      </div>
    </div>
  );
}


