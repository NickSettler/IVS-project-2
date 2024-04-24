import { JSX, useLayoutEffect, useRef, useState } from 'react';

/**
 * Math SVG component. Renders math expression as SVG using {@link https://www.mathjax.org/}.
 * @param {{
 *   tex: string;
 *   isDisplay?: boolean;
 * }} props Math SVG props
 * @constructor
 */
export const MathSVG = ({
  tex,
  isDisplay = false,
}: {
  tex: string;
  isDisplay?: boolean;
}): JSX.Element => {
  const rootElementRef = useRef<HTMLSpanElement | null>(null);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line camelcase
  const [isReady, setIsReady] = useState(__MathJax_State__.isReady);

  useLayoutEffect(() => {
    if (!isReady) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line camelcase
      __MathJax_State__.promise.then(() => setIsReady(true));
      return;
    }

    // This element won't be null at this point.
    const mathElement = rootElementRef.current;

    if (!mathElement) return;

    mathElement.innerHTML = '';

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    MathJax.texReset();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const options = MathJax.getMetricsFor(mathElement);
    options.display = isDisplay;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    MathJax.tex2svgPromise(tex, options)
      .then(function (node: SVGElement) {
        mathElement.appendChild(node);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        MathJax.startup.document.clear();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        MathJax.startup.document.updateDocument();
      })
      .catch(function (err: any) {
        console.error(err);
      });
  }, [tex, isDisplay, isReady]);

  return <span ref={rootElementRef}></span>;
};
