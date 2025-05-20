export default class PermissionDeniedError extends Error {
  userId: string;
  userName: string;
  deniedPermissions: string;

  constructor({
    userId,
    userName,
    deniedPermissions,
    message = "User does not have permission to perform this action",
  }: {
    userId: string;
    userName: string;
    deniedPermissions: string;
    message?: string;
  }) {
    super(message);
    this.name = "PermissionDeniedError";
    this.userId = userId;
    this.userName = userName;
    this.deniedPermissions = deniedPermissions;

    Object.setPrototypeOf(this, PermissionDeniedError.prototype);
  }
}
