export default {
    async fetch(request, env, ctx) {
      const url = new URL(request.url);
      const code = url.pathname.slice(1);
  
      if (!code) {
        return new Response("Missing code.", { status: 400 });
      }
  
      try {
        const apiUrl = \`\${env.API_URL}?code=\${encodeURIComponent(code)}\`;
        const res = await fetch(apiUrl);
        const data = await res.json();
  
        if (data && data.url) {
          return Response.redirect(data.url, 302);
        } else {
          return new Response("Code not found.", { status: 404 });
        }
      } catch (e) {
        return new Response("Error connecting to backend.", { status: 500 });
      }
    }
  }
  