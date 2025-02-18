import { useContext } from 'react';
import { StoriesControllerContext } from '../config';

export const useStoriesController = () => useContext(StoriesControllerContext);
