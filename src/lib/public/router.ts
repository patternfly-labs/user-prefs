// @ts-nocheck
import { History, createBrowserHistory, createMemoryHistory } from 'history';

type AppHistory = History & { pushPath: History['push'] };

let createHistory;

try {
  if (process.env.NODE_ENV === 'test') {
    // Running in node. Can't use browser history
    createHistory = createMemoryHistory;
  } else {
    createHistory = createBrowserHistory;
  }
} catch (unused) {
  createHistory = createBrowserHistory;
}

export const history: AppHistory = createHistory();

// Monkey patch history to slice off the base path
(history as any).__replace__ = history.replace;
history.replace = (history as any).__replace__;

(history as any).__push__ = history.push;
history.push = (history as any).__push__;
(history as any).pushPath = (path) => (history as any).__push__(path);

export const removeQueryArgument = (k: string) => {
  const params = new URLSearchParams(window.location.search);
  if (params.has(k)) {
    params.delete(k);
    const url = new URL(window.location.href);
    // @ts-ignore
    history.replace(`${url.pathname}?${params.toString()}${url.hash}`);
  }
};

export const setQueryArgument = (k: string, v: string) => {
  if (!v) {
    return removeQueryArgument(k);
  }
  const params = new URLSearchParams(window.location.search);
  if (params.get(k) !== v) {
    params.set(k, v);
    const url = new URL(window.location.href);
    // @ts-ignore
    history.replace(`${url.pathname}?${params.toString()}${url.hash}`);
  }
};
