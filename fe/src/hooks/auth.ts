import { AuthContext } from '@/types/auth';
import { useSafeContext } from '@/utils/context';

export const useAuth = () => useSafeContext(AuthContext);
