// This hook provides a ref which is perpetually up to date but will not
// trigger any renders. This is useful for resolving circular references in
// dependency arrays.
//See https://brandoncc.dev/blog/how-to-deal-with-circular-dependencies-in-react-hooks/

import React from "react";
export default function useNoRenderRef<T>(currentValue: T) {
  const ref = React.useRef(currentValue);
  ref.current = currentValue;
  return ref;
}