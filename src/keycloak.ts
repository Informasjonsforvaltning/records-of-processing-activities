import config from 'config';
import Keycloak, { Token } from 'keycloak-connect';
import { RequestHandler, Request } from 'express';

const {
  config: keycloakConfig,
  'allowed-authority': allowedAuthority
} = config.get('keycloak');

const keycloakInstance = new Keycloak({}, keycloakConfig);

const getAuthorities = ({ authorities }: any): string[] =>
  authorities ? authorities.split(',') : [];

const checkAuthority = ({ content }: Token): boolean =>
  getAuthorities(content).includes(allowedAuthority);

const checkPermissions = (
  { content }: Token,
  { params: { organizationId } }: Request
) =>
  getAuthorities(content).some(authority => authority.includes(organizationId));

export const enforceAuthority: RequestHandler = keycloakInstance.protect(
  checkAuthority
);

export const enforcePermissions: RequestHandler = keycloakInstance.protect(
  checkPermissions
);

export default keycloakInstance;
