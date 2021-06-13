function permissionValidator(config) {
  if (config.userRole !== "ADMIN" || config.ownerId !== config.userId) {
    return false;
  }

  return true;
}

export default permissionValidator;
