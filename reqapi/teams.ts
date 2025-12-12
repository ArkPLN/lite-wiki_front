import axios from 'axios';
import useUserStore from '@/store';
import {
  Team,
  TeamsList,
  TeamMember,
  TeamMembersList,
  TeamSpace,
  TeamSpacesList,
  CreateTeamRequest,
  UpdateTeamRequest,
  UpdateMemberPermissionsRequest,
  CreateSpaceRequest,
  SuccessMessageResponse
} from '@/types/teams/teams';

// Helper function to get user token
const getUserToken = () => {
  const userState = useUserStore.getState();
  return userState.bearerToken || localStorage.getItem('token') || '';
};

// API function to get current user's teams list
export const getTeamsList = async (): Promise<TeamsList> => {
  const response = await axios.get('/api/v1/teams', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getUserToken()
    }
  });
  return response.data as TeamsList;
};

// API function to create a new team
export const createTeam = async (teamData: CreateTeamRequest): Promise<Team> => {
  const response = await axios.post('/api/v1/teams', teamData, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getUserToken()
    }
  });
  return response.data as Team;
};

// API function to get team details by ID
export const getTeamById = async (teamId: string): Promise<Team> => {
  const response = await axios.get(`/api/v1/teams/${teamId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getUserToken()
    }
  });
  return response.data as Team;
};

// API function to get team details by slug
export const getTeamBySlug = async (slug: string): Promise<Team> => {
  const response = await axios.get(`/api/v1/teams/slug/${slug}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getUserToken()
    }
  });
  return response.data as Team;
};

// API function to update team information
export const updateTeam = async (teamId: string, teamData: UpdateTeamRequest): Promise<Team> => {
  const response = await axios.put(`/api/v1/teams/${teamId}`, teamData, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getUserToken()
    }
  });
  return response.data as Team;
};

// API function to delete a team
export const deleteTeam = async (teamId: string): Promise<SuccessMessageResponse> => {
  const response = await axios.delete(`/api/v1/teams/${teamId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getUserToken()
    }
  });
  return response.data as SuccessMessageResponse;
};

// API function to check user permission in a team
export const checkTeamPermission = async (teamId: string, action: string): Promise<void> => {
  await axios.get(`/api/v1/teams/${teamId}/check-permission`, {
    params: { action },
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getUserToken()
    }
  });
  // According to raw.ts, this API returns 200 with no content
};

// API function to get team members list
export const getTeamMembers = async (teamId: string): Promise<TeamMembersList> => {
  const response = await axios.get(`/api/v1/teams/${teamId}/members`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getUserToken()
    }
  });
  return response.data as TeamMembersList;
};

// API function to update member permissions
export const updateMemberPermissions = async (teamId: string, userId: string, permissionsData: UpdateMemberPermissionsRequest): Promise<SuccessMessageResponse> => {
  const response = await axios.put(`/api/v1/teams/${teamId}/members/${userId}/permissions`, permissionsData, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getUserToken()
    }
  });
  return response.data as SuccessMessageResponse;
};

// API function to remove a team member
export const removeTeamMember = async (teamId: string, userId: string): Promise<SuccessMessageResponse> => {
  const response = await axios.delete(`/api/v1/teams/${teamId}/members/${userId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getUserToken()
    }
  });
  return response.data as SuccessMessageResponse;
};

// API function to get team spaces list
export const getTeamSpaces = async (teamId: string): Promise<TeamSpacesList> => {
  const response = await axios.get(`/api/v1/teams/${teamId}/spaces`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getUserToken()
    }
  });
  return response.data as TeamSpacesList;
};

// API function to create a new team space
export const createTeamSpace = async (teamId: string, spaceData: CreateSpaceRequest): Promise<TeamSpace> => {
  const response = await axios.post(`/api/v1/teams/${teamId}/spaces`, spaceData, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getUserToken()
    }
  });
  return response.data as TeamSpace;
};

// API function to delete a team space
export const deleteTeamSpace = async (teamId: string, spaceId: string): Promise<SuccessMessageResponse> => {
  const response = await axios.delete(`/api/v1/teams/${teamId}/spaces/${spaceId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getUserToken()
    }
  });
  return response.data as SuccessMessageResponse;
};

// API function to generate invite link for team
export const generateTeamInviteLink = async (teamId: string): Promise<any> => {
  const response = await axios.post(`/api/v1/teams/${teamId}/invites`, {}, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getUserToken()
    }
  });
  return response.data;
};