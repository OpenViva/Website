import React, { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { AssetCategory, AssetsPageRequest, AssetSubcategory, Order } from "../../../types/api";
import { subcategoryNames } from "../../../server/helpers/cardUtils";
import CheckButton from "../../components/CheckButton";
import { qsParse, qsStringify } from "../../helpers/utils";
import Dropdown from "../../components/Dropdown";
import useLocalUser from "../../hooks/useLocalUser";
import CheckButtonGroup from "../../components/CheckButtonGroup";
import "./SearchControls.scss";

const categoryItems = [
  { value: AssetCategory.CHARACTER, text: "Characters" },
  { value: AssetCategory.CLOTHING, text: "Clothing" },
];

const subItems = [...new Set(Object.values(subcategoryNames))].filter(sub => sub !== subcategoryNames[AssetSubcategory.UNKNOWN] && sub !== subcategoryNames[AssetSubcategory.CHARACTER])
                                                              .map(sub => ({ value: sub, text: sub }));

const sortItems = [
  { text: "Newest First", value: ["created", Order.DESC] },
  { text: "Oldest First", value: ["created", Order.ASC] },
  { text: "Name A-Z", value: ["name", Order.ASC] },
  { text: "Name Z-A", value: ["name", Order.DESC] },
];

export default function SearchControls() {
  const { user } = useLocalUser();
  const [searchParams, updateSearch] = useSearchParams();
  const search: AssetsPageRequest = qsParse(searchParams.toString());
  
  if(search.approved) search.approved = (search.approved as any) === "true";
  
  const onCategoryChange = useCallback((category) => {
    updateSearch(qsStringify({
      ...search,
      category,
      subcategory: category !== AssetCategory.CLOTHING ? [] : search.subcategory,
    }));
  }, [search, updateSearch]);
  
  const onSubcategoryChange = useCallback((subcategory) => {
    const subs = Object.values(AssetSubcategory).filter(sub => subcategory.includes(subcategoryNames[sub]));
    
    updateSearch(qsStringify({ ...search, subcategory: subs }));
  }, [search, updateSearch]);
  
  const onSortChange = useCallback(([sort, order]) => {
    updateSearch(qsStringify({
      ...search, sort, order,
    }));
  }, [search, updateSearch]);
  
  const onTextChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
    updateSearch(qsStringify({
      ...search,
      text: ev.currentTarget.value,
    }));
  }, [search, updateSearch]);
  
  const onUnapprovedChange = useCallback(unapproved => {
    updateSearch(qsStringify({
      ...search,
      approved: !unapproved && undefined, // use undefined instead of true
    }));
  }, [search, updateSearch]);
  
  const subsDefault = search.subcategory?.map(sub => subcategoryNames[sub]);
  
  return (
    <div className="SearchControls">
      <span>Filters:</span>
      <CheckButtonGroup defaultValue={search.category} radio nullItem="All Cards" items={categoryItems} onChange={onCategoryChange} />
      <Dropdown text="⋯">
        <CheckButtonGroup defaultValue={subsDefault} nullItem="Show All" items={subItems} onChange={onSubcategoryChange} />
      </Dropdown>
      
      <div className="divider" />
      
      <Dropdown text={`${(sortItems.find(({ value: [sort, order] }) => sort === search.sort && order === search.order) || { text: "Sorting" }).text} ▾`}>
        <CheckButtonGroup onChange={onSortChange} radio items={sortItems} />
      </Dropdown>
      
      <div className="divider" />
      
      {user?.admin && <>
        <CheckButton name="approved" text="Unapproved" type="checkbox"
                     checked={search.approved === false}
                     onChange={onUnapprovedChange} />
        
        <div className="divider" />
      </> /* eslint-disable-line react/jsx-closing-tag-location */ }
      
      <input value={search.text || ""} placeholder="Text search..." onChange={onTextChange} />
    </div>
  );
}
