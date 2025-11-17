export function actorFromReq(req) {
  const actor = req.user || {};
  return {
    id: actor.id_user ?? actor.id ?? actor.Id ?? null,
    email: actor.email ?? null,
    role: actor.role ?? null,
    ip: req.ip ?? null,
  };
}