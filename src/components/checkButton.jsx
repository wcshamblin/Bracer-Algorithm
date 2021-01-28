import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faCheck } from "@fortawesome/free-solid-svg-icons";

const CheckButton = ({ stat, active, disableStat }) => {
  return (
    <React.Fragment>
      <button
        onClick={() => disableStat(stat)}
        className={`btn btn-${active[stat] ? "success" : "danger"}`}
        type="button"
      >
        <FontAwesomeIcon
          icon={active[stat] ? faCheck : faBan}
        ></FontAwesomeIcon>
      </button>
    </React.Fragment>
  );
};

export default CheckButton;
