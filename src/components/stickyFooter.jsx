import React from "react";
import _ from "lodash";

const StickyFooter = ({ changePage, page, pageMin, pageMax, target }) => {
  const footer = {
    position: "fixed",
    bottom: "0",
    width: "100%",
    height: "50px",
    backgroundColor: "#f5f5f5",
    border: "1px solid rgba(0, 0, 0, 0.125)",
    borderRadius: "0.25rem",
  };

  function isDisabled(minmax) {
    if (page === minmax || _.isEmpty(target) || target.data.name.length === 0) {
      return true;
    }
    return false;
  }

  const buttons = [
    { num: pageMin, inc: -1, label: "Prev" },
    { num: pageMax, inc: 1, label: "Next" },
  ];

  return (
    <footer style={footer}>
      <div className="row text-center mt-2">
        <div className="col-4 offset-4">
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
      </div>
    </footer>
  );
};

export default StickyFooter;
