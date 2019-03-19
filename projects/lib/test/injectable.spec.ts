import { Injectable, Dilight, Injector } from '../src';

class ZeroConstructorParamClass {
  name = 'ZeroConstructorParamClass';
}

@Injectable()
class HasConstructorParamClass {
  name = 'withAnnotation';

  constructor(private dep: ZeroConstructorParamClass) {
  }
}

class HasConstructorParamWithoutAnnotationClass {
  name = 'withoutAnnotation';

  constructor(private dep: ZeroConstructorParamClass) {
  }
}

describe('Injectable', () => {
  let injector: Injector;

  beforeEach(() => {
    injector = Dilight.new([ZeroConstructorParamClass]);
  });

  it('should inject normal class when the class has no constructor params/dependent services', () => {
    const instance = injector.get(ZeroConstructorParamClass);
    expect(instance).toBeTruthy();
  });

  it('should inject class with Injectable annotation when the class has constructor params/dependent services', () => {
    const instance = injector.get(HasConstructorParamClass);
    expect(instance).toBeTruthy();

    expect(() => injector.get(HasConstructorParamWithoutAnnotationClass)).toThrowError();
  });
});
