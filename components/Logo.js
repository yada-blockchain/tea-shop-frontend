import React from "react";

const Logo = () => {
  return (
    <div className="logo">
      {/* Les images importées depuis la balise IMG sont accessibles dans "public" */}
      <Image src="./logo.jpg" alt="logo react" />
      <h1 className="text-6xl font-bold text-green-600 mb-6">
        Buy Me A Tea
      </h1>{" "}
    </div>
  );
};

export default Logo;
