import { Module, Injector, Dilight, Injectable } from '../src';

class ServiceA {
  static id = 0;
  id = ServiceA.id ++;
}

class ServiceB {
  static id = 0;
  id = ServiceB.id ++;
}

@Module()
class ModuleWithoutProvidersClass {
  name = 'withoutProviders';

  constructor(public a: ServiceA, public b: ServiceB, public injector: Injector) {
  }
}

@Module({
  providers: [ServiceA],
})
class ModuleWithProvidersClass {
  name = 'withProvider';

  constructor(public a: ServiceA, public b: ServiceB) {
  }
}

@Injectable()
class NestedSubModuleClass {
  constructor(public childModule: ModuleWithProvidersClass) {
  }
}

@Module({
  providers: [ModuleWithProvidersClass, NestedSubModuleClass],
})
class ComplexModuleClass {
  name = 'complex';

  constructor(
    public childModule: ModuleWithProvidersClass,
    public nestedChildModule: NestedSubModuleClass,
  ) {}
}

describe('Module', () => {
  let injector: Injector;

  beforeEach(() => {
    injector = Dilight.new();
  });

  it('should create module with child injector', () => {
    const moduleWithoutProviders = injector.get(ModuleWithoutProvidersClass);
    expect(moduleWithoutProviders.injector.parent).toBe(injector);
  });

  it('should create module with isolated provider instance if module is annotated with Module and `providers` params', () => {
    const moduleWithoutProviders = injector.get(ModuleWithoutProvidersClass);
    const moduleWithProviders = injector.get(ModuleWithProvidersClass);
    expect(moduleWithProviders.a).not.toBe(moduleWithoutProviders.a);
    expect(moduleWithProviders.b).toBe(moduleWithoutProviders.b);
    expect(Dilight.injectorOf(moduleWithoutProviders.a)).toBe(injector);
    expect(Dilight.injectorOf(moduleWithProviders.a)).not.toBe(injector);
  });

  it('should create complex module', () => {
    const complexModule = injector.get(ComplexModuleClass);
    const {childModule} = complexModule;
    expect(Dilight.injectorOf(childModule.b)).toBe(injector);
    expect(complexModule.childModule).toBe(complexModule.nestedChildModule.childModule);
  });
});
