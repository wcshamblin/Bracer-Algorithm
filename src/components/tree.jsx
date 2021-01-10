import React, { Component } from "react";
import TreeCell from "./treeCell";

class Tree extends Component {
  state = {};

  render() {
    const { getTree, tree, target } = this.props;
    console.log("TREE", tree);

    return (
      <div className="user-select-none">
        <div className="text-center my-5">
          <button className="btn btn-primary" onClick={getTree}>
            Calculate!
          </button>
        </div>
        <div className="d-flex">
          {Object.keys(tree).map((level) => (
            <div className="col-2 d-inline-block">
              <p>{level}x</p>
              {tree[level].map((item) => (
                <TreeCell item={item} target={target} level={level}></TreeCell>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Tree;
