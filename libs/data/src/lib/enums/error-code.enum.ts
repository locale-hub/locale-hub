
/**
 * List of errors the API can returns
 */
export enum ErrorCode {
  appCannotCreate = 'app_cannot_create',
  appNotFound = 'app_not_found',
  commitCannotPublish = 'commit_cannot_publish',
  commitNotFound = 'commit_not_found',
  localeNotFound = 'locale_not_found',
  organizationActionRequiresOwnerAccess = 'organization_action_requires_owner_access',
  organizationCannotDeleteDefaultPaymentMethod = 'organization_cannot_delete_default_payment_method',
  organizationNotFound = 'organization_not_found',
  organizationUserAlreadyExists = 'organization_user_already_exists',
  organizationUserCannotRemoveOwner = 'organization_user_cannot_remove_owner',
  projectCannotCreate = 'project_cannot_create',
  projectNotFound = 'project_not_found',
  notificationCannotCreate = 'notification_cannot_create',
  notificationNotFound = 'notification_not_found',
  requestInvalid = 'request_invalid',
  routeNotFound = 'route_not_found',
  unknownError =  'unknown_error',
  userAccessExpired = 'user_access_expired',
  userAccessForbidden = 'user_access_forbidden',
  userAccessUnauthorized = 'user_access_unauthorized',
  userEmailAlreadyExists = 'user_email_already_exists',
  userNotFound = 'user_not_found',
  userInvitationExpired = 'user_invitation_expired',
  userInvitationInvalidAccount = 'user_invitation_invalid_account',
  userPasswordMismatch = 'user_password_mismatch',
  userPasswordWeak = 'user_password_weak',
  serverError = 'server_error',
  stripeError = 'stripe_error',
}
