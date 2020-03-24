import { Layout, Menu, Icon } from "antd";
import style from "./_slideLayout.less";
import Link from "umi/link";
import FBHeader from "../header/index";
const { Header, Content, Footer, Sider } = Layout;

export default ({ header, children, pathname = "/campaign" }) => {
  return (
    <Layout className={style.layout}>
      <Sider
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0
        }}
      >
        <div className={style.logo}>
          <Link className={style.logo_title} to="/">
            {header}
          </Link>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["/campaign"]}
          selectedKeys={[pathname]}
        >
          <Menu.Item key="/campaign">
            <Icon type="credit-card" />
            <Link to="/campaign" className="nav-text">
              Campaign
            </Link>
          </Menu.Item>
          <Menu.Item key="/adset">
            <Icon type="appstore" />
            <Link to="/adset" className="nav-text">
              Adset
            </Link>
          </Menu.Item>
          <Menu.Item key="/ad">
            <Icon type="block" />
            <Link to="/ad" className="nav-text">
              Ads
            </Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout style={{ marginLeft: 200 }}>
        <Header style={{ background: "#fff", padding: 0 }}>
          <FBHeader />
        </Header>
        <Content style={{ margin: "24px 16px 0" }}>
          <div style={{ padding: 24, background: "#fff", minHeight: 360 }}>
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>2020</Footer>
      </Layout>
    </Layout>
  );
};
