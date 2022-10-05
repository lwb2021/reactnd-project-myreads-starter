import React from "react";
import { usePromiseTracker } from "react-promise-tracker";
import { ThreeDots, MagnifyingGlass } from "react-loader-spinner";
import "./spinner.css";

export const Spinner = () => {
  const { promiseInProgress } = usePromiseTracker();
  return (
    promiseInProgress && (
      <div className="spinner">
        <ThreeDots
          height="150"
          width="150"
          radius="10"
          color="#2e7c31"
          ariaLabel="three-dots-loading"
          visible={true}
        />
      </div>
    )
  );
};

export const SpinnerSearch = () => {
  const { promiseInProgress } = usePromiseTracker();
  return (
    promiseInProgress && (
      <div className="spinner">
        <MagnifyingGlass
          visible={true}
          height="150"
          width="150"
          ariaLabel="MagnifyingGlass-loading"
          wrapperClass="MagnifyingGlass-wrapper"
          glassColor="#c0efff"
          color="#e15b64"
        />
      </div>
    )
  );
};
