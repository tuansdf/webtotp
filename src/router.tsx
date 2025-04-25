import { Navigate, Router as ARouter } from "@solidjs/router";
import { lazy } from "solid-js";

const routes = [
  {
    path: "/",
    component: lazy(() => import("@/pages/index.tsx")),
  },
  {
    path: "/add",
    component: lazy(() => import("@/pages/add.tsx")),
  },
  {
    path: "/*",
    component: () => <Navigate href="/" />,
  },
];

export const Router = () => {
  return <ARouter>{routes}</ARouter>;
};
