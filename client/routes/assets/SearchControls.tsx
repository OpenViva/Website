import React, { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { AssetCategory, AssetsPageRequest, AssetSubcategory, Order } from "../../../types/api";
import { subcategoryNames } from "../../../server/helpers/cardUtils";
import RadioButton from "../../components/RadioButton";
import { qsParse, qsStringify } from "../../helpers/utils";
import Dropdown from "../../components/Dropdown";
import "./SearchControls.scss";

const subButtons = [...new Set(Object.values(subcategoryNames))].filter(sub => sub !== subcategoryNames[AssetSubcategory.UNKNOWN] && sub !== subcategoryNames[AssetSubcategory.CHARACTER]);

/* eslint-disable @typescript-eslint/naming-convention */
const sorts = {
  "Newest First": ["created", Order.DESC],
  "Oldest First": ["created", Order.ASC],
  "Name A-Z": ["name", Order.ASC],
  "Name Z-A": ["name", Order.DESC],
};
/* eslint-enable @typescript-eslint/naming-convention */

export default function SearchControls() {
  const [searchParams, updateSearch] = useSearchParams();
  const search: AssetsPageRequest = qsParse(searchParams.toString());
  
  const onCategoryChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
    updateSearch(qsStringify({
      ...search,
      subcategory: ev.currentTarget.value !== AssetCategory.CLOTHING ? [] : search.subcategory,
      category: ev.currentTarget.value !== "None" ? [ev.currentTarget.value] : undefined,
    }));
  }, [search, updateSearch]);
  
  const onSubcategoryChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
    const value = ev.currentTarget.value;
    let subcategory: AssetSubcategory[] | undefined;
    
    if(value === "None") subcategory = undefined;
    else if(search.subcategory?.find(sub => subcategoryNames[sub] === value)) subcategory = search.subcategory.filter(sub => subcategoryNames[sub] !== value);
    else subcategory = [...(search.subcategory || []), ...Object.values(AssetSubcategory).filter(sub => subcategoryNames[sub] === value)];
    console.log(subcategory);
    
    updateSearch(qsStringify({
      ...search,
      subcategory,
      category: [AssetCategory.CLOTHING],
    }));
  }, [search, updateSearch]);
  
  const onSortChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
    const sort = ev.currentTarget.value as keyof typeof sorts;
    
    updateSearch(qsStringify({
      ...search,
      sort: sorts[sort][0],
      order: sorts[sort][1],
    }));
  }, [search, updateSearch]);
  
  const onTextChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
    updateSearch(qsStringify({
      ...search,
      text: ev.currentTarget.value,
    }));
  }, [search, updateSearch]);
  
  return (
    <div className="SearchControls">
      <span>Filters:</span>
      <RadioButton id="categoryAll" name="category" text="All Cards"
                   value="None"
                   active={!search.category || search.category.length === 0}
                   onChange={onCategoryChange} />
      <RadioButton id="categoryCha" name="category" text="Characters"
                   value={AssetCategory.CHARACTER}
                   active={!!search.category?.includes(AssetCategory.CHARACTER)}
                   onChange={onCategoryChange} />
      <RadioButton id="categoryClo" name="category" text="Clothing"
                   value={AssetCategory.CLOTHING}
                   active={!!search.category?.includes(AssetCategory.CLOTHING)}
                   onChange={onCategoryChange} />
      <Dropdown text="⋯">
        <RadioButton id="subAll" name="subcategory" text="Show All" type="checkbox" muted
                     value="None"
                     active={!search.subcategory || search.subcategory.length === 0}
                     onChange={onSubcategoryChange} />
        {subButtons.map(subcategory => <RadioButton key={subcategory} id={`sub${subcategory}`} name="subcategory" text={subcategory} type="checkbox" muted
                                                    value={subcategory}
                                                    active={!!search.subcategory?.find(sub => subcategoryNames[sub] === subcategory)}
                                                    onChange={onSubcategoryChange} />)}
      </Dropdown>
      
      <div className="divider" />
      
      <Dropdown text={`${(Object.entries(sorts).find(([name, [sort, order]]) => sort === search.sort && order === search.order) || ["Sorting"])[0]} ▾`}>
        {Object.keys(sorts).map(sort => <RadioButton key={sort} id={"sort" + sort} name="sort" text={sort} muted
                                                     value={sort}
                                                     active={search.sort === sorts[sort as keyof typeof sorts][0] && search.order === sorts[sort as keyof typeof sorts][1]}
                                                     onChange={onSortChange} />)}
      </Dropdown>
      
      <div className="divider" />
      
      <input value={search.text || ""} placeholder="Text search..." onChange={onTextChange} />
    </div>
  );
}
