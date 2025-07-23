'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { notificationService, NotificationOptions } from '../../lib/services/notifications';

interface NotificationProps {
  id: string;
  notification: NotificationOptions;
  onDismiss: (id: string) => void;
}

const Notification: React.FC<NotificationProps> = ({
  id,
  notification,
  onDismiss,
}) => {
  const {
    type,
    title,
    message,
    actions,
    position = 'top-right',
  } = notification;

  // Stil-Mapping für verschiedene Benachrichtigungstypen
  const typeStyles = {
    error: 'bg-red-500 border-red-700',
    warning: 'bg-yellow-500 border-yellow-700',
    info: 'bg-blue-500 border-blue-700',
    success: 'bg-green-500 border-green-700',
  };

  // Position-Mapping für Animation und Platzierung
  const positionStyles = {
    'top-right': 'animate-slide-in-right',
    'top-left': 'animate-slide-in-left',
    'bottom-right': 'animate-slide-in-right',
    'bottom-left': 'animate-slide-in-left',
  };

  return (
    <div
      role="alert"
      className={`
        ${typeStyles[type]}
        ${positionStyles[position]}
        rounded-lg border p-4 shadow-lg
        transition-all duration-300 ease-in-out
      `}
      data-testid="notification"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="mt-1 text-white/90">{message}</p>
          
          {actions && actions.length > 0 && (
            <div className="mt-3 flex gap-2">
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => {
                    action.onClick();
                    onDismiss(id);
                  }}
                  className="rounded bg-white/10 px-3 py-1 text-sm text-white transition-colors hover:bg-white/20"
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <button
          onClick={() => onDismiss(id)}
          className="ml-4 text-white/80 hover:text-white"
          aria-label="Benachrichtigung schließen"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export const NotificationContainer: React.FC = () => {
  const [notifications, setNotifications] = useState<
    Map<string, NotificationOptions>
  >(new Map());
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Portal-Container erstellen
    const container = document.createElement('div');
    container.id = 'notification-portal';
    document.body.appendChild(container);
    setPortalContainer(container);

    return () => {
      document.body.removeChild(container);
    };
  }, []);

  useEffect(() => {
    // Service abonnieren
    const unsubscribe = notificationService.subscribe((updatedNotifications) => {
      setNotifications(new Map(updatedNotifications));
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (!portalContainer) return null;

  // Gruppiere Benachrichtigungen nach Position
  const notificationsByPosition = Array.from(notifications.entries()).reduce(
    (acc, [id, notification]) => {
      const position = notification.position || 'top-right';
      if (!acc[position]) acc[position] = [];
      acc[position].push({ id, notification });
      return acc;
    },
    {} as Record<string, Array<{ id: string; notification: NotificationOptions }>>
  );

  // Rendere Benachrichtigungen für jede Position
  return createPortal(
    <>
      {Object.entries(notificationsByPosition).map(([position, items]) => (
        <div
          key={position}
          className={`fixed z-50 m-4 flex flex-col gap-2 ${
            position.includes('top')
              ? 'top-0'
              : 'bottom-0'
          } ${
            position.includes('right')
              ? 'right-0'
              : 'left-0'
          }`}
        >
          {items.map(({ id, notification }) => (
            <Notification
              key={id}
              id={id}
              notification={notification}
              onDismiss={(notificationId) =>
                notificationService.dismiss(notificationId)
              }
            />
          ))}
        </div>
      ))}
    </>,
    portalContainer
  );
};
