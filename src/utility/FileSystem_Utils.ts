export default function handlePathChangeAtDepth(targetDepth: number, newPath: string, targetNode: {id: number}, getPathFromProject: (id: number) => string) {
    const nodePath = getPathFromProject(targetNode.id).split("/");
    nodePath.splice(targetDepth - 1, 0, newPath);
    return nodePath.join("/").replace("//", "/");
  }