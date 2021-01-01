import React from "react";

const StickyFooter = ({ changePage }) => {
  const footer = {
    position: "fixed",
    bottom: "0",
    width: "100%",
    height: "50px",
    backgroundColor: "#f5f5f5",
    border: "1px solid rgba(0, 0, 0, 0.125)",
    borderRadius: "0.25rem",
  };

  return (
    <footer style={footer}>
      <div className="row text-center mt-2">
        <div className="col-4 offset-4">
          <button onClick={() => changePage(-1)} className="btn btn-primary">
            Prev
          </button>
          <button
            onClick={() => changePage(1)}
            className="btn btn-primary ml-2"
          >
            Next
          </button>
        </div>
      </div>
    </footer>
  );
};

export default StickyFooter;
