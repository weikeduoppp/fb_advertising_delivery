import { connect } from "dva";
import withRouter from "umi/withRouter";
import Layout from "../components/_slideLayout/index";
function BasicLayout({ children, count, location: { pathname } }) {
  return (
    <>
      {/* <div id="fb-root"></div>
      <script
        async
        defer
        crossOrigin="anonymous"
        src="https://connect.facebook.net/zh_CN/sdk.js#xfbml=1&version=v4.0&appId=2327900167245519&autoLogAppEvents=1"
      ></script> */}
      <Layout header="广告投放工具" children={children} pathname={pathname} />
    </>
  );
}

const mapStateToProps = state => {
  return {
    count: state.global.count
  };
};

export default withRouter(connect(mapStateToProps)(BasicLayout));
