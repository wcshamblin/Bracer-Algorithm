import React from "react";

const StickyFooter = ({ changePage, page, pageMin, pageMax }) => {
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
    let className = "btn btn-primary";
    if (page === minmax) {
      className += " disabled";
    }
    return className;
  }

  return (
    <footer style={footer}>
      <div className="row text-center mt-2">
        <div className="col-4 offset-4">
          <button
            onClick={() => changePage(-1)}
            className={isDisabled(pageMin)}
          >
            Prev
          </button>
          <button onClick={() => changePage(1)} className={isDisabled(pageMax)}>
            Next
          </button>
        </div>
      </div>
    </footer>
  );
};

export default StickyFooter;
