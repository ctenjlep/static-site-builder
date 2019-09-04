import React, { Component } from "react";
import { connect } from "react-redux";
import MakeElement from "./components/MakeElement.jsx";
import TreeVisualizer from "./components/TreeVisualizer.jsx";
import formattedTags from "../sideWork/tags.jsx";
import Tree from "./components/Tree.jsx";
import IframeDestinationSelector from "./components/IframeDestinationSelector.jsx";
import { produce } from "immer";

class UnconnectedApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productionTree: "",
      treeVisible: false,
      elementMakerVisible: true,
      treeVisible: true,
      iframeVisible: true,
      selectedCss: {}
    };
  }

  componentDidMount() {
    this.TreeVisualizerClassSwitch();
  }

  hideTree = async event => {
    if (this.state.treeVisible === false) {
      this.setState({ treeVisible: true });
      return;
    } else {
      this.setState({ treeVisible: false });
    }
  };

  hideElementMaker = async event => {
    if (this.state.elementMakerVisible === false) {
      this.setState({ elementMakerVisible: true });
      return;
    } else {
      this.setState({ elementMakerVisible: false });
    }
  };
  hideIframe = async event => {
    if (this.state.iframeVisible === false) {
      this.setState({ iframeVisible: true });
      return;
    } else {
      this.setState({ iframeVisible: false });
    }
  };

  ///hide the element maker on the page using CSS
  ElementMakerClassSwitch = () => {
    if (this.state.elementMakerVisible === true) {
      return "spaceBetween";
    } else {
      return "spaceBetween hide";
    }
  };

  ///hide the tree visualizer on the page using CSS
  TreeVisualizerClassSwitch = () => {
    if (this.state.treeVisible === true) {
      return "";
    } else {
      return "hideTree";
    }
  };

  iframeClassSwitch = () => {
    if (this.state.iframeVisible === true) {
      return "iframe";
    } else {
      return "hideIframe iframe";
    }
  };

  isThisSelected = (selectedLocation, thisLocation) => {
    if (selectedLocation === thisLocation) {
      return "selectedHighlight";
      console.log("selected location", selectedLocation);
    }
    return "";
  };

  convert = (tree, location) => {
    if (tree.tagName !== undefined && tree.tagName !== "img") {
      return React.createElement(
        tree.tagName,
        {
          style: tree.css,
          src: tree.src,
          href: tree.href,
          className: this.isThisSelected(this.props.location, location),
          onClick: event => {
            event.stopPropagation();
            this.props.dispatch({
              type: "store-node-props",
              location: location,
              css: tree.css,
              href: tree.href,
              src: tree.src
            });
          },
          key: location
        },
        tree.children.map((ch, index) =>
          this.convert(ch, location.concat(index))
        )
      );
    }
    if (tree.tagName === "img") {
      return React.createElement(tree.tagName, {
        style: tree.css,
        src: tree.src,
        href: tree.href,
        className: this.isThisSelected(this.props.location, location),
        onClick: event => {
          event.stopPropagation();
          this.props.dispatch({
            type: "store-node-props",
            location: location,
            css: tree.css,
            href: tree.href,
            src: tree.src
          });
        },
        key: location
      });
    }
    return tree;
  };

  origin = "";
  render = () => {
    return (
      <div className="flexColumn overflowAuto">
        <div className="fullWidth clearBoth lessMarginTop">
          <div className={this.ElementMakerClassSwitch() + " elementMaker"}>
            <div className="lessMargin">
              <h1 className="centerText smallMarginTop">•BUILDER•</h1>
              <div className="twelvePt flex smallMargin">
                SELECT A REFERENCE SITE: <IframeDestinationSelector />
              </div>
              <div className="eightPt">
                SELECTED TREE LOCATION: {this.props.location}
              </div>
              <div className="eightPt smallMargin">
                CSS AT CURRENT LOCATION:{" "}
                {JSON.stringify(this.props.css, null, 2)}
              </div>

              <MakeElement />
            </div>
          </div>
          <div className="Tree"></div>
          <div className="flexColumn">
            <div className={this.TreeVisualizerClassSwitch()}>
              <div className="treeVisualizer onTop">
                <Tree />{" "}
              </div>
            </div>
            <div className="relative flexEven underTree smallMargin lessMarginTop">
              <button className="myButton" onClick={this.hideTree}>
                TOGGLE TREE DISPLAY
              </button>
              <button className="myButton" onClick={this.hideElementMaker}>
                TOGGLE BUILDER DISPLAY
              </button>
              <button className="myButton" onClick={this.hideIframe}>
                TOGGLE IFRAME
              </button>
            </div>
          </div>
          <div className="posAbs onTop">
            {this.convert(this.props.tree, this.origin)}
          </div>
        </div>
        <div className={"posRel clearBoth " + this.iframeClassSwitch()}>
          {<iframe className="iframeSite" src={this.props.iframeSrc} />}
        </div>
      </div>
    );
  };
}

let mapStateToProps = state => ({
  tree: state.tree,
  location: state.location,
  css: state.css,
  href: state.href,
  src: state.src,
  iframeSrc: state.iframeSrc
});

let App = connect(mapStateToProps)(UnconnectedApp);

export default App;
