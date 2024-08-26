export const VITE_API_URL = import.meta.env.VITE_API_URL;

async function fetchGraphQL(query: any, variables?: Record<string, any>) {
  const body: any = {
    query: query,
  };
  if (variables) {
    body.variables = variables;
  }
  try {
    const response = await fetch(`${VITE_API_URL}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (response.ok) {
      return data.data;
    } else {
      throw new Error(
        data.errors
          ? data.errors[0].message
          : `Error fetching data from ${VITE_API_URL}`
      );
    }
  } catch (error) {
    throw new Error(error.message || "Network error");
  }
}

export default fetchGraphQL;
