import React from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";

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
        <div className="col-md-4 offset-md-4 col-6 my-3">
          <div className="imageParent">
            <img src={url} alt={name} />
          </div>
        </div>
        <div className="col-md-4 col-6 d-flex justify-content-center flex-column">
          {eggGroups.map((group, index) => (
            <p key={index} className="badge badge-secondary d-block">
              {group}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default pokeSearch;
