import AddPage from "@/pages/add.js";
import IndexPage from "@/pages/index.js";
import { Navigate, Router as ARouter } from "@solidjs/router";

const routes = [
  {
    path: "/",
    component: IndexPage,
  },
  {
    path: "/add",
    component: AddPage,
  },
  {
    path: "/*",
    component: () => <Navigate href="/" />,
  },
];

export const Router = () => {
  return <ARouter>{routes}</ARouter>;
};
