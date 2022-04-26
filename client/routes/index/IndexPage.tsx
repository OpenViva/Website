import React, { useEffect, useReducer } from 'react';
import { Segment } from "semantic-ui-react";
import { IndexPageResponse } from "../../../types/api";
import usePageData from "../../hooks/usePageData";
import "./IndexPage.scss";

const busyBraile = ['⠙', '⠸', '⢰', '⣠', '⣄', '⡆', '⠇', '⠋'];

export default function IndexPage() {
  const [pageData] = usePageData<IndexPageResponse>();
  const [counter, incCounter] = useReducer(acc => acc + 1, 0);
  
  useEffect(() => {
    const id = setInterval(incCounter, 100);
    return () => clearInterval(id);
  }, []);
  
  return (
    <div className="IndexPage">
      <Segment size="massive">
        {busyBraile[counter % busyBraile.length]}
        &ensp;
        {pageData?.kek}
        &ensp;
        {busyBraile[counter % busyBraile.length]}
      </Segment>
      <div className="bubbles">
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  );
}
