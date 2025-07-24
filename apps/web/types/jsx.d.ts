declare namespace JSX {
  interface Element {
    type: any;
    props: any;
    key: string | number | null;
  }

  interface ElementClass {
    render(): JSX.Element | null;
  }

  interface ElementAttributesProperty {
    props: {};
  }

  interface ElementChildrenAttribute {
    children: {};
  }

  interface IntrinsicAttributes {
    key?: string | number;
  }

  interface IntrinsicClassAttributes<T> {
    ref?: React.RefObject<T>;
  }

  interface IntrinsicElements {
    // Basic HTML elements
    div: any;
    span: any;
    p: any;
    a: any;
    button: any;
    input: any;
    label: any;
    select: any;
    option: any;
    h1: any;
    h2: any;
    h3: any;
    h4: any;
    h5: any;
    h6: any;
    main: any;
    section: any;
    article: any;
    nav: any;
    ul: any;
    li: any;
    strong: any;
    svg: any;
    path: any;
    br: any;
    details: any;
    summary: any;
    pre: any;
    footer: any;
    canvas: any;
    img: any;
    iframe: any;
    code: any;
    table: any;
    thead: any;
    tbody: any;
    tr: any;
    th: any;
    td: any;
    small: any;
    header: any;
    form: any;
    textarea: any;
    figure: any;
    figcaption: any;
    video: any;
    audio: any;
    source: any;
  }
}
