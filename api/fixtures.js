
export default async function handler(req, res) {
  res.setHeader(
    "Cache-Control",
    "s-maxage=300, stale-while-revalidate=600"
  );

  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  const apiKey = process.env.API_FOOTBALL_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "API key is not configured"
    });
  }

  const date = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Casablanca",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date());

  try {
    const response = await fetch(
      `https://v3.football.api-sports.io/fixtures?date=${date}&timezone=Africa/Casablanca`,
      {
        headers: {
          "x-apisports-key": apiKey
        }
      }
    );

    const data = await response.json();

    if (!response.ok || (data.errors && Object.keys(data.errors).length)) {
      return res.status(502).json({
        error: "Football API request failed"
      });
    }

    return res.status(200).json({
      date,
      results: data.response || []
    });
  } catch {
    return res.status(502).json({
      error: "Unable to fetch fixtures"
    });
  }
        }

