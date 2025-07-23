import { monitoringService } from './monitoring';

export interface NotificationOptions {
  type: 'error' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  duration?: number;
  actions?: Array<{
    label: string;
    onClick: () => void;
  }>;
  autoClose?: boolean;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

interface NotificationState {
  notifications: Map<string, NotificationOptions>;
  listeners: Set<(notifications: Map<string, NotificationOptions>) => void>;
}

class NotificationService {
  private static instance: NotificationService;
  private state: NotificationState = {
    notifications: new Map(),
    listeners: new Set(),
  };

  private constructor() {
    if (typeof window !== 'undefined') {
      this.setupServiceWorker();
    }
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private async setupServiceWorker(): Promise<void> {
    try {
      if ('serviceWorker' in navigator && 'Notification' in window) {
        const registration = await navigator.serviceWorker.register('/notification-sw.js');
        
        // Benachrichtigungsberechtigungen anfordern
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          monitoringService.addBreadcrumb(
            'Benachrichtigungen aktiviert',
            'notifications'
          );
        }
      }
    } catch (error) {
      console.error('Fehler beim Setup des Service Workers:', error);
      monitoringService.captureError(error as Error, {
        componentName: 'NotificationService',
        severity: 'warning',
      });
    }
  }

  public subscribe(
    callback: (notifications: Map<string, NotificationOptions>) => void
  ): () => void {
    this.state.listeners.add(callback);
    return () => {
      this.state.listeners.delete(callback);
    };
  }

  private notifyListeners(): void {
    this.state.listeners.forEach((listener) => {
      listener(this.state.notifications);
    });
  }

  public async show(options: NotificationOptions): Promise<string> {
    const id = Math.random().toString(36).substring(7);
    const notification = {
      ...options,
      duration: options.duration || 5000,
      autoClose: options.autoClose ?? true,
      position: options.position || 'top-right',
    };

    // In-App Benachrichtigung
    this.state.notifications.set(id, notification);
    this.notifyListeners();

    // Browser-Benachrichtigung für kritische Fehler
    if (options.type === 'error' && Notification.permission === 'granted') {
      try {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(options.title, {
          body: options.message,
          icon: '/error-icon.png',
          tag: id,
          requireInteraction: true,
        });
      } catch (error) {
        console.error('Fehler beim Anzeigen der Browser-Benachrichtigung:', error);
      }
    }

    // Automatisches Schließen
    if (notification.autoClose) {
      setTimeout(() => {
        this.dismiss(id);
      }, notification.duration);
    }

    return id;
  }

  public async showError(
    error: Error,
    context?: { title?: string; actions?: NotificationOptions['actions'] }
  ): Promise<string> {
    const title = context?.title || 'Ein Fehler ist aufgetreten';
    
    return this.show({
      type: 'error',
      title,
      message: error.message,
      duration: 10000, // Längere Dauer für Fehler
      actions: context?.actions || [
        {
          label: 'Details anzeigen',
          onClick: () => {
            // Navigiere zum Error-Dashboard
            window.location.href = '/admin/error-metrics';
          },
        },
      ],
      autoClose: false,
    });
  }

  public dismiss(id: string): void {
    this.state.notifications.delete(id);
    this.notifyListeners();
  }

  public dismissAll(): void {
    this.state.notifications.clear();
    this.notifyListeners();
  }

  public async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      throw new Error('Browser unterstützt keine Benachrichtigungen');
    }

    const permission = await Notification.requestPermission();
    monitoringService.addBreadcrumb(
      `Benachrichtigungsberechtigung: ${permission}`,
      'notifications'
    );

    return permission;
  }

  public hasPermission(): boolean {
    return Notification.permission === 'granted';
  }
}

export const notificationService = NotificationService.getInstance();
