export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // FlowHunter API health check
    if (url.pathname === "/api/health") {
      return Response.json({
        status: "ok",
        service: "FlowHunter API",
        massiveConfigured: Boolean(env.MASSIVE_API_KEY),
      });
    }

    // Everything else is served by the FlowHunter React app
    return env.ASSETS.fetch(request);
  },
};
