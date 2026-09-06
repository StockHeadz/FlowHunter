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

    if (url.pathname === "/api/options") {
      if (!env.MASSIVE_API_KEY) {
        return Response.json(
          { error: "MASSIVE_API_KEY is not configured" },
          { status: 500 }
        );
      }

      const ticker = (url.searchParams.get("ticker") || "AAPL")
        .trim()
        .toUpperCase();

      const contractType = (url.searchParams.get("type") || "all")
        .trim()
        .toLowerCase();

      if (!/^[A-Z.]{1,10}$/.test(ticker)) {
        return Response.json(
          { error: "Invalid ticker symbol" },
          { status: 400 }
        );
      }

      if (!["all", "call", "put"].includes(contractType)) {
        return Response.json(
          { error: "Invalid contract type" },
          { status: 400 }
        );
      }

      const cache = caches.default;
      const cacheUrl = new URL(request.url);
      cacheUrl.searchParams.set("ticker", ticker);
      cacheUrl.searchParams.set("type", contractType);

      const cacheKey = new Request(cacheUrl.toString(), {
        method: "GET",
      });

      const cachedResponse = await cache.match(cacheKey);

      if (cachedResponse) {
        return cachedResponse;
      }

      let massiveUrl =
        "https://api.massive.com/v3/reference/options/contracts" +
        `?underlying_ticker=${encodeURIComponent(ticker)}` +
        "&expired=false&limit=20&sort=expiration_date&order=asc";

      if (contractType !== "all") {
        massiveUrl += `&contract_type=${contractType}`;
      }

      const response = await fetch(massiveUrl, {
        headers: {
          Authorization: `Bearer ${env.MASSIVE_API_KEY}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return Response.json(
          {
            error: "Massive request failed",
            status: response.status,
            details: data,
          },
          { status: response.status }
        );
      }

      const contracts = (data.results || []).map((contract) => ({
        ticker: contract.ticker,
        underlyingTicker: contract.underlying_ticker,
        contractType: contract.contract_type,
        strikePrice: contract.strike_price,
        expirationDate: contract.expiration_date,
        exerciseStyle: contract.exercise_style,
        sharesPerContract: contract.shares_per_contract,
        primaryExchange: contract.primary_exchange,
      }));

      const apiResponse = Response.json(
        {
          ok: true,
          underlyingTicker: ticker,
          count: contracts.length,
          contracts,
        },
        {
          headers: {
            "Cache-Control": "public, max-age=300",
          },
        }
      );

      await cache.put(cacheKey, apiResponse.clone());

      return apiResponse;
    }

    return env.ASSETS.fetch(request);
  },
};
