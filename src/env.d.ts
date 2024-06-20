/// <reference types="astro/client" />

interface Window {
  htmx: import("htmx.org").htmx;
  test: any;
  Alpine: import("alpinejs").Alpine;
}

declare const test: any;
declare const htmx: import("htmx.org").htmx;
declare const Alpine: import("alpinejs").Alpine;
