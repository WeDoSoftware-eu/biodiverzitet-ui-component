export function debounceInteraction(delay: number = 300) {
  return function (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    let timeout: ReturnType<typeof setTimeout> | null = null;

    descriptor.value = function (...args: unknown[]) {
      if (timeout !== null) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(() => {
        originalMethod.apply(this, args);
      }, delay);
    };

    return descriptor;
  };
}
