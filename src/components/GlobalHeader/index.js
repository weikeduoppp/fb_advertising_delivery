import React, { PureComponent } from 'react';
import { Menu, Icon, Spin, Dropdown, Avatar, Select} from 'antd';
import styles from './index.less';
const { Option } = Select;
export default class GlobalHeader extends PureComponent {

  onChange = (e) => {
    this.props.onChange(e);
  }

  render() {
    const { currentUser = {}, onMenuClick, options, adaccount_id } = this.props;
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item key="resetLogin">
          <Icon type="close-circle" />
          Facebook登录
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="getNewAdaccounts">
          <Icon type="logout" />
          获取广告账户
        </Menu.Item>
        {/* <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" />
          退出登录
        </Menu.Item> */}
      </Menu>
    );
    return (
      <div className={styles.header + " clearfix"}>
        <div className={styles.left}>
          <Select
            showSearch
            style={{ width: 400 }}
            placeholder="请选择广告账户"
            optionFilterProp="children"
            onChange={this.onChange}
            value={adaccount_id || undefined}
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
          >
            {options.map((item, i) => (
              <Option key={item.id} value={item.id}>
                {item.name + "-" + item.id}
              </Option>
            ))}
          </Select>
          
        </div>
        <div className={styles.right}>
          {currentUser.name ? (
            <Dropdown overlay={menu}>
              <span className={`${styles.action} ${styles.account}`}>
                <Avatar
                  size="small"
                  className={styles.avatar}
                  src={currentUser.avatar}
                />
                <span className={styles.name}>{currentUser.name}</span>
              </span>
            </Dropdown>
          ) : (
            <Spin size="small" style={{ marginLeft: 8 }} />
          )}
        </div>
      </div>
    );
  }
}
