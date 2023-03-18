import React from 'react';
import { Button, Modal } from 'antd';
import { GithubOutlined } from '@ant-design/icons';
import styles from './index.module.scss';

interface IProps {
  open: boolean;
  onClose: () => void;
}

function Index(props: IProps) {
  return (
    <>
      <Modal
        open={props.open}
        footer={null}
        onCancel={props.onClose}
        maskClosable={false}
      >
        <div className={styles['about-layout']}>
          <h3>关于</h3>
          <p className={styles['des']}>
            网易云音乐云盘上传助手，可以在网页端上传音乐文件到网易云的个人云盘
          </p>
          <h3>感谢</h3>
          <a
            href='https://github.com/Binaryify/NeteaseCloudMusicApi'
            target='_blank'
            rel='noopener noreferrer'
            style={{ color: '#cf1322' }}
          >
            NeteaseCloudMusicApi
          </a>
          <div className={styles['github-button']}>
            <Button type='text'>
              <GithubOutlined
                style={{ fontSize: 23, color: '#8c8c8c' }}
                onClick={() => {
                  window.open(
                    'https://github.com/ultrazg/cloudmusic-uploder-front-end.git'
                  );
                }}
              />
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default Index;
