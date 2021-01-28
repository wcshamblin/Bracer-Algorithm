import React from "react";
import Form from "./common/form/form";
import BreederSummary from "./breederSummary";

class BreederBoxes extends Form {
  render() {
    const { breeders, deletePoke, target } = this.props;
    return (
      <React.Fragment>
        <h4 className="text-center user-select-none my-3">Breeders:</h4>
        <div className="container card">
          <div className="row">
            {breeders.length === 0 ? (
              <p className="m-5 user-select-none">
                Your box is currently empty. <br></br> If you do not own any
                breeders yet and plan to purchase them all, please skip this
                step.
              </p>
            ) : null}
            {breeders.reverse().map((breeder, index) => (
              <BreederSummary
                breeder={breeder}
                index={index}
                deletePoke={deletePoke}
                target={target}
                key={index}
              ></BreederSummary>
            ))}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default BreederBoxes;
