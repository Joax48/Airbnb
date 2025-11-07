import React from "react";

const Container = ({ children }) => {
  return (
    <div style={{
      width: "100%",
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "0 1.5rem",
      boxSizing: "border-box"
    }}>
      {children}
    </div>
  );
};

export default Container;
