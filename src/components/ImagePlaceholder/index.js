import React from "react";
import { ASSETS_URL } from "../../utils/constans";

const ImagePlaceholder = () => {
  return (
    <div className="image-placeholder">
      <img
        src={`${ASSETS_URL}/images/sentinel-online.svg`}
        className="placeholder-image"
        alt="Sentinel News"
        itemProp="contentUrl"
      />
    </div>
  );
};

export default ImagePlaceholder;
