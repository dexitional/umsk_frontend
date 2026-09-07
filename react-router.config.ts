export default {
  // return a list of URLs to prerender at build time
  async prerender() {
    return ["/", "/login"];
  },
} satisfies any;
