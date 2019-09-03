let create = tagName => {
  return { tagName: tagName, children: [], css: {} };
};

// addChild(..., [2,5,1,2], ...)
let addChild = (tree, location, newChild) => {
  ///when we are at the 'end' of the location coordinates, we can concat the new child to currrent children
  if (location.length === 0)
    return { ...tree, children: tree.children.concat(newChild) };
  let newChildren = [...tree.children];
  let newParent = newChildren[location[0]];
  newParent = addChild(newParent, location.slice(1), newChild);
  //this only happens after the end of the location has been hit, so you are already somewhere with known children
  newChildren[location[0]] = newParent;
  return { ...tree, children: newChildren };
};

let modifyElement = (tree, location, parameter, newValue) => {
  if (location.length === 0) return { ...tree, [parameter]: newValue };
  let newChildren = [...tree.children];
  let newParent = newChildren[location[0]];
  newParent = addChild(newParent, location.slice(1), newChild);
  newChildren[location[0]] = newParent;
  return { ...tree, children: newChildren };
};

let convert = (tree, location) => {
  return React.createElement(
    tree.tagName,
    {
      style: convertToReactCSS(tree.css),
      onClick: () => {
        dispatch({ type: "set-location", location: location });
      }
    },
    tree.children.map((ch, index) => convert(ch, location.concat(index)))
  );
};
