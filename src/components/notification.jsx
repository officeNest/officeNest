import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchedNotifications = [
      { id: 1, message: 'New booking request from John Doe.' },
      { id: 2, message: 'Booking approved for Office 101.' },
      { id: 3, message: 'Booking request declined by owner.' }
    ];

    setNotifications(fetchedNotifications);
  }, []);

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-semibold text-blue-700 mb-4 flex items-center">
        <Bell className="w-6 h-6 mr-2" /> Notifications
      </h2>
      <ul className="bg-white rounded-lg shadow-md border border-blue-100 p-4 space-y-2">
        {notifications.map((notification) => (
          <li key={notification.id} className="text-gray-700 border-b last:border-b-0 pb-2">
            {notification.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;