import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { isDev } from "@/lib/dev/devEnv";

export const DevTools = () => {
  if (!isDev) {
    return null;
  }

  const enableReactQueryDevtools =
    process.env.NEXT_PUBLIC_DEV_ENABLE_REACT_QUERY_DEVTOOLS === "true";

  return (
    <>
      {enableReactQueryDevtools && <ReactQueryDevtools initialIsOpen={false} />}
    </>
  );
};
