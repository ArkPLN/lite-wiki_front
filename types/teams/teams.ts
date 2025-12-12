/**
 * Team visibility options
 */
export type TeamVisibility = "Private" | "Public" | "Protected";

/**
 * Team join policy options
 */
export type TeamJoinPolicy = "InviteOnly" | "Open" | "ByApplication";

/**
 * Team member permission options
 */
export type TeamMemberPermission = string;

/**
 * Team settings configuration
 */
export interface TeamSettings {
  teamId?: string;
  allowMemberInvite?: boolean;
  allowGuestAccess?: boolean;
  maxMembers?: number;
  inviteLinkExpireHours?: number;
}

/**
 * Team member information
 */
export interface TeamMember {
  id?: string;
  userId?: string;
  userName?: string | null;
  roleLabel?: string;
  permissions?: string[];
  status?: string;
  joinSource?: string;
  createdAt?: string;
}

/**
 * Team space information
 */
export interface TeamSpace {
  id?: string;
  teamId?: string;
  name?: string;
  icon?: string | null;
  isPrivate?: boolean;
  createdAt?: string;
}

/**
 * Team information
 */
export interface Team {
  id?: string;
  name?: string;
  description?: string;
  icon?: string | null;
  slug?: string;
  visibility?: string;
  joinPolicy?: string;
  ownerId?: string;
  memberCount?: number;
  settings?: TeamSettings | null;
  members?: TeamMember[];
  spaces?: TeamSpace[];
  createdAt?: string;
}

/**
 * Request to create a new team
 */
export interface CreateTeamRequest {
  name: string;
  description?: string | null;
  visibility?: TeamVisibility;
  joinPolicy?: TeamJoinPolicy;
  icon?: string | null;
}

/**
 * Request to update team information
 */
export interface UpdateTeamRequest {
  name?: string | null;
  description?: string | null;
  icon?: string | null;
  visibility?: TeamVisibility;
  joinPolicy?: TeamJoinPolicy;
}

/**
 * Request to update member permissions
 */
export interface UpdateMemberPermissionsRequest {
  userId: string;
  permissions: TeamMemberPermission[];
}

/**
 * Request to create a new team space
 */
export interface CreateSpaceRequest {
  name: string;
  icon?: string | null;
  isPrivate?: boolean;
}

/**
 * Response for successful operations
 */
export interface SuccessMessageResponse {
  message?: string;
}

/**
 * List of teams
 */
export type TeamsList = Team[];

/**
 * List of team members
 */
export type TeamMembersList = TeamMember[];

/**
 * List of team spaces
 */
export type TeamSpacesList = TeamSpace[];