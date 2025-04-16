const transformData = (inputData) => {
  // Helper function to build the tree structure
  const buildTree = (items, parentId = 0) => {
    return items
      .filter((item) => item.parent === parentId)
      .map((item) => ({
        id: item.id.toString(),
        name: item.text,
        isDir: item.droppable,
        files: buildTree(items, item.id), // Recursively build files
      }));
  };

  // Create the root node
  return [
    {
      id: "0",
      name: "Root",
      isDir: true,
      files: buildTree(inputData),
    },
  ];
};

export default transformData;
