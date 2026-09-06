export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return Response.json({
        status: "ok",
        service: "FlowHunter API",
        massiveConfigured: Boolean(env.MASSIVE_API_KEY),
      });
    }

    if (url.pathname === "/api/massive/test") {
      if (!env.MASSIVE_API_KEY) {
        return Response.json(
          { error: "MASSIVE_API_KEY is not configured" },
          { status: 500 }
        );
      }

      const massiveUrl =
        "https://api.massive.com/v3/reference/options/contracts" +
        "?underlying_ticker=AAPL&limit=3";

      const response = await fetch(massiveUrl, {
        headers: {
          Authorization: `Bearer ${env.MASSIVE_API_KEY}`,
        },
      });

      const data = await response.json();

      return Response.json({
        ok: response.ok,
        status: response.status,
        massive: data,
      });
    }

    return env.ASSETS.fetch(request);
  },
};
