import { Reaction } from 'mobx';
import React from 'react';
import { isObserverBatched } from './observerBatching';
import { printDebugValue } from './printDebugValue';
import {
  createTrackingData,
  IReactionTracking,
  recordReactionAsCommitted,
  scheduleCleanupOfReactionIfLeaked,
} from './reactionCleanupTracking';
import { isUsingStaticRendering } from './staticRendering';
import { useForceUpdate } from './utils';

export type ForceUpdateHook = () => () => void;

export interface IUseObserverOptions {
  useForceUpdate?: ForceUpdateHook;
}

const EMPTY_OBJECT = {};

function observerComponentNameFor(baseComponentName: string) {
  return `observer${baseComponentName}`;
}

let warnedAboutBatching = false;

export function useObserver<T>(
  fn: () => T,
  baseComponentName: string = 'observed',
  options: IUseObserverOptions = EMPTY_OBJECT,
): T {
  // If MobX is in static rendering mode, return the function result directly
  if (isUsingStaticRendering()) {
    return fn();
  }

  // Warn about observer batching if not configured
  if (
    process.env.NODE_ENV !== 'production' &&
    !warnedAboutBatching &&
    !isObserverBatched()
  ) {
    console.warn(
      `[MobX] You haven't configured observer batching which might result in unexpected behavior in some cases. See more at https://github.com/mobxjs/mobx-react-lite/#observer-batching`,
    );
    warnedAboutBatching = true;
  }

  const wantedForceUpdateHook = options.useForceUpdate || useForceUpdate;
  const forceUpdate = wantedForceUpdateHook();

  // Track Reaction across renders and clean up leaks
  const reactionTrackingRef = React.useRef<IReactionTracking | null>(null);

  if (!reactionTrackingRef.current) {
    // First render for this component (or after cleanup of a leaked Reaction)
    const newReaction = new Reaction(observerComponentNameFor(baseComponentName), () => {
      const trackingData = reactionTrackingRef.current!;
      if (trackingData.mounted) {
        // If the component is mounted, trigger a re-render
        forceUpdate();
      } else {
        // If not mounted, dispose the reaction and reset
        newReaction.dispose();
        reactionTrackingRef.current = null;
      }
    });

    const trackingData = createTrackingData(newReaction);
    reactionTrackingRef.current = trackingData;
    scheduleCleanupOfReactionIfLeaked(reactionTrackingRef);
  }

  const { reaction } = reactionTrackingRef.current!;
  React.useDebugValue(reaction, printDebugValue);

  React.useEffect(() => {
    // On first mount, record the reaction as committed
    recordReactionAsCommitted(reactionTrackingRef);

    if (reactionTrackingRef.current) {
      // Mark as mounted after useEffect has been called
      reactionTrackingRef.current.mounted = true;
    } else {
      // If reaction has been disposed before useEffect (in case of timing issues), re-create it
      reactionTrackingRef.current = {
        reaction: new Reaction(observerComponentNameFor(baseComponentName), forceUpdate),
        cleanAt: Infinity,
      };
      forceUpdate();
    }

    return () => {
      // Cleanup the reaction when the component is unmounted
      reactionTrackingRef.current!.reaction.dispose();
      reactionTrackingRef.current = null;
    };
  }, []); // Empty dependency array ensures this effect runs only on mount and unmount

  // Tracking observables for rendering
  let rendering!: T;
  let exception;

  reaction.track(() => {
    try {
      rendering = fn();
    } catch (e) {
      exception = e;
    }
  });

  // Re-throw any exceptions caught during rendering
  if (exception) {
    throw exception;
  }

  return rendering;
}
