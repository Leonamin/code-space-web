
import { toast } from "sonner";

export interface CodeSpace {
  id: number;
  name: string;
  description: string;
  owner_name: string;
  created_at: string;
  updated_at: string;
}

export interface CodePieceSummary {
  id: number;
  space_id: number;
  name: string;
  description: string;
  owner_name: string;
  language: string;
  created_at: string;
  updated_at: string;
}

export interface CodePieceDetail extends CodePieceSummary {
  code: string;
}

export interface CreateCodeSpaceRequest {
  name: string;
  password: string;
  owner_name: string;
  description?: string;
}

export interface CreateCodePieceRequest {
  space_id: number;
  name: string;
  description?: string;
  language: string;
  code: string;
  password: string;
  owner_name: string;
}

export interface UpdateCodePieceRequest {
  name?: string;
  description?: string;
  language?: string;
  code?: string;
  password: string;
  owner_name?: string;
}

const API_BASE_URL = "https://api-codespace.cuteshrew.com";

async function handleRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Request failed with status ${response.status}`);
    }

    // Some endpoints might not return anything
    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    toast.error(error instanceof Error ? error.message : "An unknown error occurred");
    throw error;
  }
}

export const api = {
  // CodeSpace endpoints
  getCodeSpaces: async (page: number = 0): Promise<CodeSpace[]> => {
    return handleRequest<CodeSpace[]>(`${API_BASE_URL}/api/codespaces?page=${page}`);
  },

  getCodeSpaceDetail: async (spaceId: number): Promise<CodeSpace> => {
    return handleRequest<CodeSpace>(`${API_BASE_URL}/api/codespaces/${spaceId}`);
  },

  createCodeSpace: async (data: CreateCodeSpaceRequest): Promise<void> => {
    return handleRequest<void>(`${API_BASE_URL}/api/codespaces`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateCodeSpace: async (
    spaceId: number,
    data: Partial<CreateCodeSpaceRequest> & { password: string }
  ): Promise<void> => {
    return handleRequest<void>(`${API_BASE_URL}/api/codespaces/${spaceId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  deleteCodeSpace: async (spaceId: number): Promise<void> => {
    return handleRequest<void>(`${API_BASE_URL}/api/codespaces/${spaceId}`, {
      method: "DELETE",
    });
  },

  // CodePiece endpoints
  getCodePieces: async (spaceId: number, page: number = 0): Promise<CodePieceSummary[]> => {
    return handleRequest<CodePieceSummary[]>(
      `${API_BASE_URL}/api/codepieces?page=${page}&space_id=${spaceId}`
    );
  },

  getCodePieceDetail: async (pieceId: number): Promise<CodePieceDetail> => {
    return handleRequest<CodePieceDetail>(`${API_BASE_URL}/api/codepieces/${pieceId}`);
  },

  createCodePiece: async (data: CreateCodePieceRequest): Promise<void> => {
    return handleRequest<void>(`${API_BASE_URL}/api/codepieces`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateCodePiece: async (
    pieceId: number,
    data: UpdateCodePieceRequest
  ): Promise<void> => {
    return handleRequest<void>(`${API_BASE_URL}/api/codepieces/${pieceId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  deleteCodePiece: async (pieceId: number, password: string): Promise<void> => {
    return handleRequest<void>(`${API_BASE_URL}/api/codepieces/${pieceId}`, {
      method: "DELETE",
      body: JSON.stringify({ password }),
    });
  },
};
