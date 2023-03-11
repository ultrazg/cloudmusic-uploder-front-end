import React from 'react';
import { ConfigProvider } from 'antd';
import Index from './pages/index';
import styles from './app.module.scss';

function App() {
  return (
    <div className={styles['app-layout']}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#cf1322'
          }
        }}
      >
        <Index />
      </ConfigProvider>
    </div>
  );
}

export default App;
