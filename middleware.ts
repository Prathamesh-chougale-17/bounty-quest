import { auth } from "@/auth";

// route which has task/:id should be protected

const isProtected = (path: string) => {
  return path.startsWith("/task/");
};
export default auth((req) => {
  if (isProtected(req.nextUrl.pathname) && !req.auth) {
    const newUrl = new URL("/login", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
