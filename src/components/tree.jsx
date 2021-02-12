import React, { Component } from "react";
import TreeCell from "./treeCell";
import { drawLines, countChildren, offsetCoords } from "../utils/lineRenderer";
import axios from "axios";

class Tree extends Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }

  state = { boxes: {}, loaded: 0, tree: {} };

  cancelTokenSource = axios.CancelToken.source();

  async componentDidMount() {
    const { data } = await this.props.getTree(this.cancelTokenSource);
    this.setState({ tree: data });
    this.drawTree();
  }

  componentDidUpdate() {
    this.drawTree();
  }

  componentWillUnmount() {
    this.cancelTokenSource.cancel("The POST request was canceled by the user.");
  }

  pageIsLoaded() {
    const { loaded, tree } = this.state;
    if (loaded === countChildren(tree)) {
      return true;
    }
    return false;
  }

  drawTree = () => {
    if (this.pageIsLoaded()) {
      const { boxes } = this.state;
      const canvas = this.inputRef.current;
      drawLines(boxes, canvas);
    }
  };

  logCoordinates = (box, level, index) => {
    const canvas = this.inputRef.current;
    const offset = canvas.getBoundingClientRect();
    const boxes = { ...this.state.boxes };
    boxes[level] = { ...boxes[level] };
    boxes[level][index] = offsetCoords(box, offset);
    this.setState({ boxes, loaded: this.state.loaded + 1 });
  };

  render() {
    const { target } = this.props;
    const { tree } = this.state;
    const levels = Object.keys(tree);

    return (
      <div className="user-select-none">
        <div className="d-flex justify-content-center relative">
          {levels.map((level) => (
            <div
              key={level}
              className="col-2 d-inline-block d-flex flex-column justify-content-between text-center"
            >
              <br></br>
              {tree[level].map((item, index) => (
                <div key={level + index}>
                  <TreeCell
                    item={item}
                    target={target}
                    level={level}
                    index={index}
                    logCoordinates={this.logCoordinates}
                  ></TreeCell>
                </div>
              ))}

              <br></br>
            </div>
          ))}
          <canvas className="canvas" ref={this.inputRef}></canvas>
        </div>
      </div>
    );
  }
}

export default Tree;
