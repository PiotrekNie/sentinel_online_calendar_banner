function Tooltip(props) {
  const { verticalOrientation, horizontalOrientation, children } = props;

  return (
    <div
      className={`tooltip vartical-orientation-${verticalOrientation} horizontal-orientation-${horizontalOrientation}`}
    >
      {children}
    </div>
  );
}

export default Tooltip;
