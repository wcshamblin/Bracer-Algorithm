import React from "react";
import Form from "./common/form/form";
import BreederSummary from "./breederSummary";

class BreederBoxes extends Form {
  render() {
    const { breeders, deletePoke } = this.props;
    return (
      <div className="text-center card mt-3 container user-select-none">
        <h4>Breeders:</h4>
        <div className="row">
          {breeders.length === 0 ? (
            <p className="ml-4">Your box is empty.</p>
          ) : null}
          {breeders.map((breeder, index) => (
            <BreederSummary
              breeder={breeder}
              index={index}
              deletePoke={deletePoke}
            ></BreederSummary>
          ))}
        </div>
      </div>
    );
  }
}

export default BreederBoxes;
