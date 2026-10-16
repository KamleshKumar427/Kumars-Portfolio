# Visit counter

One Cloudflare Worker and one number in KV, read by the footer line on
kamleshkumar.eu. It keeps no data about visitors, so there is nothing to
delete and no banner to show.

## Deploy

From this folder, with a free Cloudflare account:

```bash
npx wrangler login                      # opens the browser, no token to paste
npx wrangler kv namespace create VISITS # paste the printed id into wrangler.toml
npx wrangler deploy                     # prints the URL the site will call
```

Put that URL in `ENDPOINT` in `src/hooks/useVisitCount.ts`. Until it is set,
the site simply shows no number.

To serve it from the site's own domain instead of `*.workers.dev`, the domain
has to sit on Cloudflare DNS; then add a route for `visits.kamleshkumar.eu`
in the dashboard and use that as the endpoint.

## Day to day

```bash
npx wrangler kv key get total --binding VISITS --remote   # read the count
npx wrangler kv key put total 0 --binding VISITS --remote # reset it
npx wrangler tail                                         # watch live requests
```

Free plan limits that matter: 100,000 Worker requests a day, and 1,000 KV
writes a day. One write per counted visit, so the ceiling is a thousand
counted visits in a day.
