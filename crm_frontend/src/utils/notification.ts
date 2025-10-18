export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  timestamp: Date;
}

class NotificationService {
  private notifications: Notification[] = [];
  private listeners: ((notifications: Notification[]) => void)[] = [];

  addNotification(notification: Omit<Notification, 'id' | 'timestamp'>): string {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: new Date(),
      duration: notification.duration || 5000
    };

    this.notifications.push(newNotification);
    this.notifyListeners();

    // Auto-remove notification after duration
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        this.removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  }

  removeNotification(id: string): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notifyListeners();
  }

  clearAll(): void {
    this.notifications = [];
    this.notifyListeners();
  }

  getNotifications(): Notification[] {
    return [...this.notifications];
  }

  subscribe(listener: (notifications: Notification[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener([...this.notifications]));
  }

  // Convenience methods
  success(title: string, message: string, duration?: number): string {
    return this.addNotification({ title, message, type: 'success', duration });
  }

  error(title: string, message: string, duration?: number): string {
    return this.addNotification({ title, message, type: 'error', duration: duration || 8000 });
  }

  warning(title: string, message: string, duration?: number): string {
    return this.addNotification({ title, message, type: 'warning', duration });
  }

  info(title: string, message: string, duration?: number): string {
    return this.addNotification({ title, message, type: 'info', duration });
  }
}

export const notificationService = new NotificationService();
