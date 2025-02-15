import { useContext } from 'react';
import { StoriesContext } from '../config';

export const useStoriesPlayer = () => useContext(StoriesContext);
