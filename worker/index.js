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

    if (url.pathname === "/api/stock/prev") {
      if (!env.MASSIVE_API_KEY) {
        return Response.json(
          { error: "MASSIVE_API_KEY is not configured" },
          { status: 500 }
        );
      }

      const ticker = (url.searchParams.get("ticker") || "AAPL")
        .trim()
        .toUpperCase();

      if (!/^[A-Z.]{1,10}$/.test(ticker)) {
        return Response.json(
          { error: "Invalid ticker symbol" },
          { status: 400 }
        );
      }

      const massiveUrl =
        `https://api.massive.com/v2/aggs/ticker/${encodeURIComponent(ticker)}/prev` +
        "?adjusted=true";

      const response = await fetch(massiveUrl, {
        headers: {
          Authorization: `Bearer ${env.MASSIVE_API_KEY}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return Response.json(
          {
            error: "Massive stock request failed",
            status: response.status,
          },
          { status: response.status }
        );
      }

      const bar = data.results?.[0];

      if (!bar) {
        return Response.json(
          { error: "No previous-day stock data returned" },
          { status: 404 }
        );
      }

      return Response.json({
        ok: true,
        ticker,
        previousDay: {
          open: bar.o,
          high: bar.h,
          low: bar.l,
          close: bar.c,
          volume: bar.v,
          vwap: bar.vw ?? null,
          timestamp: bar.t,
        },
      });
    }

    if (url.pathname === "/api/stock/history") {
      if (!env.MASSIVE_API_KEY) {
        return Response.json(
          { error: "MASSIVE_API_KEY is not configured" },
          { status: 500 }
        );
      }

      const ticker = (url.searchParams.get("ticker") || "AAPL")
        .trim()
        .toUpperCase();

      if (!/^[A-Z.]{1,10}$/.test(ticker)) {
        return Response.json(
          { error: "Invalid ticker symbol" },
          { status: 400 }
        );
      }

      const to = new Date();
      const from = new Date();
      from.setUTCDate(from.getUTCDate() - 45);

      const formatDate = (date) => date.toISOString().slice(0, 10);

      const massiveUrl =
        `https://api.massive.com/v2/aggs/ticker/${encodeURIComponent(ticker)}/range/1/day/${formatDate(from)}/${formatDate(to)}` +
        "?adjusted=true&sort=asc&limit=50";

      const response = await fetch(massiveUrl, {
        headers: {
          Authorization: `Bearer ${env.MASSIVE_API_KEY}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return Response.json(
          {
            error: "Massive stock history request failed",
            status: response.status,
          },
          { status: response.status }
        );
      }

      const bars = (data.results || []).slice(-30).map((bar) => ({
        timestamp: bar.t,
        open: bar.o,
        high: bar.h,
        low: bar.l,
        close: bar.c,
        volume: bar.v,
        vwap: bar.vw ?? null,
      }));

      return Response.json({
        ok: true,
        ticker,
        count: bars.length,
        bars,
      });
    }

    if (url.pathname === "/api/stock/metrics") {
      if (!env.MASSIVE_API_KEY) {
        return Response.json(
          { error: "MASSIVE_API_KEY is not configured" },
          { status: 500 }
        );
      }

      const ticker = (url.searchParams.get("ticker") || "AAPL")
        .trim()
        .toUpperCase();

      if (!/^[A-Z.]{1,10}$/.test(ticker)) {
        return Response.json(
          { error: "Invalid ticker symbol" },
          { status: 400 }
        );
      }

      const to = new Date();
      const from = new Date();
      from.setUTCDate(from.getUTCDate() - 45);

      const formatDate = (date) => date.toISOString().slice(0, 10);

      const massiveUrl =
        `https://api.massive.com/v2/aggs/ticker/${encodeURIComponent(ticker)}/range/1/day/${formatDate(from)}/${formatDate(to)}` +
        "?adjusted=true&sort=asc&limit=50";

      const response = await fetch(massiveUrl, {
        headers: {
          Authorization: `Bearer ${env.MASSIVE_API_KEY}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return Response.json(
          {
            error: "Massive stock metrics request failed",
            status: response.status,
          },
          { status: response.status }
        );
      }

      const bars = (data.results || []).slice(-30);

      if (bars.length < 21) {
        return Response.json(
          { error: "Not enough historical data to calculate metrics" },
          { status: 422 }
        );
      }

      const latest = bars[bars.length - 1];
      const fiveDaysAgo = bars[bars.length - 6];
      const twentyDaysAgo = bars[bars.length - 21];

      const recent20 = bars.slice(-20);
      const prior20Volumes = bars.slice(-21, -1).map((bar) => bar.v);

      const high20 = Math.max(...recent20.map((bar) => bar.h));
      const low20 = Math.min(...recent20.map((bar) => bar.l));
      const averageVolume20 =
        prior20Volumes.reduce((sum, volume) => sum + volume, 0) /
        prior20Volumes.length;

      const round = (value, decimals = 2) =>
        Number(value.toFixed(decimals));

      return Response.json({
        ok: true,
        ticker,
        metrics: {
          close: latest.c,
          return5dPct: round(((latest.c / fiveDaysAgo.c) - 1) * 100),
          return20dPct: round(((latest.c / twentyDaysAgo.c) - 1) * 100),
          high20,
          low20,
          distanceFromHigh20Pct: round(((latest.c / high20) - 1) * 100),
          averageVolume20: Math.round(averageVolume20),
          latestVolume: latest.v,
          relativeVolume: round(latest.v / averageVolume20),
        },
      });
    }

    if (url.pathname === "/api/signal") {
      if (!env.MASSIVE_API_KEY) {
        return Response.json(
          { error: "MASSIVE_API_KEY is not configured" },
          { status: 500 }
        );
      }

      const ticker = (url.searchParams.get("ticker") || "AAPL")
        .trim()
        .toUpperCase();

      if (!/^[A-Z.]{1,10}$/.test(ticker)) {
        return Response.json(
          { error: "Invalid ticker symbol" },
          { status: 400 }
        );
      }

      const to = new Date();
      const from = new Date();
      from.setUTCDate(from.getUTCDate() - 45);

      const formatDate = (date) => date.toISOString().slice(0, 10);

      const massiveUrl =
        `https://api.massive.com/v2/aggs/ticker/${encodeURIComponent(ticker)}/range/1/day/${formatDate(from)}/${formatDate(to)}` +
        "?adjusted=true&sort=asc&limit=50";

      const response = await fetch(massiveUrl, {
        headers: {
          Authorization: `Bearer ${env.MASSIVE_API_KEY}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return Response.json(
          {
            error: "Massive signal request failed",
            status: response.status,
          },
          { status: response.status }
        );
      }

      const bars = (data.results || []).slice(-30);

      if (bars.length < 21) {
        return Response.json(
          { error: "Not enough historical data to calculate signal" },
          { status: 422 }
        );
      }

      const latest = bars[bars.length - 1];
      const fiveDaysAgo = bars[bars.length - 6];
      const twentyDaysAgo = bars[bars.length - 21];
      const recent20 = bars.slice(-20);
      const prior20Volumes = bars.slice(-21, -1).map((bar) => bar.v);

      const high20 = Math.max(...recent20.map((bar) => bar.h));
      const low20 = Math.min(...recent20.map((bar) => bar.l));
      const averageVolume20 =
        prior20Volumes.reduce((sum, volume) => sum + volume, 0) /
        prior20Volumes.length;

      const round = (value, decimals = 2) =>
        Number(value.toFixed(decimals));

      const clamp = (value, min, max) =>
        Math.min(max, Math.max(min, value));

      const return5dPct =
        round(((latest.c / fiveDaysAgo.c) - 1) * 100);

      const return20dPct =
        round(((latest.c / twentyDaysAgo.c) - 1) * 100);

      const relativeVolume =
        round(latest.v / averageVolume20);

      const rangePosition =
        high20 === low20
          ? 0.5
          : (latest.c - low20) / (high20 - low20);

      const momentumScore = clamp(
        Math.round(20 + return5dPct * 0.8 + return20dPct * 0.3),
        0,
        40
      );

      const volumeScore = clamp(
        Math.round(relativeVolume * 20),
        0,
        30
      );

      const pricePositionScore = clamp(
        Math.round(rangePosition * 30),
        0,
        30
      );

      const stockContextScore =
        momentumScore + volumeScore + pricePositionScore;

      return Response.json({
        ok: true,
        ticker,
        provisional: true,
        stage: "DATA INCOMPLETE",
        stockContextScore,
        flowScore: null,
        opportunityScore: null,
        factors: {
          momentum: {
            score: momentumScore,
            max: 40,
            return5dPct,
            return20dPct,
          },
          volume: {
            score: volumeScore,
            max: 30,
            relativeVolume,
          },
          pricePosition: {
            score: pricePositionScore,
            max: 30,
            high20,
            low20,
            close: latest.c,
            rangePositionPct: round(rangePosition * 100),
          },
        },
        missingData: [
          "options trade flow",
          "bid/ask execution",
          "premium",
          "open-interest change",
          "greeks and implied volatility"
        ],
      });
    }

    if (url.pathname === "/api/options/context") {
      if (!env.MASSIVE_API_KEY) {
        return Response.json(
          { error: "MASSIVE_API_KEY is not configured" },
          { status: 500 }
        );
      }

      const ticker = (url.searchParams.get("ticker") || "AAPL")
        .trim()
        .toUpperCase();

      if (!/^[A-Z.]{1,10}$/.test(ticker)) {
        return Response.json(
          { error: "Invalid ticker symbol" },
          { status: 400 }
        );
      }

      const cache = caches.default;
      const cacheUrl = new URL(request.url);
      cacheUrl.search = "";
      cacheUrl.searchParams.set("ticker", ticker);

      const cacheKey = new Request(cacheUrl.toString(), {
        method: "GET",
      });

      const cachedResponse = await cache.match(cacheKey);

      if (cachedResponse) {
        const hitResponse = new Response(cachedResponse.body, cachedResponse);
        hitResponse.headers.set("X-FlowHunter-Cache", "HIT");
        return hitResponse;
      }

      const massiveUrl = new URL(
        "https://api.massive.com/v3/reference/options/contracts"
      );

      massiveUrl.searchParams.set("underlying_ticker", ticker);
      massiveUrl.searchParams.set("expired", "false");
      massiveUrl.searchParams.set("limit", "1000");
      massiveUrl.searchParams.set("sort", "expiration_date");
      massiveUrl.searchParams.set("order", "asc");

      const response = await fetch(massiveUrl.toString(), {
        headers: {
          Authorization: `Bearer ${env.MASSIVE_API_KEY}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return Response.json(
          {
            error: "Massive options context request failed",
            status: response.status,
          },
          { status: response.status }
        );
      }

      const contracts = data.results || [];
      const calls = contracts.filter(
        (contract) => contract.contract_type === "call"
      );
      const puts = contracts.filter(
        (contract) => contract.contract_type === "put"
      );

      const expirations = [
        ...new Set(
          contracts
            .map((contract) => contract.expiration_date)
            .filter(Boolean)
        ),
      ].sort();

      const nearestExpiration = expirations[0] || null;

      const nearestContracts = nearestExpiration
        ? contracts.filter(
            (contract) => contract.expiration_date === nearestExpiration
          )
        : [];

      const nearestCalls = nearestContracts.filter(
        (contract) => contract.contract_type === "call"
      ).length;

      const nearestPuts = nearestContracts.filter(
        (contract) => contract.contract_type === "put"
      ).length;

      const nearestStrikes = nearestContracts
        .map((contract) => Number(contract.strike_price))
        .filter(Number.isFinite);

      const minStrike = nearestStrikes.length
        ? Math.min(...nearestStrikes)
        : null;

      const maxStrike = nearestStrikes.length
        ? Math.max(...nearestStrikes)
        : null;

      const apiResponse = Response.json(
        {
          ok: true,
          ticker,
          source: "Massive contract reference",
          liveFlowData: false,
          countFetched: contracts.length,
          hasMore: Boolean(data.next_url),
          callCount: calls.length,
          putCount: puts.length,
          expirationCount: expirations.length,
          nearestExpiration,
          nearestExpirationContext: {
            contractCount: nearestContracts.length,
            callCount: nearestCalls,
            putCount: nearestPuts,
            minStrike,
            maxStrike,
          },
        },
        {
          headers: {
            "Cache-Control": "public, max-age=300",
            "X-FlowHunter-Cache": "MISS",
          },
        }
      );

      await cache.put(cacheKey, apiResponse.clone());

      return apiResponse;
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
        const hitResponse = new Response(cachedResponse.body, cachedResponse);
        hitResponse.headers.set("X-FlowHunter-Cache", "HIT");
        return hitResponse;
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
        "X-FlowHunter-Cache": "MISS",
          },
        }
      );

      await cache.put(cacheKey, apiResponse.clone());

      return apiResponse;
    }

    return env.ASSETS.fetch(request);
  },
};
