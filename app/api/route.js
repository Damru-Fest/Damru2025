export async function POST(req) {
  try {
    const { url } = await req.json();

    if (!url) {
      return new Response("Missing 'url' in request body", { status: 400 });
    }

    const response = await fetch(url);

    if (!response.ok) {
      return new Response("Failed to fetch markdown file", {
        status: response.status,
      });
    }

    const text = await response.text();

    return new Response(text, {
      status: 200,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error fetching markdown:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
