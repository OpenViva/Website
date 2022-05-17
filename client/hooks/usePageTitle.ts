import React, { useContext, useEffect } from "react";

// eslint-disable-next-line @typescript-eslint/naming-convention
export const PageTitleContext = React.createContext((title: string) => {
  useEffect(() => {
    document.title = title;
  }, [title]);
});

// eslint-disable-next-line @typescript-eslint/naming-convention
export const PageTitleProvider = PageTitleContext.Provider;

export default function usePageTitle(title?: string) {
  let full;
  if(title) full = `OpenViva - ${title}`;
  else full = `OpenViva`;
  
  return useContext(PageTitleContext)(full);
}
