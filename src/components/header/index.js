import React, { Component } from "react";
import { connect } from "dva";
import { fbInit } from "../../utils/config";
import { message } from "antd";
import * as api from "../../utils/fb_api";
import style from "./index.less";
import GlobalHeader from "../GlobalHeader/index";
import request from "utils/api";
import { host } from "utils/config";

class FbReportTool extends Component {
  state = {
    // 用户信息
    name: "尚未登录",
    avatar:
      "https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png"
  };

  componentDidMount() {
    // 注册.
    if (!window.FB) {
      fbInit();
      window.addEventListener("fb-sdk-ready", this.onFBReady);
    } else {
      this.onFBReady();
    }
  }
  componentWillUnmount() {
    window.removeEventListener("fb-sdk-ready", this.onFBReady);
  }

  // 注册完成
  onFBReady = () => {
    this.FbLogin();
  };

  // 登录
  FbLogin() {
    const { dispatch } = this.props;
    let { access_token, options } = this.getStorage();
    if (!access_token) {
      window.FB.login(
        async response => {
          console.log(response);
          if (response.authResponse) {
            let { accessToken } = response.authResponse;
            // 获取长期访问口令
            // let { access_token: token } = await api.getToken(accessToken);
            // 安全清单: 在客户端上使用唯一的短期口令。
            message.info("已成功登录");
            localStorage.setItem("access_token", accessToken);

            this.getLongToken(accessToken);
            // 获取用户信息
            this.getUser();
            this.getNewAdaccounts();
          } else {
            message.info("请您先登录facebook");
          }
        },
        { scope: "ads_read,ads_management,manage_pages,instagram_basic" }
      );
    } else {
      // 获取用户信息
      this.getUser();
      options.length === 0
        ? this.getNewAdaccounts()
        : dispatch({ type: "global/set_options", payload: options });
      // this.getLongToken(access_token);
    }
  }

  // 获取长期口令
  getLongToken(accessToken) {
    request({
      url: `${host}/api/token`,
      method: "GET",
      params: {
        accessToken
      },
      success(res) {
        if(res.status === 1) {
          localStorage.setItem("access_token", res.access_token);
        }
      }
    });
  }

  // 获取fb账号信息
  async getUser() {
    const { global_name, global_avatar, dispatch } = this.props;
    if (!global_name && !global_avatar) {
      const { name, avatar } = await api.getUser();
      dispatch({ type: "global/set_name", payload: name });
      dispatch({ type: "global/set_avatar", payload: avatar });
      this.setState({
        name,
        avatar
      });
    } else {
      this.setState({
        name: global_name,
        avatar: global_avatar
      });
    }
  }

  // 重新登录
  resetLogin = () => {
    if (localStorage.getItem("access_token"))
      localStorage.removeItem("access_token");
    this.FbLogin();
  };

  // 退出登录
  logout = () => {
    window.FB.logout(function(response) {
      console.log(response);
      // Person is now logged out
      message.info("退出成功");
      this.setState({
        name: "尚未登录",
        avatar:
          "https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png"
      });
    });
  };

  // 获取本地Storage
  getStorage() {
    this.props.dispatch({
      type: "global/set_adaccount_id",
      payload: localStorage.getItem("adaccount_id")
    });
    return {
      access_token: localStorage.getItem("access_token"),
      options: JSON.parse(localStorage.getItem("options"))
    };
  }

  // 重新获取广告账户
  getNewAdaccounts = async () => {
    const { dispatch } = this.props;
    let options = await api.getAdaccounts();
    dispatch({ type: "global/set_options", payload: options });
    localStorage.setItem("options", JSON.stringify(options));

    message.success("广告账户获取成功");
  };

  // 更换广告账户->清除广告账户下的缓存
  clearCache() {
    const { dispatch } = this.props;
    dispatch({ type: "global/set_adimages_cache", payload: null });
    dispatch({ type: "global/set_advideos_cache", payload: null });
    dispatch({ type: "global/set_adimages", payload: [] });
    dispatch({ type: "global/set_advideos", payload: [] });
    dispatch({ type: "global/set_pixcel_id", payload: null });
    dispatch({ type: "global/set_application", payload: null });
    dispatch({ type: "global/set_pages_cache", payload: null });
    dispatch({ type: "global/set_campaigns", payload: [] });
    dispatch({ type: "global/set_adsets", payload: [] });
    dispatch({ type: "global/set_ads", payload: [] });
    dispatch({ type: "global/set_images", payload: [] });
    dispatch({ type: "global/set_videos", payload: [] });
    dispatch({
      type: "global/set_campaigns_cache",
      payload: {
        // 是否可以请求新数据
        isFetch: true,
        data: []
      }
    });
    dispatch({ type: "global/set_instagram_accounts_cache", payload: null });
  }

  render() {
    const { dispatch, options, adaccount_id } = this.props;
    return (
      <div className={style.face_container}>
        <GlobalHeader
          currentUser={{
            name: this.state.name,
            avatar: this.state.avatar,
            userid: "00000001",
            notifyCount: 12
          }}
          onMenuClick={e => {
            // 菜单点击
            this[e.key]();
          }}
          options={options}
          adaccount_id={adaccount_id}
          onChange={id => {
            localStorage.setItem("adaccount_id", id);
            // 更换账户同时 清除缓存与账户相关的数据
            if (adaccount_id !== id) {
              this.clearCache();
            }
            dispatch({ type: "global/set_adaccount_id", payload: id });
          }}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    options: state.global.options,
    adaccount_id: state.global.adaccount_id,
    global_name: state.global.name,
    global_avatar: state.global.avatar
  };
};

export default connect(mapStateToProps)(FbReportTool);
