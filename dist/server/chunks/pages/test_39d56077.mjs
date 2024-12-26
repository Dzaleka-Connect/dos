const prerender = false;
const GET = async () => {
  return new Response(JSON.stringify({
    message: "API is working in server mode"
  }), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
};

export { GET, prerender };
