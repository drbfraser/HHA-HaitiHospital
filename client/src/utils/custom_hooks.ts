import React, { useEffect, useRef } from 'react';

const useDidMountEffect = (callback: React.EffectCallback, deps: React.DependencyList) => {
  // Effect hook that ignores the first render
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) {
      callback();
    } else {
      didMount.current = true;
    }

    // This spread dependencies prevented linter from statically analyize dependencies
    // Have to disable the lint rule for this line
    // eslint-disable-next-line
  }, [...deps, callback]);
};

export default useDidMountEffect;
