import React from "react";
import ReactDom from "react-dom";
import './search.less'
import logo from '../assets/images/delIcon.png'
class Search extends React.Component {
  render() {
    return <div className="ttt">
        <div>logo</div>
        <img src={logo} alt="" />
        <div>你可以的</div>
    </div>;
  }
}

ReactDom.render(<Search />, document.getElementById("root"));
