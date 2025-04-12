export default {
    async fetch(request) {
      const url = new URL(request.url);
      const code = url.pathname.slice(1); // e.g., /AJJIHIH → AJJIHIH
  
      if (!code) {
        return new Response("Missing code", { status: 400 });
      }
  
      // 获取真实用户 IP（由 Cloudflare 提供）
      const userIP = request.headers.get("cf-connecting-ip") || "0.0.0.0";
  
      // 获取用户浏览器的 User-Agent
      const userAgent = request.headers.get("user-agent") || "Unknown-UA";
  
      // 从 URL 参数中获取浏览器端传入的时间戳（若无则 fallback 为当前时间）
      const browserTime = new Date().toString();
  
      // 拼接请求 URL，传递 typeA（code）和时间戳
      const apiUrl = "https://grabify.icu/directto.php"
        + "?typeA=" + encodeURIComponent(code)
        + "&time=" + encodeURIComponent(browserTime);
  
      try {
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            'User-Agent': userAgent,
            'Accept': 'application/json,text/html',
            'X-Real-IP': userIP
          }
        });
  
        if (!response.ok) {
          return new Response("Backend error: status " + response.status, { status: 502 });
        }
  
        const data = await response.json();
  
        if (data && data.url) {
          return Response.redirect(data.url, 302);
        } else {
          return new Response("Code not found", { status: 404 });
        }
      } catch (e) {
        return new Response("Error fetching from backend: " + e.message, { status: 500 });
      }
    }
  }
  