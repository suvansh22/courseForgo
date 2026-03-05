const formatSnakeCase = (str: string) => {
  if (!str) return "";
  return str.replace(/_/g, " ");
};

export { formatSnakeCase };
