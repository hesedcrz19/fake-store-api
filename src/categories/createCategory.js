export const createCategory = ({ name, image, id = crypto.randomUUID(), creationAt = new Date() }) => ({
  id,
  name,
  slug: name.toLowerCase().replace(/\s+/g, '-'),
  image,
  creationAt,
  updatedAt: new Date(),
});
