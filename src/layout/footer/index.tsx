import React, { useState } from 'react';
import { Button } from 'antd';
import AboutModal from '../aboutModal';
import styles from './index.module.scss';

function Index() {
  const [open, setOpen] = useState<boolean>(false);

  const toggleModalOpen = () => {
    setOpen(!open);
  };

  return (
    <div className={styles['footer-layout']}>
      <Button
        type='text'
        size='small'
        style={{ fontSize: 12, fontWeight: 300 }}
        onClick={() => toggleModalOpen()}
      >
        关于
      </Button>
      <AboutModal open={open} onClose={toggleModalOpen} />
    </div>
  );
}

export default Index;
