const { REACT_APP_API_URL } = import.meta.env;

// Backend `path` values look like "ams/25010195.jpg" or
// "ams/25010195_<id>.pdf" (see backend/util/amsFileStorage.ts) — deliberately
// named to match the existing GET /auth/file endpoint's own lookup
// convention (public/ams/{tag}.jpg, falling back to {tag}.pdf), so serving
// them is just a matter of stripping the folder prefix and extension back
// out into that endpoint's `tag` query param.
function amsFileUrl(relativePath: string, type?: "image"): string {
  const tag = relativePath.replace(/^ams\//, "").replace(/\.[^./]+$/, "");
  const typeParam = type ? `&type=${type}` : "";
  return `${REACT_APP_API_URL}/auth/file/?tag=${encodeURIComponent(tag)}${typeParam}`;
}

// A record predating the blob->file migration still has its data directly
// in `photo` (a data: URI, renders as-is in an <img src>); a migrated one
// has `path` instead. `fallback` is optional and deliberately not applied
// when omitted — callers using this to check "does a photo actually exist"
// (e.g. gating a submit button) need undefined, not a placeholder image URL,
// when neither field is set; display-only callers should pass a fallback.
export function resolveAmsPhotoSrc(record: { photo?: string | null; path?: string | null } | null | undefined, fallback: string): string;
export function resolveAmsPhotoSrc(record: { photo?: string | null; path?: string | null } | null | undefined): string | undefined;
export function resolveAmsPhotoSrc(record: { photo?: string | null; path?: string | null } | null | undefined, fallback?: string): string | undefined {
  if (record?.photo) return record.photo;
  if (record?.path) return amsFileUrl(record.path, "image");
  return fallback;
}

// A legacy bug in saveStepDocument (backend) sometimes overwrote `base64`
// with a full "https://<old-domain>/api/auth/file/?tag=<serial>_<id>" URL
// instead of leaving real base64 data or a relative `path`. The domain in
// that URL is stale (or just wrong for the environment we're running in
// now), but the `tag` query param it carries is still the correct file
// reference — pull it out and rebuild the link against today's API instead
// of using the dead URL as-is.
function extractTagFromLegacyFileUrl(url: string): string | undefined {
  const match = url.match(/[?&]tag=([^&]+)/);
  return match ? decodeURIComponent(match[1]) : undefined;
}

// Same idea as resolveAmsPhotoSrc for stepDocument rows, with one extra
// wrinkle: `base64` pre-migration is usually a genuine blob (data: URI, or
// bare base64 needing one built from `mime`), but for rows hit by the
// legacy bug above it's actually a dead URL — detect and repair that case
// rather than using it as a link target verbatim. `path` post-migration
// works exactly like the photo case.
export function resolveAmsDocumentSrc(record: { base64?: string | null; path?: string | null; mime?: string | null } | null | undefined): string | undefined {
  if (record?.base64) {
    if (/^https?:\/\//i.test(record.base64)) {
      const tag = extractTagFromLegacyFileUrl(record.base64);
      return tag ? amsFileUrl(`ams/${tag}.pdf`) : undefined;
    }
    return record.base64.startsWith("data:") ? record.base64 : `data:${record.mime || "application/pdf"};base64,${record.base64}`;
  }
  if (record?.path) return amsFileUrl(record.path);
  return undefined;
}
