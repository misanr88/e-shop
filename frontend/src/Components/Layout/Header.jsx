import React from "react";
import styles from "../../styles/styles";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <>
      <div className={`${styles.section}`}>
        <div className="hidden 800px:h-[50px] 800px:my-[20px] 800px:flex items-center justify-between">
          <div>
            <Link to="/">
              <img
                src="https://shopo.quomodothemes.website/assets/images/logo.svg"
                alt=""
              />
            </Link>
          </div>
          {/* search box */}
          <div className="w-[50%] relative"></div>
        </div>
      </div>
    </>
  );
};

export default Header;
