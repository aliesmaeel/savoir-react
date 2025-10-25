import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import Toast from "./Toast";

type Notice = {
  id: string;
  type: "error" | "success";
  message: string;
  timeout?: number;
};

type Ctx = {
  push: (n: Omit<Notice, "id">) => string;
  success: (message: string, timeout?: number) => string;
  error: (message: string, timeout?: number) => string;
  remove: (id: string) => void;
};

const NotificationsCtx = createContext<Ctx | null>(null);

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Notice[]>([]);
  const timers = useRef<Record<string, any>>({});

  const remove = useCallback((id: string) => {
    clearTimeout(timers.current[id]);
    delete timers.current[id];
    setItems((arr) => arr.filter((n) => n.id !== id));
  }, []);

  const push = useCallback(
    (n: Omit<Notice, "id">) => {
      const id = crypto.randomUUID();
      const notice: Notice = { id, timeout: 3500, ...n };
      setItems((arr) => [notice, ...arr]);
      if (notice.timeout && notice.timeout > 0) {
        timers.current[id] = setTimeout(() => remove(id), notice.timeout);
      }
      return id;
    },
    [remove]
  );

  const success = useCallback(
    (message: string, timeout?: number) => push({ type: "success", message, timeout }),
    [push]
  );
  const error = useCallback(
    (message: string, timeout?: number) => push({ type: "error", message, timeout }),
    [push]
  );

  const value = useMemo(() => ({ push, success, error, remove }), [push, success, error, remove]);

  return (
    <NotificationsCtx.Provider value={value}>
      {children}
      {/* Container: top-right stack */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3">
        {items.map((n) => (
          <Toast key={n.id} id={n.id} type={n.type} message={n.message} onClose={remove} />
        ))}
      </div>
    </NotificationsCtx.Provider>
  );
}

export function useNotify() {
  const ctx = useContext(NotificationsCtx);
  if (!ctx) throw new Error("useNotify must be used within <NotificationsProvider>");
  return ctx;
}
