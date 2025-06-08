import type * as Atomically from "atomically";
import type * as FSExtra from "fs-extra";
import type * as GracefulFS from "graceful-fs";

export type Fs = typeof Atomically & typeof FSExtra & typeof GracefulFS;
