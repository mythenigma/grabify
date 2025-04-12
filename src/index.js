export default {
    async fetch(request, env) {
      const url = new URL(request.url);
      const pathname = url.pathname;
  
      // ✅ 像素追踪处理：/wx/AJJIIJA.png
      if (pathname.startsWith("/wx/") && pathname.endsWith(".png")) {
        const code = pathname.slice(4, -4); // 去掉 "/wx/" 和 ".png"
        const userIP = request.headers.get("cf-connecting-ip") || "0.0.0.0";
        const userAgent = request.headers.get("user-agent") || "Unknown-UA";
  
        const logUrl = `${env.WXLOG_URL}?typeA=${encodeURIComponent(code)}`;
  
        // 调用后端记录像素追踪
        await fetch(logUrl, {
          method: "GET",
          headers: {
            "User-Agent": userAgent,
            "X-Real-IP": userIP
          }
        });
  
        // 返回透明 1×1 PNG
        const transparentPng = Uint8Array.from([
          0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A,
          0x00,0x00,0x00,0x0D,0x49,0x48,0x44,0x52,
          0x00,0x00,0x00,0x01,0x00,0x00,0x00,0x01,
          0x08,0x06,0x00,0x00,0x00,0x1F,0x15,0xC4,
          0x89,0x00,0x00,0x00,0x0A,0x49,0x44,0x41,
          0x54,0x78,0x9C,0x63,0x00,0x01,0x00,0x00,
          0x05,0x00,0x01,0x0D,0x0A,0x2D,0xB4,0x00,
          0x00,0x00,0x00,0x49,0x45,0x4E,0x44,0xAE,
          0x42,0x60,0x82
        ]);
  
        return new Response(transparentPng, {
          status: 200,
          headers: {
            "Content-Type": "image/png",
            "Content-Length": transparentPng.length.toString(),
            "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0"
          }
        });
      }
  
      // ✅ 正常跳转处理：/AJJIHIH
      const code = pathname.slice(1);
      if (!code) {
        return new Response("Missing code", { status: 400 });
      }
  
      const userIP = request.headers.get("cf-connecting-ip") || "0.0.0.0";
      const userAgent = request.headers.get("user-agent") || "Unknown-UA";
      const browserTime = new Date().toString();
  
      const apiUrl = `${env.API_URL}?typeA=${encodeURIComponent(code)}&time=${encodeURIComponent(browserTime)}`;
  
      try {
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "User-Agent": userAgent,
            "Accept": "application/json,text/html",
            "X-Real-IP": userIP
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
  