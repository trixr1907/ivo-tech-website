declare namespace JSX {
  interface CommonAttributes extends React.AriaAttributes, React.DOMAttributes<HTMLElement> {
    children?: React.ReactNode;
    className?: string;
    id?: string;
    style?: React.CSSProperties;
    role?: string;
    tabIndex?: number;
    'data-testid'?: string;
    dangerouslySetInnerHTML?: { __html: string };
  }

  interface EventHandlers {
    onClick?: React.MouseEventHandler;
    onMouseEnter?: React.MouseEventHandler;
    onMouseLeave?: React.MouseEventHandler;
    onKeyDown?: React.KeyboardEventHandler;
    onKeyUp?: React.KeyboardEventHandler;
    onFocus?: React.FocusEventHandler;
    onBlur?: React.FocusEventHandler;
    onChange?: React.ChangeEventHandler;
    onSubmit?: React.FormEventHandler;
  }

  interface FormElementAttributes extends CommonAttributes, EventHandlers {
    name?: string;
    value?: string | number | readonly string[];
    defaultValue?: string | number | readonly string[];
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    autoComplete?: string;
    autoFocus?: boolean;
  }

  interface IntrinsicElements {
    // Basic HTML elements
    div: CommonAttributes & EventHandlers & {
      dangerouslySetInnerHTML?: { __html: string };
    };
    span: CommonAttributes & EventHandlers;
    p: CommonAttributes & EventHandlers;
    a: CommonAttributes & EventHandlers & {
      href?: string;
      target?: '_blank' | '_self' | '_parent' | '_top';
      rel?: string;
    };
    button: CommonAttributes & EventHandlers & {
      type?: 'button' | 'submit' | 'reset';
      disabled?: boolean;
    };
    input: FormElementAttributes & {
      type?: 'text' | 'password' | 'email' | 'number' | 'checkbox' | 'radio' | 'file' | 'hidden' | 'search' | 'tel' | 'url';
      checked?: boolean;
      accept?: string;
      min?: number | string;
      max?: number | string;
      pattern?: string;
    };
    select: FormElementAttributes & {
      multiple?: boolean;
    };
    option: CommonAttributes & {
      value?: string | number;
      selected?: boolean;
    };
    label: CommonAttributes & EventHandlers & {
      htmlFor?: string;
    };
    form: CommonAttributes & {
      onSubmit?: React.FormEventHandler;
      method?: 'get' | 'post';
      action?: string;
      encType?: string;
    };
    img: CommonAttributes & {
      src: string;
      alt?: string;
      width?: number | string;
      height?: number | string;
      loading?: 'lazy' | 'eager';
    };
    video: CommonAttributes & {
      src?: string;
      autoPlay?: boolean;
      controls?: boolean;
      loop?: boolean;
      muted?: boolean;
      playsInline?: boolean;
      poster?: string;
    };
    audio: CommonAttributes & {
      src?: string;
      autoPlay?: boolean;
      controls?: boolean;
      loop?: boolean;
      muted?: boolean;
    };
    iframe: CommonAttributes & {
      src?: string;
      width?: number | string;
      height?: number | string;
      allow?: string;
      sandbox?: string;
      loading?: 'lazy' | 'eager';
    };
    canvas: CommonAttributes & {
      width?: number;
      height?: number;
    };

    // Text elements
    h1: CommonAttributes & EventHandlers;
    h2: CommonAttributes & EventHandlers;
    h3: CommonAttributes & EventHandlers;
    h4: CommonAttributes & EventHandlers;
    h5: CommonAttributes & EventHandlers;
    h6: CommonAttributes & EventHandlers;
    strong: CommonAttributes & EventHandlers;
    em: CommonAttributes & EventHandlers;
    blockquote: CommonAttributes & EventHandlers;
    pre: CommonAttributes & EventHandlers;
    code: CommonAttributes & EventHandlers;
    br: CommonAttributes;
    hr: CommonAttributes;

    // Lists
    ul: CommonAttributes & EventHandlers;
    ol: CommonAttributes & EventHandlers & {
      start?: number;
      type?: '1' | 'a' | 'A' | 'i' | 'I';
    };
    li: CommonAttributes & EventHandlers;
    dl: CommonAttributes & EventHandlers;
    dt: CommonAttributes & EventHandlers;
    dd: CommonAttributes & EventHandlers;

    // Table elements
    table: CommonAttributes & EventHandlers;
    thead: CommonAttributes & EventHandlers;
    tbody: CommonAttributes & EventHandlers;
    tfoot: CommonAttributes & EventHandlers;
    tr: CommonAttributes & EventHandlers;
    th: CommonAttributes & EventHandlers & {
      scope?: 'row' | 'col' | 'rowgroup' | 'colgroup';
      colSpan?: number;
      rowSpan?: number;
    };
    td: CommonAttributes & EventHandlers & {
      colSpan?: number;
      rowSpan?: number;
    };

    // Form elements
    fieldset: CommonAttributes & EventHandlers & {
      disabled?: boolean;
    };
    legend: CommonAttributes & EventHandlers;
    textarea: FormElementAttributes & {
      rows?: number;
      cols?: number;
      wrap?: 'soft' | 'hard';
    };

    // Section elements
    header: CommonAttributes & EventHandlers;
    nav: CommonAttributes & EventHandlers;
    main: CommonAttributes & EventHandlers;
    article: CommonAttributes & EventHandlers;
    section: CommonAttributes & EventHandlers;
    aside: CommonAttributes & EventHandlers;
    footer: CommonAttributes & EventHandlers;

    // Other HTML5 elements
    figure: CommonAttributes & EventHandlers;
    figcaption: CommonAttributes & EventHandlers;
    picture: CommonAttributes;
    source: CommonAttributes & {
      src?: string;
      type?: string;
      srcSet?: string;
      sizes?: string;
      media?: string;
    };
    track: CommonAttributes & {
      kind?: 'subtitles' | 'captions' | 'descriptions' | 'chapters' | 'metadata';
      src?: string;
      srcLang?: string;
      label?: string;
      default?: boolean;
    };
    time: CommonAttributes & EventHandlers & {
      dateTime?: string;
    };
    mark: CommonAttributes & EventHandlers;
    details: CommonAttributes & EventHandlers & {
      open?: boolean;
    };
    summary: CommonAttributes & EventHandlers;
    dialog: CommonAttributes & EventHandlers & {
      open?: boolean;
    };
    template: CommonAttributes;

    // SVG elements
    svg: CommonAttributes & {
      viewBox?: string;
      xmlns?: string;
      width?: number | string;
      height?: number | string;
      fill?: string;
      stroke?: string;
      strokeWidth?: number | string;
      strokeLinecap?: 'butt' | 'round' | 'square';
      strokeLinejoin?: 'miter' | 'round' | 'bevel';
      preserveAspectRatio?: string;
      transform?: string;
      style?: React.CSSProperties;
    };
    path: CommonAttributes & {
      d?: string;
      fill?: string;
      stroke?: string;
      strokeWidth?: number | string;
      strokeLinecap?: 'butt' | 'round' | 'square';
      strokeLinejoin?: 'miter' | 'round' | 'bevel';
      fillRule?: 'nonzero' | 'evenodd';
      clipRule?: string;
    };
    circle: CommonAttributes & {
      cx?: number | string;
      cy?: number | string;
      r?: number | string;
      fill?: string;
      stroke?: string;
      strokeWidth?: number | string;
      strokeLinecap?: 'butt' | 'round' | 'square';
      strokeLinejoin?: 'miter' | 'round' | 'bevel';
    };
    rect: CommonAttributes & {
      x?: number | string;
      y?: number | string;
      width?: number | string;
      height?: number | string;
      fill?: string;
      stroke?: string;
    };
    line: CommonAttributes & {
      x1?: number | string;
      y1?: number | string;
      x2?: number | string;
      y2?: number | string;
      stroke?: string;
    };
    polygon: CommonAttributes & {
      points?: string;
      fill?: string;
      stroke?: string;
    };
    polyline: CommonAttributes & {
      points?: string;
      fill?: string;
      stroke?: string;
    };
  }
}

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    children?: React.ReactNode;
    dangerouslySetInnerHTML?: { __html: string };
    className?: string;
    id?: string;
    title?: string;
    role?: string;
    tabIndex?: number;
    style?: React.CSSProperties;
    ref?: React.Ref<T>;
    key?: React.Key;
  }
  interface SVGAttributes<T> extends HTMLAttributes<T> {
    viewBox?: string;
    xmlns?: string;
    width?: number | string;
    height?: number | string;
    fill?: string;
    stroke?: string;
    strokeWidth?: number | string;
    strokeLinecap?: 'butt' | 'round' | 'square';
    strokeLinejoin?: 'miter' | 'round' | 'bevel';
    preserveAspectRatio?: string;
    transform?: string;
  }
  interface ComponentType<P = {}> {
    (props: P & { children?: React.ReactNode }, context?: any): React.ReactElement | null;
    propTypes?: WeakValidationMap<P>;
    contextTypes?: ValidationMap<any>;
    defaultProps?: Partial<P>;
    displayName?: string;
  }
  interface FC<P = {}> {
    (props: P & { children?: React.ReactNode }, context?: any): React.ReactElement | null;
    propTypes?: WeakValidationMap<P>;
    contextTypes?: ValidationMap<any>;
    defaultProps?: Partial<P>;
    displayName?: string;
  }
  interface Component<P = {}, S = {}, SS = any> {
    constructor(props: Readonly<P>);
    setState<K extends keyof S>(
      state: ((prevState: Readonly<S>, props: Readonly<P>) => (Pick<S, K> | S | null)) | (Pick<S, K> | S | null),
      callback?: () => void
    ): void;
    forceUpdate(callback?: () => void): void;
    render(): React.ReactNode;
    readonly props: Readonly<P>;
    state: Readonly<S>;
    context: any;
    refs: {
      [key: string]: React.ReactInstance
    };
  }
}
