import { faker } from '@faker-js/faker';

export const generateStoryData = (count = 20) => {
  return Array.from({ length: count }, (_, index) => ({
    id: faker.string.uuid(),
    image: faker.image.url(),
    title: index % 2 === 0 ? faker.lorem.words(3) : '',
    isViewed: faker.datatype.boolean(),
    steps: Array.from({ length: faker.number.int({ min: 2, max: 5 }) }, () => ({
      id: faker.string.uuid(),
      image: faker.image.url(),
      title: faker.lorem.words(5),
      duration: faker.number.int({ min: 3000, max: 10000 }),
    })),
  }));
};
