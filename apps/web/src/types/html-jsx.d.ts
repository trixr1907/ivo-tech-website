declare namespace JSX {
  interface IntrinsicElements {
    // Basic HTML elements
    div: any;
    span: any;
    p: any;
    a: any;
    button: any;
    input: any;
    select: any;
    option: any;
    label: any;
    form: any;
    img: any;
    video: any;
    audio: any;
    iframe: any;
    canvas: any;
    svg: any;
    path: any;
    circle: any;
    rect: any;
    line: any;
    polygon: any;
    polyline: any;

    // Text elements
    h1: any;
    h2: any;
    h3: any;
    h4: any;
    h5: any;
    h6: any;
    strong: any;
    em: any;
    blockquote: any;
    pre: any;
    code: any;
    br: any;
    hr: any;

    // Lists
    ul: any;
    ol: any;
    li: any;
    dl: any;
    dt: any;
    dd: any;

    // Table elements
    table: any;
    thead: any;
    tbody: any;
    tfoot: any;
    tr: any;
    th: any;
    td: any;

    // Form elements
    fieldset: any;
    legend: any;
    textarea: any;

    // Document structure
    html: any;
    head: any;
    body: any;
    title: any;
    meta: any;
    link: any;
    script: any;
    style: any;

    // Section elements
    header: any;
    nav: any;
    main: any;
    article: any;
    section: any;
    aside: any;
    footer: any;

    // Other HTML5 elements
    figure: any;
    figcaption: any;
    picture: any;
    source: any;
    track: any;
    time: any;
    mark: any;
    details: any;
    summary: any;
    dialog: any;
    template: any;
    slot: any;

    // Semantic elements
    address: any;
  }
}

declare module 'react' {
  interface HTMLAttributes<T> {
    [key: string]: any;
  }
  interface SVGAttributes<T> {
    [key: string]: any;
  }
}
