export const getBodyScrollbarWidth = (): number => {
  return document.body.scrollHeight + 90 > window.innerHeight
    ? window.innerWidth - document.documentElement.clientWidth
    : 0;
};

export const updateScrollbarGutter = (): void => {
  const scrollbarWidth = getBodyScrollbarWidth();
  document.documentElement.style.setProperty('--scrollbar-gutter', `${scrollbarWidth}px`);
};