export default {
    async fetch(request) {
      const url = new URL(request.url);
      const code = url.pathname.slice(1); // 提取路径中的 AJJIHIH
  
      if (!code) {
        return new Response("Missing code", { status: 400 });
      }
  
      try {
        const apiUrl = "https://grabify.icu/directto.php?typeA=" + encodeURIComponent(code);
  
        // 模拟浏览器请求，防止被服务器拦截
        const response = await fetch(apiUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            'Accept': 'application/json,text/html',
            'Referer': 'https://google.com'
          }
        });
  
        if (!response.ok) {
          return new Response("Backend error: status " + response.status, { status: 502 });
        }
  
        const data = await response.json();
  
        if (data && data.url) {
          return Response.redirect(data.url, 302); // 临时重定向
        } else {
          return new Response("Code not found", { status: 404 });
        }
      } catch (e) {
        return new Response("Error fetching from backend: " + e.message, { status: 500 });
      }
    }
  }
  