import React, {useState} from 'react';
import styles from './index.module.scss';
import Footer from '../../layout/footer';
import {BASE_URL} from '../../config';
import {
  Divider,
  message,
  Upload,
  Tooltip,
  Button,
  Avatar,
  Dropdown
} from 'antd';
import {CloudUploadOutlined, InfoCircleOutlined} from '@ant-design/icons';
import axios from 'axios';
import type {UploadProps, MenuProps} from 'antd';

const {Dragger} = Upload;
axios.defaults.withCredentials = true;

const props: UploadProps = {
  name: 'songFile',
  multiple: true,
  withCredentials: true,
  action: `${BASE_URL}cloud?time=${Date.now()}`,
  onChange(info) {
    const {status} = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} 上传成功`);
    } else if (status === 'error') {
      message.error(`${info.file.name} 上传失败`);
    }
  },
  onDrop(e) {
    // console.log('Dropped files', e.dataTransfer.files);
  }
};

function Index() {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [QRCode, setQRCode] = useState<string>('');
  const [avatar, setAvatar] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const items: MenuProps['items'] = [
    {
      key: '1',
      danger: true,
      label: <span onClick={() => logout()}>登出</span>
    }
  ];

  const logout = () => {
    localStorage.removeItem('cookie');
    setIsLogin(false);
    setQRCode('');
    window.location.reload();
  };

  /**
   * 获取已登录账号的信息
   * @param cookie cookie
   */
  const getLoginStatus = async (cookie: string | null) => {
    const res = await axios({
      url: `${BASE_URL}login/status?timestamp=${Date.now()}`,
      method: 'post',
      data: {
        cookie
      }
    });

    return res.data.data.profile;
  };

  /**
   * 登录
   */
  const login = async () => {
    setLoading(true);
    let timer: string | number | NodeJS.Timer | undefined;
    const timestamp = Date.now();
    const res = await axios(`${BASE_URL}login/qr/key?timestamp=${timestamp}`);
    const key = res.data.data.unikey;
    const res2 = await axios(
      `${BASE_URL}login/qr/create?key=${key}&qrimg=true&timestamp=${timestamp}`
    );

    if (res2.data.code === 200) {
      setQRCode(res2.data.data.qrimg);
      setLoading(false)
    }

    timer = setInterval(async () => {
      const statusRes = await pollingCheckQRLogin(key);
      console.log(statusRes);
      if (statusRes.code === 800) {
        message.info('二维码已过期，请重新获取');

        clearInterval(timer);
      }
      if (statusRes.code === 803) {
        clearInterval(timer);
        localStorage.setItem('cookie', statusRes.cookie);
        const profile = await getLoginStatus(statusRes.cookie);
        message.success(`欢迎，${profile.nickname}`);
        setAvatar(profile.avatarUrl);
        setIsLogin(true);
      }
    }, 2000);
  };

  /**
   * 轮询检测二维码登录是否成功
   */
  const pollingCheckQRLogin = async (key: string) => {
    const res = await axios(
      `${BASE_URL}login/qr/check?key=${key}&timestamp=${Date.now()}`
    );

    return res.data;
  };

  return (
    <div>
      <div className={styles['title-layout']}>
        <h3 className={styles['title']}>
          「网易云音乐」云盘上传助手
          {isLogin ? (
            <Dropdown menu={{items}} placement='bottomRight'>
              <span
                style={{float: 'right'}}
                onClick={(e) => e.preventDefault()}
              >
                <Avatar size='large' icon={<img src={avatar} alt='avatar'/>}/>
              </span>
            </Dropdown>
          ) : null}
        </h3>
      </div>
      <Divider/>
      {isLogin ? (
        <div>
          <Dragger {...props} style={{height: '100px'}}>
            <p className='ant-upload-drag-icon'>
              <CloudUploadOutlined/>
            </p>
            <p className='ant-upload-text'>点击或将文件拖拽到此处</p>
            <p className='ant-upload-hint'>支持单个或批量文件上传</p>
          </Dragger>
        </div>
      ) : (
        <div>
          <div className={styles['login-title']}>
            使用网易云音乐 APP 扫码登录
            <Tooltip title='仅用于获取账号云盘信息，本站并不会记录用户数据'>
              <InfoCircleOutlined
                style={{marginLeft: 5, color: '#bfbfbf', cursor: 'pointer'}}
              />
            </Tooltip>
          </div>
          <div className={styles['QR-code']}>
            <Button
              className={styles['getCodeBtn']}
              onClick={() => {
                login();
              }}
              loading={loading}
            >
              {QRCode ? '刷新二维码' : '获取二维码'}
            </Button>
            <img
              src={QRCode}
              alt='qr-code-img'
              style={QRCode ? {} : {display: 'none'}}
            />
          </div>
        </div>
      )}
      <Footer/>
    </div>
  );
}

export default Index;
