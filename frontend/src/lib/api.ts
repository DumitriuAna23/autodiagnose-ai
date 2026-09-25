import {
  API_BASE_URL,
} from "@/lib/config";



export type User = {
  id: string;
  email: string;
  preferred_language: string;
  account_status: string;
};


export type AccountDataExport = {
  exported_at: string;
  account: {
    id: string;
    email: string;
    preferred_language: string;
    account_status: string;
    created_at: string | null;
    updated_at: string | null;
  };
  diagnostic_cases: Array<{
    case_id: string;
    status: string;
    created_at: string | null;
    analyzed_at: string | null;
    input: unknown;
    analysis: unknown | null;
  }>;
};


export async function login(
  email: string,
  password: string
): Promise<User> {
  let response: Response;

  try {
    response = await fetch(
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
  } catch {
    throw new Error(
      "SERVER_UNAVAILABLE"
    );
  }

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error(
        "INVALID_CREDENTIALS"
      );
    }

    if (response.status === 403) {
      throw new Error(
        "ACCOUNT_INACTIVE"
      );
    }

    if (response.status === 422) {
      try {
        const data =
          await response.json();

        if (
          Array.isArray(
            data.detail
          )
        ) {
          const passwordError =
            data.detail.find(
              (item: {
                loc?: unknown[];
                msg?: string;
              }) =>
                Array.isArray(
                  item.loc
                ) &&
                item.loc.includes(
                  "password"
                )
            );

          const emailError =
            data.detail.find(
              (item: {
                loc?: unknown[];
                msg?: string;
              }) =>
                Array.isArray(
                  item.loc
                ) &&
                item.loc.includes(
                  "email"
                )
            );

          if (emailError) {
            throw new Error(
              "INVALID_EMAIL"
            );
          }

          if (passwordError) {
            throw new Error(
              "PASSWORD_TOO_SHORT"
            );
          }
        }
      } catch (error) {
        if (
          error instanceof
          Error
        ) {
          throw error;
        }
      }

      throw new Error(
        "INVALID_LOGIN_DATA"
      );
    }

    throw new Error(
      "LOGIN_FAILED"
    );
  }

  return response.json();
}


export async function register(
  email: string,
  password: string,
  preferredLanguage:
    "ro" | "en"
): Promise<User> {
  const response =
    await fetch(
      `${API_BASE_URL}/api/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        credentials:
          "include",
        body: JSON.stringify({
          email,
          password,
          preferred_language:
            preferredLanguage,
        }),
      }
    );

  if (!response.ok) {
    const data =
      await response.json();

    throw new Error(
      data.detail ??
        "Registration failed."
    );
  }

  return response.json();
}


export async function getCurrentUser():
  Promise<User | null> {
  const response =
    await fetch(
      `${API_BASE_URL}/api/auth/me`,
      {
        credentials:
          "include",
      }
    );

  if (
    response.status === 401
  ) {
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
  const response =
    await fetch(
      `${API_BASE_URL}/api/auth/logout`,
      {
        method: "POST",
        credentials:
          "include",
      }
    );

  if (
    !response.ok &&
    response.status !== 204
  ) {
    throw new Error(
      "Logout failed."
    );
  }
}


export async function startGuest():
  Promise<void> {
  const response =
    await fetch(
      `${API_BASE_URL}/api/guest/start`,
      {
        method: "POST",
        credentials:
          "include",
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
  const response =
    await fetch(
      `${API_BASE_URL}/api/guest/me`,
      {
        credentials:
          "include",
      }
    );

  if (
    response.status === 401
  ) {
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
  analysis_payload:
    unknown | null;
  analyzed_at: string | null;
  status: string;
};


export async function getDiagnosticCases():
  Promise<
    DiagnosticCaseRecord[]
  > {
  const response =
    await fetch(
      `${API_BASE_URL}/api/diagnostic-cases`,
      {
        credentials:
          "include",
      }
    );

  if (
    response.status === 401
  ) {
    return [];
  }

  if (!response.ok) {
    throw new Error(
      "Could not load diagnostic history."
    );
  }

  const data: unknown =
    await response.json();


  if (
    Array.isArray(
      data
    )
  ) {
    return data as
      DiagnosticCaseRecord[];
  }


  if (
    typeof data ===
      "object" &&
    data !== null &&
    "cases" in data
  ) {
    const cases = (
      data as {
        cases?: unknown;
      }
    ).cases;

    if (
      Array.isArray(
        cases
      )
    ) {
      return cases as
        DiagnosticCaseRecord[];
    }
  }


  return [];
}


export async function exportAccountData():
  Promise<AccountDataExport> {
  let response: Response;

  try {
    response =
      await fetch(
        `${API_BASE_URL}/api/account/export`,
        {
          method: "GET",
          credentials:
            "include",
        }
      );
  } catch {
    throw new Error(
      "SERVER_UNAVAILABLE"
    );
  }


  if (
    response.status === 401
  ) {
    throw new Error(
      "AUTH_REQUIRED"
    );
  }


  if (!response.ok) {
    throw new Error(
      "ACCOUNT_EXPORT_FAILED"
    );
  }


  return response.json();
}


export async function deleteAccount(
  confirmation:
    "DELETE"
): Promise<void> {
  let response: Response;

  try {
    response =
      await fetch(
        `${API_BASE_URL}/api/account`,
        {
          method: "DELETE",
          headers: {
            "Content-Type":
              "application/json",
          },
          credentials:
            "include",
          body:
            JSON.stringify({
              confirmation,
            }),
        }
      );
  } catch {
    throw new Error(
      "SERVER_UNAVAILABLE"
    );
  }


  if (
    response.status === 401
  ) {
    throw new Error(
      "AUTH_REQUIRED"
    );
  }


  if (
    !response.ok &&
    response.status !== 204
  ) {
    throw new Error(
      "ACCOUNT_DELETE_FAILED"
    );
  }
}
