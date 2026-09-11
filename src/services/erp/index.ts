import { MockERPProvider } from './mock-provider';
import { IERPProvider } from './interface';

/**
 * Factory to get the active ERP provider.
 * In a real environment, this would switch based on NODE_ENV 
 * or a configuration flag.
 */
export const getERPProvider = (): IERPProvider => {
  // Always returning Mock for now as per security instructions.
  // When an official API is confirmed, we will add the ApprovedERPProvider here.
  return new MockERPProvider();
};
