declare global {
  namespace JSX {
    interface IntrinsicElements {
      "circle-progress": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        max?: number | string;
        value?: number | string;
        "text-format"?: string;
      };
    }
  }
}

export {};