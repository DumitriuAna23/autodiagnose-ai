const API_BASE_URL = "http://127.0.0.1:8000";


export type User = {
  id: string;
  email: string;
  preferred_language: string;
  account_status: string;
};


export async function login(
  email: string,
  password: string
): Promise<User> {
  const response = await fetch(
    `${API_BASE_URL}/api/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  if (!response.ok) {
    const data = await response.json();

    throw new Error(
      data.detail ?? "Login failed."
    );
  }

  return response.json();
}


export async function register(
  email: string,
  password: string,
  preferredLanguage: "ro" | "en"
): Promise<User> {
  const response = await fetch(
    `${API_BASE_URL}/api/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email,
        password,
        preferred_language:
          preferredLanguage,
      }),
    }
  );

  if (!response.ok) {
    const data = await response.json();

    throw new Error(
      data.detail ?? "Registration failed."
    );
  }

  return response.json();
}


export async function getCurrentUser():
  Promise<User | null> {
  const response = await fetch(
    `${API_BASE_URL}/api/auth/me`,
    {
      credentials: "include",
    }
  );

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      "Could not load current user."
    );
  }

  return response.json();
}


export async function logout():
  Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/api/auth/logout`,
    {
      method: "POST",
      credentials: "include",
    }
  );

  if (
    !response.ok &&
    response.status !== 204
  ) {
    throw new Error("Logout failed.");
  }
}


export async function startGuest():
  Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/api/guest/start`,
    {
      method: "POST",
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Could not start guest session."
    );
  }
}
export async function getCurrentGuest():
  Promise<boolean> {
  const response = await fetch(
    `${API_BASE_URL}/api/guest/me`,
    {
      credentials: "include",
    }
  );

  if (response.status === 401) {
    return false;
  }

  if (!response.ok) {
    throw new Error(
      "Could not verify guest session."
    );
  }

  return true;
}
export type DiagnosticCaseRecord = {
  case_id: string;
  payload: unknown;
  created_at: string | null;
  analysis_payload: unknown | null;
  analyzed_at: string | null;
  status: string;
};


export async function getDiagnosticCases():
  Promise<DiagnosticCaseRecord[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/diagnostic-cases`,
    {
      credentials: "include",
    }
  );

  if (response.status === 401) {
    return [];
  }

  if (!response.ok) {
    throw new Error(
      "Could not load diagnostic history."
    );
  }

  const data: unknown =
    await response.json();


  if (Array.isArray(data)) {
    return data as DiagnosticCaseRecord[];
  }


  if (
    typeof data === "object" &&
    data !== null &&
    "cases" in data
  ) {
    const cases = (
      data as {
        cases?: unknown;
      }
    ).cases;

    if (Array.isArray(cases)) {
      return cases as DiagnosticCaseRecord[];
    }
  }


  return [];
}