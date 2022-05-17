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
import useLocalUser from "../../hooks/useLocalUser";
import Profile from "./Profile";
import AssetCard from "./AssetCard";
import SearchControls from "./SearchControls";
import "./AssetsPage.scss";

export default function AssetsPage() {
  const { user } = useLocalUser();
  const [pageData] = usePageData<AssetsPageResponse>(false);
  const [searchParams] = useSearchParams();
  const search: AssetsPageRequest = qsParse(searchParams.toString());
  
  const { items, fetching, reset } = useEndlessPage<AssetsSearchResponse, AssetsSearchRequest, Asset>({
    pathname: "/api/assets",
    initialPage: pageData?.assets,
    search,
    responseMap: assets => assets,
  }, [searchParams]);
  
  return (
    <div className="AssetsPage">
      <Section vertical className="header">
        <Segment className="text">
          <Paragraph header="Mods & Cards">
            Here, you can find character and outfit cards.
          </Paragraph>
          <Paragraph>
            To install a character card, extract the zip file if it is zipped and move the &quot;Cards&quot; folder inside of the folder where &quot;viva.exe&quot; is located. If windows asks you to merge, click yes.<br />
            To install a clothing card, navigate into the &quot;Cards&quot; folder and then into the &quot;Clothes&quot; folder. You can then move the .png into the folder.<br />
            To submit a card, create an account and upload it. Once it is verified, it will appear here. If you are a card creator, we highly recommend joining the discord.
          </Paragraph>
        </Segment>
        <Profile />
      </Section>
      <Section className="controlsWrap">
        <SearchControls />
      </Section>
      <div className="cards">
        {items.map(asset => <AssetCard key={asset.id} asset={asset} admin={user?.admin} refresh={reset} />)}
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


