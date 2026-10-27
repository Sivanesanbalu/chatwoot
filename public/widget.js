(function () {
  if (window.$chatwootWidgetLoaded) return;
  window.$chatwootWidgetLoaded = true;

  var currentScript = document.currentScript;
  var scriptUrl = new URL(currentScript.src);
  var appHost = scriptUrl.origin;

  // Create iframe for live widget
  var container = document.createElement("div");
  container.id = "chatwoot-lite-widget-root";
  container.style.position = "fixed";
  container.style.bottom = "20px";
  container.style.right = "20px";
  container.style.zIndex = "999999";
  container.style.width = "400px";
  container.style.height = "640px";
  container.style.pointerEvents = "none";

  var iframe = document.createElement("iframe");
  iframe.src = appHost + "/?view=widget_only";
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.border = "none";
  iframe.style.pointerEvents = "auto";
  iframe.setAttribute("allow", "microphone; camera");

  container.appendChild(iframe);
  document.body.appendChild(container);
})();
