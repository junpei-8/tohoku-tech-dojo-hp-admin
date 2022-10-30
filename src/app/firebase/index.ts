import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore/lite';
import { environment } from '@/environments/environment';

export * from './admins.d';
export * from './blogs.d';

export const app = initializeApp(environment.firebase);

export const auth = getAuth(app);

export const firestore = getFirestore(app);
