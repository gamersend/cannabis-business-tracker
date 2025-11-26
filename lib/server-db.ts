// Server-only database operations wrapper
import { 
  getTopCustomers as _getTopCustomers,
  getDailyProfits as _getDailyProfits,
  getStrains as _getStrains,
  logAIParsing as _logAIParsing
} from './database';

// Ensure these functions only run on the server
export const getTopCustomers = (limit?: number) => {
  if (typeof window !== 'undefined') {
    throw new Error('Database operations can only be called on the server side');
  }
  return _getTopCustomers(limit);
};

export const getDailyProfits = (days?: number) => {
  if (typeof window !== 'undefined') {
    throw new Error('Database operations can only be called on the server side');
  }
  return _getDailyProfits(days);
};

export const getStrains = () => {
  if (typeof window !== 'undefined') {
    throw new Error('Database operations can only be called on the server side');
  }
  return _getStrains();
};

export const logAIParsing = (data: any) => {
  if (typeof window !== 'undefined') {
    throw new Error('Database operations can only be called on the server side');
  }
  return _logAIParsing(data);
};
