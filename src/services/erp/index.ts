
import { QUMSProvider } from './qums-provider';
import { IERPProvider } from './interface';

export const getERPProvider = (): IERPProvider => {
  return new QUMSProvider();
};
