let release = () => {};
let finished = false;

export const loaderDone = new Promise<void>((resolve) => {
  release = resolve;
});

export function finishLoader(): void {
  finished = true;
  release();
}

/** The loader plays once per page load; client-side returns to home skip it. */
export const loaderPending = (): boolean => !finished;
