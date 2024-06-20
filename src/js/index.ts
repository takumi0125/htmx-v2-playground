import "reset.css";
import htmx from "htmx.org/dist/htmx.esm.js";

window.htmx = htmx;
window.test = window.test || {};

const domParser: DOMParser = new DOMParser();

let button0: HTMLButtonElement | null;
let button3: HTMLButtonElement | null;

// htmx.logAll();

window.test.removeButton0 = () => {
  if (button0?.parentElement) htmx.remove(button0);
};
window.test.removeButton3 = () => {
  button3?.remove();
};

const initButton0 = () => {
  button0 = document.querySelector(".button0");
  console.log(button0);

  if (button0) {
    htmx.on(".button0", "click", function (event) {
      alert("clicked button0 by htmx.on");
    });
    window.test.button0 = button0;
  }
};

const initButton1 = () => {
  const button1 = document.querySelector(".button1");
  if (!button1) return;
  button1.setAttribute(
    "hx-on:click",
    'alert("動的に属性値が変更されました。")'
  );
  button1.setAttribute("hx-target", "#slot");
  button1.setAttribute("hx-select", "#pageContents");
  button1.setAttribute("hx-get", "/page2");
  button1.setAttribute("hx-swap", "innerHTML swap:0.2s");
  button1.setAttribute("hx-push-url", "true");
  htmx.process(button1);
};

const initButton2 = () => {
  const page1 = document.querySelector(".page1");
  if (!page1) return;

  const button = document.createElement("button");
  button.textContent = "Inserted Button";
  button.setAttribute("hx-on:click", "alert('clicked dynamic button')");
  button.setAttribute("hx-target", "#slot");
  button.setAttribute("hx-select", "#pageContents");
  button.setAttribute("hx-push-url", "true");
  button.setAttribute("hx-trigger", "click");
  button.setAttribute("hx-get", "/");
  button.setAttribute("hx-swap", "innerHTML swap:0.2s");
  page1.appendChild(button);
  htmx.process(button);
};

const initButton3 = () => {
  button3 = document.querySelector(".button3");
  console.log(button3);

  window.test.button3 = button3;

  const page3 = document.querySelector(".page3");
  if (!page3) return;

  const button3_2 = document.createElement("button");
  button3_2.textContent = "Inserted Button";
  page3.appendChild(button3_2);

  setTimeout(() => {
    button3_2.setAttribute("x-data", "{count: 0}");
    button3_2.setAttribute("x-on:click", "count++");
    button3_2.setAttribute("x-text", "count");
  }, 1000);
};

const init = () => {
  initButton0();
  initButton1();
  initButton2();
  initButton3();
};

window.addEventListener("DOMContentLoaded", () => {
  init();
});

const head = document.head;
let newDoc: Document | null = null;
let currentStyles: HTMLStyleElement[] = [
  ...head.querySelectorAll<HTMLStyleElement>("style[data-vite-dev-id]"),
];

const swapStyles = () => {
  if (!newDoc) return;

  const newStyles = [
    ...newDoc.head.querySelectorAll("style[data-vite-dev-id]"),
  ];

  currentStyles.forEach((style) => {
    const id = style.getAttribute("data-vite-dev-id");
    if (newStyles.find((s) => s.getAttribute("data-vite-dev-id") === id)) {
      // idが同じなら配列から削除
      newStyles.splice(
        newStyles.findIndex((s) => s.getAttribute("data-vite-dev-id") === id),
        1
      );
    } else {
      style.remove();
    }
  });
  console.log(newStyles);

  newStyles.forEach((style) => {
    head.appendChild(style);
  });
};

htmx.on("#slot", "htmx:beforeSwap", function (event) {
  console.log(event);
  const e = event as CustomEvent<{ xhr: { response: string } }>;
  const doc = domParser.parseFromString(e.detail.xhr.response, "text/html");
  newDoc = doc;
  currentStyles = [
    ...head.querySelectorAll<HTMLStyleElement>("style[data-vite-dev-id]"),
  ];
});

htmx.on("#slot", "htmx:afterSettle", function (event) {
  console.log(event);
  swapStyles();
  init();
});
