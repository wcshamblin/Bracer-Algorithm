import React from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { capitalize } from "../utils/capitalize";

const pokeSearch = ({ allPokes, data, url, handleInputChange }) => {
  const { eggGroups, name } = data;
  return (
    <div key={data.name}>
      <Typeahead
        id="typeahead"
        placeholder="Search Pokemon by name..."
        minLength={2}
        highlightOnlyResult
        onChange={(selected) => handleInputChange(selected)}
        options={allPokes}
      ></Typeahead>
      <div className="row">
        <div className="col-4 offset-4 my-3">
          <div className="imageParent">
            <img src={url} alt={name} />
          </div>
        </div>
        <div className="col-4 d-flex justify-content-center flex-column">
          {eggGroups.map((group, index) => (
            <p key={index} className="badge badge-secondary d-block">
              {capitalize(group)}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default pokeSearch;
