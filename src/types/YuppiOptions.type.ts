export type YuppiOptions = {
  output_dir?: string;

  error_messages?: {
    base?: {
      nullable?: string;
      required?: string;
    };

    string?: {
      type?: string;
      enum?: string;
      pattern?: string;
      min?: string;
      max?: string;
    };

    number?: {
      type?: string;
      enum?: string;
      min?: string;
      max?: string;
      integer?: string;
      positive?: string;
      negative?: string;
    };

    boolean?: {
      type?: string;
    };

    date?: {
      type?: string;
      min?: string;
      max?: string;
    };

    object?: {
      type?: string;
    };

    array?: {
      type?: string;
      min?: string;
      max?: string;
    };
  };

  validation?: {
    abort_early?: boolean;
    strip_unknown?: boolean;
  };
};
