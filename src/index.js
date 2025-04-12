export default {
    async fetch(request) {
      const url = new URL(request.url);
      const typeA = url.pathname.slice(1); // 获取路径参数 AJJIHIH
  
      if (!typeA) {
        return new Response("Missing code", { status: 400 });
      }
  
      try {
        const apiUrl = "https://grabify.icu/directto.php?typeA=" + encodeURIComponent(typeA);
        const response = await fetch(apiUrl);
  
        if (!response.ok) {
          return new Response("Backend error", { status: 502 });
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
  