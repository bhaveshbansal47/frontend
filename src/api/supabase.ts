// i have added actual url here for deployment

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://delve-backend.onrender.com";

export async function getProjects(token: string) {
    const res = await fetch(`${BASE_URL}/api/supabase/projects`, {
        headers: {
            "supabase-token": token,
        },
    });
    const data = (await res.json()).data;
    return data;
}

export async function getUsers(token: string, organisationId: string) {
    const res = await fetch(
        `${BASE_URL}/api/supabase/organisation/${organisationId}/users`,
        {
            headers: {
                "supabase-token": token,
            },
        }
    );
    const data = (await res.json()).data;
    return data;
}

export async function getTables(token: string, projectId: string) {
    const res = await fetch(
        `${BASE_URL}/api/supabase/project/${projectId}/tables`,
        {
            headers: {
                "supabase-token": token,
            },
        }
    );
    const data = (await res.json()).data;
    return data;
}

export async function enableRls(token: string, projectId: string, tableName: string) {
        const res = await fetch(
                `${BASE_URL}/api/supabase/project/${projectId}/table/${tableName}/enableRls`,
                {
                        method: "PUT",
                        headers: {
                        "supabase-token": token,
                        },
                }
                );
        const data = await res.json();
        return data;
}

export async function getAiResponse(message: string) {
    const res = await fetch(`${BASE_URL}/api/supabase/ai-assistant`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
    });
    const data = await res.json();
    return data;
}
