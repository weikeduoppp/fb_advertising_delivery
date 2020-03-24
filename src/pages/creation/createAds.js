import React from "react";
import AdsForm from '../ads/_Form'
export default React.memo((param) => {
  return (
    <div>
      <AdsForm {...param} />
    </div>
  );
});
