import React from "react";
import _ from "lodash";

const StickyFooter = ({ changePage, page, pageMin, pageMax, target }) => {
  function isDisabled(minmax) {
    if (
      page === minmax ||
      _.isEmpty(target) ||
      !_.isEmpty(target.errors) ||
      target.data.name.length === 0 ||
      target.data.eggGroups[0] === "Cannot breed"
    ) {
      return true;
    }
    return false;
  }

  const buttons = [
    { num: pageMin, inc: -1, label: "Prev" },
    { num: pageMax, inc: 1, label: "Next" },
  ];

  return (
    <footer className="stickyFooter">
      <div className="row text-center mt-2 d-flex justify-content-center">
        {buttons.map(({ num, inc, label }) => (
          <button
            key={num}
            onClick={() => changePage(inc)}
            className={`mx-1 btn btn-primary ${
              isDisabled(num) ? "disabled" : null
            }`}
            disabled={isDisabled(num)}
          >
            {label}
          </button>
        ))}
      </div>
    </footer>
  );
};

export default StickyFooter;
