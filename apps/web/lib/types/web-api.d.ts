/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="es2015" />
/// <reference lib="webworker" />
/// <reference lib="webworker.importscripts" />

/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="es2015" />
/// <reference lib="webworker" />
/// <reference lib="webworker.importscripts" />

type ServiceWorkerUpdateViaCache = 'imports' | 'all' | 'none';

interface ServiceWorkerEventMap {
  statechange: Event;
}

interface ServiceWorker extends EventTarget {
  readonly scriptURL: string;
  readonly state: ServiceWorkerState;
  postMessage(message: unknown, transfer: Transferable[]): void;
  postMessage(message: unknown, options?: PostMessageOptions): void;
}

type ServiceWorkerState = 'installing' | 'installed' | 'activating' | 'activated' | 'redundant';

interface ServiceWorkerRegistration {
  readonly active: ServiceWorker | null;
  readonly installing: ServiceWorker | null;
  readonly waiting: ServiceWorker | null;
  readonly scope: string;
  readonly updateViaCache: ServiceWorkerUpdateViaCache;
  unregister(): Promise<boolean>;
  update(): Promise<void>;
}

interface ShareData {
  title?: string;
  text?: string;
  url?: string;
  files?: File[];
}

interface NotificationOptions {
  body?: string;
  icon?: string;
  badge?: string;
  image?: string;
  data?: unknown;
  requireInteraction?: boolean;
  silent?: boolean;
  actions?: NotificationAction[];
  vibrate?: number[];
}

interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

type NotificationPermission = 'default' | 'denied' | 'granted';
type NotificationDirection = 'auto' | 'ltr' | 'rtl';

interface NotificationEventMap {
  'click': Event;
  'close': Event;
  'error': Event;
  'show': Event;
}

interface Notification extends EventTarget {
  readonly actions: ReadonlyArray<NotificationAction>;
  readonly badge: string;
  readonly body: string;
  readonly data: unknown;
  readonly dir: NotificationDirection;
  readonly icon: string;
  readonly image: string;
  readonly lang: string;
  onclick: ((this: Notification, ev: Event) => void) | null;
  onclose: ((this: Notification, ev: Event) => void) | null;
  onerror: ((this: Notification, ev: Event) => void) | null;
  onshow: ((this: Notification, ev: Event) => void) | null;
  readonly requireInteraction: boolean;
  readonly silent: boolean;
  readonly tag: string;
  readonly title: string;
  readonly vibrate: ReadonlyArray<number>;
  close(): void;
  addEventListener<K extends keyof NotificationEventMap>(type: K, listener: (this: Notification, ev: NotificationEventMap[K]) => void, options?: boolean | AddEventListenerOptions): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
  removeEventListener<K extends keyof NotificationEventMap>(type: K, listener: (this: Notification, ev: NotificationEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

declare var Notification: {
  prototype: Notification;
  new(title: string, options?: NotificationOptions): Notification;
  readonly permission: NotificationPermission;
  requestPermission(): Promise<NotificationPermission>;
};

interface MediaQueryList {
  matches: boolean;
  media: string;
  onchange: ((this: MediaQueryList, ev: MediaQueryListEvent) => void) | null;
  addListener(listener: ((ev: MediaQueryListEvent) => void)): void;
  removeListener(listener: ((ev: MediaQueryListEvent) => void)): void;
  addEventListener(type: string, listener: EventListener): void;
  removeEventListener(type: string, listener: EventListener): void;
  dispatchEvent(event: Event): boolean;
}
