"use client";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import Pusher, { Channel, Options } from "pusher-js";

// Define types for Pusher context
type PusherChannelEvents = {
  [eventName: string]: (data: any) => void;
};

type PusherContextType = {
  pusherClient: Pusher | null;
  subscribeToChannel: (
    channelName: string,
    events?: PusherChannelEvents
  ) => Channel | null;
  unsubscribeFromChannel: (channelName: string) => void;
  channels: { [channelName: string]: Channel };
};

type PusherProviderProps = {
  children: React.ReactNode;

  appKey: string | undefined;
  cluster: string | undefined;
  options?: Omit<Options, "cluster">;
};

const PusherContext = createContext<PusherContextType | null>(null);

export const PusherProvider: React.FC<PusherProviderProps> = ({
  children,
  appKey,
  cluster,
  options = {},
}) => {
  const [pusherClient, setPusherClient] = useState<Pusher | null>(null);

  useEffect(() => {
    if (!appKey || !cluster) return;

    const pusher = new Pusher(appKey, {
      cluster: cluster,
      ...options,
    });

    setPusherClient(pusher);

    return () => {
      pusher.disconnect();
    };
  }, [appKey, cluster, options]); // Only necessary dependencies

  const subscribeToChannel = useCallback(
    (channelName: string, events: PusherChannelEvents = {}) => {
      if (!pusherClient) return null;

      const channel = pusherClient.subscribe(channelName);

      Object.entries(events).forEach(([eventName, callback]) => {
        channel.bind(eventName, callback);
      });

      return channel;
    },
    [pusherClient]
  );

  const unsubscribeFromChannel = useCallback(
    (channelName: string) => {
      if (pusherClient) {
        pusherClient.unsubscribe(channelName);
      }
    },
    [pusherClient]
  );

  const contextValue: PusherContextType = {
    pusherClient,
    subscribeToChannel,
    unsubscribeFromChannel,
    channels: {}, // Not tracking channels in state anymore
  };

  return (
    <PusherContext.Provider value={contextValue}>
      {children}
    </PusherContext.Provider>
  );
};

export const usePusher = () => {
  const context = useContext(PusherContext);
  if (!context) {
    throw new Error("usePusher must be used within a PusherProvider");
  }
  return context;
};
