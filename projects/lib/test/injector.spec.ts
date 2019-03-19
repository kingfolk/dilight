import { Injectable, Dilight, Injector } from '../src';

class ServiceA {
  static id = 0;
  id = ServiceA.id ++;
}

class ServiceB {
  static id = 0;
  id = ServiceB.id ++;
}

describe('Injector', () => {
  let parentInjector: Injector;
  let childInjector: Injector;

  beforeEach(() => {
    parentInjector = Injector.create();
    childInjector = Injector.create([ServiceA], parentInjector);
  });

  it('should go to parent injector if child injector has not been provided request service', () => {
    const mockB = new ServiceB();
    spyOn(parentInjector, 'get').and.returnValue(mockB);
    const b = childInjector.get(ServiceB);
    expect(b).toBe(mockB);
  });

  it('should get service if injector has been provided request service', () => {
    spyOn(parentInjector, 'get').and.callThrough();
    const a = childInjector.get(ServiceA);
    expect(parentInjector.get).not.toHaveBeenCalled();
    expect(a).toBeDefined();
    expect(a.id).toBe(0);

    const a1 = childInjector.get(ServiceA);
    expect(a1).toBe(a);
  });
});
