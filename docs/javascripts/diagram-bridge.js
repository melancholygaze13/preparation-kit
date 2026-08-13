addEventListener("message", ({data, origin}) => {
  if (origin === location.origin && data?.type === "preparation-kit:diagram-theme") {
    document.documentElement.dataset.colorScheme = data.scheme;
  }
});
