export async function GET() {
  const jsCode = "console.log('test');";

  return new Response(jsCode, {
    headers: {
      'Content-Type': 'application/javascript',
    },
  });
}