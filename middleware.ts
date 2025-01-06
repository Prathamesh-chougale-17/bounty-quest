import { auth } from "@/auth";

// route which has task/:id should be protected
const AUTHENTICATIONROUTES = ["/login"];

const isAuthenticationRoute = (path: string) => {
  // Check if path starts with /password/
  if (path.startsWith("/password/")) return true;
  if (AUTHENTICATIONROUTES.includes(path)) return true;
  return false;
};
const isProtected = (path: string) => {
  return path.startsWith("/tasks/");
};
export default auth((req) => {
  if (req.auth && isAuthenticationRoute(req.nextUrl.pathname)) {
    const dashboardUrl = new URL("/dashboard", req.nextUrl.origin);
    return Response.redirect(dashboardUrl);
  }

  if (isProtected(req.nextUrl.pathname) && !req.auth) {
    const newUrl = new URL("/login", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
