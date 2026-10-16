type ContactPayload = {
  name?: string;
  email?: string;
  message?: string;
};

export async function POST(request: Request) {
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;

  if (!accessKey) {
    return Response.json(
      { success: false, message: "Contact form is not configured." },
      { status: 500 }
    );
  }

  let payload: ContactPayload;
  try {
    payload = await request.json();
  } catch {
    return Response.json(
      { success: false, message: "Invalid request body." },
      { status: 400 }
    );
  }

  if (!payload.name || !payload.email || !payload.message) {
    return Response.json(
      { success: false, message: "Name, email, and message are required." },
      { status: 400 }
    );
  }

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({
        access_key: accessKey,
        name: payload.name,
        email: payload.email,
        message: payload.message,
      }),
    });

    const result = await response.json();
    return Response.json(result, { status: response.status });
  } catch {
    return Response.json(
      { success: false, message: "Unable to send the message right now." },
      { status: 502 }
    );
  }
}