import React, { Component } from "react";
import TreeCell from "./treeCell";

class Tree extends Component {
  state = {};

  render() {
    const { getTree, tree, target } = this.props;
    const levels = Object.keys(tree);

    return (
      <div className="user-select-none">
        <div className="text-center my-5">
          <button className="btn btn-primary" onClick={getTree}>
            Calculate!
          </button>
        </div>
        <div className="d-flex justify-content-center">
          {levels.map((level) => (
            <div className="col-2 d-inline-block d-flex flex-column justify-content-between text-center">
              {/* <p>{level}x</p> */}
              <br></br>
              {tree[level].map((item, index) => (
                <React.Fragment>
                  <TreeCell
                    item={item}
                    target={target}
                    level={level}
                    index={index}
                  ></TreeCell>
                </React.Fragment>
              ))}
              <br></br>
            </div>
          ))}
        </div>
        {/* <svg>
          <line
            x1="0"
            y1="0"
            x2="100"
            y2="100"
            stroke-width="1"
            stroke="black"
          />
        </svg> */}
      </div>
    );
  }
}

export default Tree;
