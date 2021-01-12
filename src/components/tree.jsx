import React, { Component } from "react";
import TreeCell from "./treeCell";

class Tree extends Component {
  state = {};

  render() {
    const { getTree, tree, target } = this.props;
    const levels = Object.keys(tree);
    console.log("TREE", tree);

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
                  {/* {index % 2 === 0 && <div className="connector"></div>} */}
                </React.Fragment>
              ))}
              <br></br>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Tree;
