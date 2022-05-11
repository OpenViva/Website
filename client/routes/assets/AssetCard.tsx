import React, { useCallback } from "react";
import { Asset, AssetUpdateRequest } from "../../../types/api";
import { categoryNames, subcategoryNames, THUMBNAIL_HEIGHT, THUMBNAIL_WIDTH } from "../../../server/helpers/cardUtils";
import requestJSON from "../../helpers/requestJSON";
import "./AssetCard.scss";

interface AssetCardProps {
  asset: Asset;
  admin?: boolean;
  refresh?: () => void;
}

export default function AssetCard({ asset, admin, refresh }: AssetCardProps) {
  const onApprove = useCallback(async (ev: React.MouseEvent) => {
    ev.preventDefault();
    
    await requestJSON<any, AssetUpdateRequest>({
      url: `/api/assets/${asset.id}`,
      method: "PATCH",
      data: {
        approved: !asset.approved,
      },
    });
    
    if(refresh) refresh();
  }, [asset, refresh]);
  
  const onDelete = useCallback(async (ev: React.MouseEvent) => {
    ev.preventDefault();
    
    await requestJSON({
      url: `/api/assets/${asset.id}`,
      method: "DELETE",
    });
    
    if(refresh) refresh();
  }, [asset, refresh]);
  
  return (
    <div className="AssetCard">
      <a href={`/assets/${asset.id}/${asset.file}`} download className="cardLink">
        <img src={`/assets/${asset.id}/thumbnail.jpg`} alt="thumbnail" width={THUMBNAIL_WIDTH} height={THUMBNAIL_HEIGHT} />
      </a>
      <h3>{asset.name}</h3>
      <p>{asset.description}</p>
      <div><label>Uploader:</label> <span>{asset.creatorName}</span></div>
      <div><label>Category:</label> <span>{categoryNames[asset.category]} Card</span></div>
      <div><label>Subcategory:</label> <span>{subcategoryNames[asset.subcategory]}</span></div>
      <div><label>Uploaded:</label> <span>{new Date(asset.created).toLocaleDateString()}</span></div>
      {admin &&
        <div className="buttons">
          {!asset.approved && <a href="#" className="approve" onClick={onApprove}>Approve</a>}
          {asset.approved && <a href="#" className="unapprove" onClick={onApprove}>Unapprove</a>}
          <a href="#" className="delete" onClick={onDelete}>Delete</a>
        </div>
      }
    </div>
  );
}
