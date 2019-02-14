import { InjectMeta } from './inject-meta';
import { Type } from './typing';

export function isModule<T>(provider: Type<T>): boolean {
  const res = InjectMeta.checkInjector(provider);
  return res;
}
