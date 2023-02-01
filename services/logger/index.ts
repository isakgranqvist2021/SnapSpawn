export namespace Logger {
  export const log = (type: 'error' | 'info' | 'warning', payload: any) => {
    switch (type) {
      case 'error':
        console.error(type, payload);
        break;

      case 'info':
        console.info(type, payload);
        break;

      case 'warning':
        console.warn(type, payload);
        break;

      default:
        console.log(type, payload);
    }
  };
}
