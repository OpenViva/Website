import React from "react";
import { Asset } from "../../../types/api";
import { categoryNames, subcategoryNames, THUMBNAIL_HEIGHT, THUMBNAIL_WIDTH } from "../../../server/helpers/cardUtils";
import "./AssetCard.scss";

interface AssetCardProps {
  asset: Asset;
}

export default function AssetCard({ asset }: AssetCardProps) {
  return (
    <a className="AssetCard" href={`/assets/${asset.id}/${asset.file}`} download>
      <img src={`/assets/${asset.id}/thumbnail.jpg`} alt="thumbnail" width={THUMBNAIL_WIDTH} height={THUMBNAIL_HEIGHT} />
      <h3>{asset.name}</h3>
      <p>{asset.description}</p>
      <div><label>Uploader:</label> <span>{asset.creatorName}</span></div>
      <div><label>Category:</label> <span>{categoryNames[asset.category]} Card</span></div>
      <div><label>Subcategory:</label> <span>{subcategoryNames[asset.subcategory]}</span></div>
    </a>
  );
}
