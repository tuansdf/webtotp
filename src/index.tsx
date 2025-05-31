/* @refresh reload */
import "@/globals.scss";
import App from "@/app.tsx";
import { render } from "solid-js/web";

const root = document.getElementById("root");

render(() => <App />, root!);
