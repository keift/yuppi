export type YuppiOptions = {
  output_dir?: string;

  error_messages?: {
    string?: {
      type?: string;
      enum?: string;
      pattern?: string;
      min?: string;
      max?: string;
      nullable?: string;
      required?: string;
    };

    number?: {
      type?: string;
      enum?: string;
      min?: string;
      max?: string;
      integer?: string;
      positive?: string;
      negative?: string;
      nullable?: string;
      required?: string;
    };

    boolean?: {
      type?: string;
      nullable?: string;
      required?: string;
    };

    date?: {
      type?: string;
      min?: string;
      max?: string;
      nullable?: string;
      required?: string;
    };

    object?: {
      type?: string;
      nullable?: string;
      required?: string;
    };

    array?: {
      type?: string;
      min?: string;
      max?: string;
      nullable?: string;
      required?: string;
    };

    tuple?: {
      type?: string;
      nullable?: string;
      required?: string;
    };
  };

  validation?: {
    abort_early?: boolean;
    strip_unknown?: boolean;
  };
};
