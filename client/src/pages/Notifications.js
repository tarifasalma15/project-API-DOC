import React, { useEffect, useState } from 'react';
import { List, message } from 'antd';
import axios from 'axios';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const getUserNotifications = async () => {
    try {
      const res = await axios.get('/api/v1/notifications/userNotifications', {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      });
      if (res.data.success) {
        setNotifications(res.data.data);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log('Error fetching notifications', error);
      message.error('Error fetching notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserNotifications();
  }, []);

  return (
    <List
      loading={loading}
      itemLayout="horizontal"
      dataSource={notifications}
      renderItem={notification => (
        <List.Item>
          <List.Item.Meta
            title={notification.message}
            description={new Date(notification.createdAt).toLocaleString()}
          />
        </List.Item>
      )}
    />
  );
};

export default Notifications;
